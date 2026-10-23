import type { ProductVariantStock } from '@/types/store';

export function parseVariantStock(value: unknown): ProductVariantStock[] | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return [];
    if (!('size' in entry) || typeof entry.size !== 'string') return [];
    if (!('color' in entry) || typeof entry.color !== 'string') return [];
    if (!('stock' in entry) || typeof entry.stock !== 'number' || !Number.isFinite(entry.stock)) {
      return [];
    }
    return [{ size: entry.size, color: entry.color, stock: Math.max(0, entry.stock) }];
  });
}

export function getVariantStock(
  variantStock: ProductVariantStock[] | null | undefined,
  size: string | null | undefined,
  color: string | null | undefined
): number | null {
  if (variantStock == null) return null;
  const variant = variantStock.find(
    (entry) => entry.size === (size || '') && entry.color === (color || '')
  );
  return variant?.stock ?? 0;
}

export function getOptionStock(
  variantStock: ProductVariantStock[] | null | undefined,
  candidate: string,
  selectedOther: string | null,
  option: 'size' | 'color'
): number | null {
  if (variantStock == null) return null;
  return variantStock
    .filter((entry) => entry[option] === candidate)
    .filter((entry) => !selectedOther || entry[option === 'size' ? 'color' : 'size'] === selectedOther)
    .reduce((maximum, entry) => Math.max(maximum, entry.stock), 0);
}
