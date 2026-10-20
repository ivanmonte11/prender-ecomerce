'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Package,
  Scale,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { StoreProduct, ProductColor } from '@/types/store';
import { formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: StoreProduct | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selections
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  if (!product) return null;

  const isWeight = product.saleType === 'weight';
  const step = isWeight ? 0.25 : 1;
  const minQty = isWeight ? 0.25 : 1;

  const [quantity, setQuantity] = useState<number>(minQty);

  const hasSizes = Boolean(
    (product.hasVariants || (product.sizes && product.sizes.length > 0)) &&
    product.sizes &&
    product.sizes.length > 0
  );

  const hasColors = Boolean(
    (product.hasVariants || (product.colors && product.colors.length > 0)) &&
    product.colors &&
    product.colors.length > 0
  );

  const isMissingSize = hasSizes && !selectedSize;
  const isMissingColor = hasColors && !selectedColor;
  const isSelectionIncomplete = isMissingSize || isMissingColor;

  // Quantity already in cart for this specific variant
  const currentVariantCartQty = getItemQuantity(
    product.id,
    selectedSize,
    selectedColor?.name
  );

  // Total quantity in cart across all variants of this product
  const totalProductCartQty = getItemQuantity(product.id);

  const allImages = [
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];

  const displayedImage = allImages[selectedImageIndex] || allImages[0] || null;

  const handleAddToCart = () => {
    if (isMissingSize && isMissingColor) {
      setValidationError('Por favor seleccioná un talle y un color para continuar.');
      return;
    }
    if (isMissingSize) {
      setValidationError('Por favor seleccioná un talle para continuar.');
      return;
    }
    if (isMissingColor) {
      setValidationError('Por favor seleccioná un color para continuar.');
      return;
    }

    setValidationError(null);
    addItem(product, quantity, {
      size: selectedSize,
      color: selectedColor,
    });

    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-2 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-950 rounded-full shadow-md transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Gallery / Image Section */}
          <div className="bg-gray-50/80 p-5 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative w-full aspect-square max-h-72 rounded-2xl overflow-hidden bg-white flex items-center justify-center border border-gray-100 shadow-inner">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-gray-300 flex flex-col items-center gap-2">
                  <Package className="w-16 h-16 stroke-1" />
                  <span className="text-xs text-gray-400 font-medium">Sin foto disponible</span>
                </div>
              )}
            </div>

            {/* Thumbnails if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={
                      selectedImageIndex === idx
                        ? {
                            borderColor: 'var(--brand-primary, #2563eb)',
                          }
                        : undefined
                    }
                    className={`w-12 h-12 rounded-xl border-2 overflow-hidden bg-white shrink-0 cursor-pointer transition-all ${
                      selectedImageIndex === idx
                        ? 'ring-2 ring-black/10 scale-105'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Category & Sale Type Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md">
                  {product.category}
                </span>
                {isWeight ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200/60">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    Por Kilogramo
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                    Por Unidad
                  </span>
                )}
                {(hasSizes || hasColors) && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-violet-50 text-violet-700 rounded-md border border-violet-100">
                    Variantes activas
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-tight">
                {product.name}
              </h3>

              {/* Highlighted Pricing Section */}
              <div className="space-y-2 pt-1">
                {/* List Price */}
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: 'var(--brand-primary, #2563eb)' }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isWeight ? 'Precio lista / kg' : 'Precio de lista'}
                  </span>
                </div>

                {/* Differentiated Prices (Transfer / Card) */}
                {(product.transferPrice || product.cardPrice) && (
                  <div className="space-y-1.5 pt-1">
                    {/* Transfer / Cash Price Highlight Card */}
                    {product.transferPrice && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 shadow-2xs">
                        <span className="text-base shrink-0">💰</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-sm text-emerald-800">
                            {formatPrice(product.transferPrice)}
                          </span>
                          <span className="text-xs text-emerald-700 ml-1.5 font-medium">
                            pagando por Transferencia / Efectivo
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Credit Card Price Card */}
                    {product.cardPrice && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/80 text-blue-900 shadow-2xs">
                        <span className="text-base shrink-0">💳</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-sm text-blue-800">
                            {formatPrice(product.cardPrice)}
                          </span>
                          <span className="text-xs text-blue-700 ml-1.5 font-medium">
                            con Tarjeta de Crédito
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Descripción
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selector */}
              {hasSizes && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Seleccioná tu Talle:
                      {selectedSize && (
                        <span className="ml-1.5 normal-case font-black text-violet-700">
                          {selectedSize}
                        </span>
                      )}
                    </label>
                    {!selectedSize && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        Obligatorio
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size);
                            setValidationError(null);
                          }}
                          className={`min-w-[42px] px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs ${
                            isSelected
                              ? 'border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-600/20 scale-102 font-black'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {hasColors && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Seleccioná tu Color:
                      {selectedColor && (
                        <span className="ml-1.5 normal-case font-black text-violet-700">
                          {selectedColor.name}
                        </span>
                      )}
                    </label>
                    {!selectedColor && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        Obligatorio
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.colors!.map((color, idx) => {
                      const isSelected = selectedColor?.name === color.name;
                      const isWhiteOrLight =
                        color.hex.toLowerCase() === '#fff' ||
                        color.hex.toLowerCase() === '#ffffff' ||
                        color.hex.toLowerCase() === 'white';

                      return (
                        <button
                          key={idx}
                          type="button"
                          title={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setValidationError(null);
                          }}
                          style={{ backgroundColor: color.hex }}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center shadow-2xs ${
                            isSelected
                              ? 'ring-2 ring-violet-600 ring-offset-2 scale-110 border-white'
                              : isWhiteOrLight
                              ? 'border-gray-300 hover:scale-105'
                              : 'border-transparent hover:scale-105'
                          }`}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 stroke-[3] ${
                                isWhiteOrLight ? 'text-gray-900' : 'text-white drop-shadow-xs'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Validation Warning Notice */}
              {validationError && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="font-medium">{validationError}</span>
                </div>
              )}

              {/* Feedback when item added */}
              {addedFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    ¡Agregado al carrito con éxito!
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              )}
            </div>

            {/* Cart Actions Section */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {/* Existing quantity in cart info */}
              {(hasSizes || hasColors) ? (
                currentVariantCartQty > 0 ? (
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>En tu carrito con esta variante:</span>
                    <span
                      className="font-bold"
                      style={{ color: 'var(--brand-primary, #2563eb)' }}
                    >
                      {currentVariantCartQty} {isWeight ? 'kg' : 'u.'}
                    </span>
                  </div>
                ) : totalProductCartQty > 0 ? (
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Total en carrito (otras variantes):</span>
                    <span className="font-bold text-gray-700">
                      {totalProductCartQty} {isWeight ? 'kg' : 'u.'}
                    </span>
                  </div>
                ) : null
              ) : null}

              {/* Quantity Stepper & Add Button */}
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(minQty, Math.round((q - step) * 1000) / 1000))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-2xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Restar cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm text-gray-900 px-3 min-w-[36px] text-center">
                    {quantity} {isWeight ? 'kg' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.round((q + step) * 1000) / 1000)}
                    style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white shadow-2xs hover:brightness-110 transition-all cursor-pointer"
                    aria-label="Sumar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSelectionIncomplete}
                  style={{
                    backgroundColor: isSelectionIncomplete
                      ? undefined
                      : 'var(--brand-primary, #2563eb)',
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold rounded-2xl shadow-md transition-all text-sm cursor-pointer ${
                    isSelectionIncomplete
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'text-white hover:shadow-lg active:scale-98 hover:brightness-105'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isMissingSize && isMissingColor
                      ? 'Elegí talle y color'
                      : isMissingSize
                      ? 'Elegí un talle'
                      : isMissingColor
                      ? 'Elegí un color'
                      : `Agregar (${formatPrice(product.price * quantity)})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
