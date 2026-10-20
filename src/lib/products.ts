/**
 * Utilidades para manejo normalizado y resiliente de productos en la tienda
 */

/**
 * Normaliza y devuelve un array de URLs de imágenes válidas para un producto.
 * Garantiza retrocompatibilidad total:
 * - Si `images` tiene elementos, los devuelve saneados.
 * - Si `images` está vacío pero existe `image`, devuelve `[product.image]`.
 * - Si no hay ninguna foto, devuelve array vacío `[]` para permitir fallbacks visuales elegantes.
 */
export function getProductImages(
  product: { image?: string | null; images?: string[] | null } | null | undefined
): string[] {
  if (!product) return [];

  const rawList: string[] = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    for (const img of product.images) {
      if (typeof img === 'string' && img.trim() !== '') {
        rawList.push(img.trim());
      }
    }
  }

  // Fallback si images está vacío o no contiene strings válidos pero sí existe image
  if (rawList.length === 0 && product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    rawList.push(product.image.trim());
  }

  // Evitar duplicados
  return Array.from(new Set(rawList));
}
