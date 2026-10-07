'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Package, Scale } from 'lucide-react';
import { StoreProduct } from '@/types/store';
import { formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: StoreProduct | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);
  const isWeight = product.saleType === 'weight';
  const step = isWeight ? 0.25 : 1;
  const minQty = isWeight ? 0.25 : 1;
  
  const allImages = [
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];

  const displayedImage = allImages[selectedImageIndex] || allImages[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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
          <div className="bg-gray-50/80 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
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
              <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center">
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
                      selectedImageIndex === idx ? 'ring-2 ring-black/10 scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
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
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-tight">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-2">
                <span 
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: 'var(--brand-primary, #2563eb)' }}
                >
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {isWeight ? '/ kg' : '/ u.'}
                </span>
              </div>

              {product.description && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Descripción</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Cart Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {currentCartQty > 0 ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>En tu carrito:</span>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--brand-primary, #2563eb)' }}
                    >
                      {currentCartQty} {isWeight ? 'kg' : 'unidades'} ({formatPrice(currentCartQty * product.price)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-between border border-gray-200 rounded-2xl bg-gray-50 p-1 flex-1 shadow-inner">
                      <button
                        onClick={() => updateQuantity(product.id, currentCartQty - step)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Restar cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-extrabold text-base text-gray-900 px-3">
                        {currentCartQty} {isWeight ? 'kg' : ''}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, currentCartQty + step)}
                        style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-xs hover:brightness-110 transition-all cursor-pointer"
                        aria-label="Sumar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => addItem(product, minQty)}
                  style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98 hover:brightness-105 cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Agregar al Carrito ({formatPrice(product.price * minQty)})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
