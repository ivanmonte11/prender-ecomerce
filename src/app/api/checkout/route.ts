import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import {
  parseCheckoutStockItems,
  validateAndReserveCheckoutStock,
  type CheckoutStockItem,
} from '@/lib/checkout-stock';
import type { DeliveryType, ProductColor } from '@/types/store';

interface CheckoutLine extends Omit<CheckoutStockItem, 'selectedColor'> {
  productName: string;
  selectedColor: ProductColor | null;
  transferPrice: number | null;
  unitPrice: number;
  saleType: string;
}

interface CheckoutRequest {
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryType: DeliveryType;
  address: string | null;
  notes: string | null;
  items: CheckoutLine[];
}

class StockValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCheckoutRequest(value: unknown): CheckoutRequest | null {
  if (!isRecord(value)
    || typeof value.tenantId !== 'string'
    || typeof value.customerName !== 'string'
    || typeof value.customerPhone !== 'string'
    || (value.deliveryType !== 'PICKUP' && value.deliveryType !== 'DELIVERY')
    || !Array.isArray(value.items)) {
    return null;
  }

  const stockItems = parseCheckoutStockItems(value.items);
  if (!stockItems || stockItems.length !== value.items.length) return null;

  const items: CheckoutLine[] = [];
  for (let index = 0; index < value.items.length; index += 1) {
    const rawItem = value.items[index];
    if (!isRecord(rawItem)
      || typeof rawItem.unitPrice !== 'number'
      || !Number.isFinite(rawItem.unitPrice)
      || rawItem.unitPrice < 0) {
      return null;
    }

    const rawColor = rawItem.selectedColor;
    let selectedColor: ProductColor | null = null;
    if (isRecord(rawColor) && typeof rawColor.name === 'string' && typeof rawColor.hex === 'string') {
      selectedColor = { name: rawColor.name, hex: rawColor.hex };
    } else if (rawColor !== undefined && rawColor !== null) {
      return null;
    }

    if (
      rawItem.transferPrice !== undefined
      && rawItem.transferPrice !== null
      && (typeof rawItem.transferPrice !== 'number' || !Number.isFinite(rawItem.transferPrice))
    ) {
      return null;
    }

    items.push({
      ...stockItems[index],
      productName: typeof rawItem.productName === 'string' ? rawItem.productName : 'Producto',
      selectedColor,
      transferPrice: typeof rawItem.transferPrice === 'number' ? rawItem.transferPrice : null,
      unitPrice: rawItem.unitPrice,
      saleType: typeof rawItem.saleType === 'string' ? rawItem.saleType : 'unit',
    });
  }

  return {
    tenantId: value.tenantId,
    customerName: value.customerName.trim(),
    customerPhone: value.customerPhone.trim(),
    customerEmail: typeof value.customerEmail === 'string' ? value.customerEmail.trim() : null,
    deliveryType: value.deliveryType,
    address: typeof value.address === 'string' ? value.address.trim() : null,
    notes: typeof value.notes === 'string' ? value.notes.trim() : null,
    items,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const checkout = parseCheckoutRequest(body);
    if (!checkout || !checkout.customerName || !checkout.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Completá tus datos y revisá los productos del pedido.' },
        { status: 400 }
      );
    }
    if (checkout.deliveryType === 'DELIVERY' && !checkout.address) {
      return NextResponse.json(
        { success: false, error: 'La dirección de entrega es obligatoria.' },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: checkout.tenantId },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        eCommerceEnabled: true,
        shippingFee: true,
        freeShippingThreshold: true,
      },
    });
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'La tienda no existe.' },
        { status: 404 }
      );
    }
    if (tenant.status !== 'ACTIVE' || !tenant.eCommerceEnabled) {
      return NextResponse.json(
        { success: false, error: 'La tienda no está habilitada para recibir pedidos en este momento.' },
        { status: 403 }
      );
    }

    const subtotal = checkout.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const shippingFee = checkout.deliveryType === 'DELIVERY'
      ? Number(tenant.freeShippingThreshold) > 0
        && subtotal >= Number(tenant.freeShippingThreshold)
        ? 0
        : Number(tenant.shippingFee) || 0
      : 0;
    const total = subtotal + shippingFee;
    const transferSubtotal = checkout.items.reduce(
      (sum, item) => sum + item.quantity * (item.transferPrice || item.unitPrice),
      0
    );
    const transferTotal = transferSubtotal + shippingFee;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#WEB-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const order = await prisma.$transaction(async (transaction) => {
      const stockError = await validateAndReserveCheckoutStock(
        transaction,
        tenant.id,
        checkout.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor?.name || null,
        })),
        true
      );
      if (stockError) throw new StockValidationError(stockError);

      return transaction.onlineOrder.create({
        data: {
          orderNumber,
          tenantId: tenant.id,
          customerName: checkout.customerName,
          customerPhone: checkout.customerPhone,
          customerEmail: checkout.customerEmail,
          deliveryType: checkout.deliveryType,
          address: checkout.deliveryType === 'DELIVERY' ? checkout.address : null,
          notes: checkout.notes,
          total,
          status: 'PENDING',
          items: {
            create: checkout.items.map((item) => {
              const variantParts: string[] = [];
              if (item.selectedSize) variantParts.push(`Talle: ${item.selectedSize}`);
              if (item.selectedColor) variantParts.push(`Color: ${item.selectedColor.name}`);
              const variantSuffix = variantParts.length ? ` (${variantParts.join(' | ')})` : '';
              return {
                productId: item.productId,
                productName: `${item.productName}${variantSuffix}`,
                quantity: item.quantity,
                unitPrice: new Prisma.Decimal(item.unitPrice),
                subtotal: new Prisma.Decimal(item.quantity * item.unitPrice),
              };
            }),
          },
        },
        include: { items: true },
      });
    });

    const whatsappUrl = generateWhatsAppOrderUrl({
      orderNumber: order.orderNumber,
      storeName: tenant.name,
      storePhone: tenant.phone,
      customerName: checkout.customerName,
      customerPhone: checkout.customerPhone,
      deliveryType: checkout.deliveryType,
      address: checkout.address,
      notes: checkout.notes,
      items: checkout.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        transferPrice: item.transferPrice,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        saleType: item.saleType,
      })),
      subtotal,
      transferSubtotal,
      shippingFee,
      total,
      transferTotal,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      whatsappUrl,
    });
  } catch (error: unknown) {
    if (error instanceof StockValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    console.error('Error al crear orden de compra online:', error);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error al procesar el pedido.' },
      { status: 500 }
    );
  }
}
