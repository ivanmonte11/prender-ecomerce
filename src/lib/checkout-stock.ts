import { Prisma } from '@prisma/client';
import type { ProductVariantStock } from '@/types/store';
import { parseVariantStock } from '@/lib/variant-stock';

export interface CheckoutStockItem {
  productId: string;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
}

interface ProductStockRecord {
  id: string;
  name: string;
  quantity: number;
  variantStock: ProductVariantStock[] | null;
}

interface StockRequestGroup extends CheckoutStockItem {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseCheckoutStockItems(value: unknown): CheckoutStockItem[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const items: CheckoutStockItem[] = [];
  for (const rawItem of value) {
    if (!isRecord(rawItem)
      || typeof rawItem.productId !== 'string'
      || typeof rawItem.quantity !== 'number'
      || !Number.isFinite(rawItem.quantity)
      || rawItem.quantity <= 0) {
      return null;
    }

    const selectedSize = rawItem.selectedSize;
    if (selectedSize !== undefined && selectedSize !== null && typeof selectedSize !== 'string') {
      return null;
    }

    const rawColor = rawItem.selectedColor;
    let selectedColor: string | null = null;
    if (rawColor !== undefined && rawColor !== null) {
      if (typeof rawColor === 'string') {
        selectedColor = rawColor;
      } else if (isRecord(rawColor) && typeof rawColor.name === 'string') {
        selectedColor = rawColor.name;
      } else {
        return null;
      }
    }

    items.push({
      productId: rawItem.productId,
      quantity: rawItem.quantity,
      selectedSize: typeof selectedSize === 'string' ? selectedSize : null,
      selectedColor,
    });
  }
  return items;
}

function buildGroups(items: CheckoutStockItem[]): StockRequestGroup[] {
  const groups = new Map<string, StockRequestGroup>();
  for (const item of items) {
    const key = JSON.stringify([
      item.productId,
      item.selectedSize || '',
      item.selectedColor || '',
    ]);
    const existing = groups.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      groups.set(key, { ...item });
    }
  }
  return Array.from(groups.values());
}

export async function validateAndReserveCheckoutStock(
  transaction: Prisma.TransactionClient,
  tenantId: string,
  items: CheckoutStockItem[],
  reserve: boolean
): Promise<string | null> {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const lockedProducts = await transaction.$queryRaw<Array<{ id: string }>>(
    Prisma.sql`SELECT "id" FROM "products"
      WHERE "tenantId" = ${tenantId} AND "id" IN (${Prisma.join(productIds)})
      FOR UPDATE`
  );
  if (lockedProducts.length !== productIds.length) {
    return 'Uno o más productos ya no están disponibles en esta tienda.';
  }

  const products: ProductStockRecord[] = (await transaction.product.findMany({
    where: { tenantId, id: { in: productIds } },
    select: { id: true, name: true, quantity: true, variantStock: true },
  })).map((product) => ({
    id: product.id,
    name: product.name,
    quantity: Number(product.quantity),
    variantStock: parseVariantStock(product.variantStock),
  }));
  const productsById = new Map(products.map((product) => [product.id, product]));
  const groups = buildGroups(items);
  const requestedByProduct = new Map<string, number>();

  for (const group of groups) {
    const product = productsById.get(group.productId);
    if (!product) return 'Uno o más productos ya no están disponibles en esta tienda.';

    requestedByProduct.set(
      product.id,
      (requestedByProduct.get(product.id) || 0) + group.quantity
    );

    if (product.variantStock !== null) {
      const variant = product.variantStock.find(
        (entry) => entry.size === (group.selectedSize || '')
          && entry.color === (group.selectedColor || '')
      );
      if (!variant || variant.stock < group.quantity) {
        return `No hay stock suficiente de ${product.name} para la combinación seleccionada.`;
      }
    }
  }

  for (const [productId, requestedQuantity] of requestedByProduct) {
    const product = productsById.get(productId);
    if (!product || product.quantity < requestedQuantity) {
      return `No hay stock suficiente de ${product?.name || 'uno de los productos'}.`;
    }
  }

  if (!reserve) return null;

  for (const [productId, requestedQuantity] of requestedByProduct) {
    const product = productsById.get(productId);
    if (!product) continue;

    const variantStock = product.variantStock === null
      ? undefined
      : product.variantStock.map((entry) => {
        const requested = groups
          .filter((group) => group.productId === productId)
          .find((group) => (group.selectedSize || '') === entry.size
            && (group.selectedColor || '') === entry.color);
        return requested ? { ...entry, stock: entry.stock - requested.quantity } : entry;
      });

    await transaction.product.update({
      where: { id: productId },
      data: {
        quantity: { decrement: requestedQuantity },
        ...(variantStock
          ? {
            variantStock: variantStock.map((entry) => ({
              size: entry.size,
              color: entry.color,
              stock: entry.stock,
            })) as Prisma.InputJsonValue,
          }
          : {}),
      },
    });
  }

  return null;
}
