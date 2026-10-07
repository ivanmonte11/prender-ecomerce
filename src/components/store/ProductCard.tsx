'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Package, Scale, Eye } from 'lucide-react';
import { StoreProduct } from '@/types/store';
import { formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductCardProps {
  product: StoreProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const currentCartQty = getItemQuantity(product.id);
  const isWeight = product.saleType === 'weight';
  const step = isWeight ? 0.25 : 1;
  const minQty = isWeight ? 0.25 : 1;

  const imageSrc = product.image || (product.images && product.images[0]) || null;

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
        
        {/* Top Image Box */}
        <div
          onClick={() => setIsDetailOpen(true)}
          className="relative w-full aspect-square bg-gray-50/80 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-gray-100/50 transition-colors"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-gray-400 transition-colors">
              <Package className="w-12 h-12 stroke-1" />
              <span className="text-[10px] text-gray-400 mt-1 font-medium">Sin imagen</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            {isWeight ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full shadow-xs">
                <Scale className="w-3 h-3" />
                Por Kg
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-medium bg-black/60 text-white rounded-full backdrop-blur-xs">
                {product.category}
              </span>
            )}

            {/* Quick View hint */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 text-gray-800 p-1.5 rounded-full shadow-md">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Info & Price */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div
            onClick={() => setIsDetailOpen(true)}
            className="cursor-pointer space-y-1"
          >
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:opacity-85 transition-opacity">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing & Add to Cart Area */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium leading-none mb-0.5">
                {isWeight ? 'Precio x kg' : 'Precio'}
              </span>
              <span 
                className="text-base sm:text-lg font-black tracking-tight"
                style={{ color: 'var(--brand-primary, #2563eb)' }}
              >
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Action Buttons */}
            <div>
              {currentCartQty > 0 ? (
                <div 
                  style={{
                    borderColor: 'color-mix(in srgb, var(--brand-primary, #2563eb) 25%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--brand-primary, #2563eb) 8%, transparent)',
                  }}
                  className="flex items-center gap-1.5 border rounded-full p-0.5 shadow-2xs"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, currentCartQty - step);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer"
                    aria-label="Disminuir"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span 
                    className="text-xs font-black px-1 min-w-[20px] text-center"
                    style={{ color: 'var(--brand-primary, #2563eb)' }}
                  >
                    {currentCartQty}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, currentCartQty + step);
                    }}
                    style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-white hover:brightness-110 transition-all shadow-2xs cursor-pointer"
                    aria-label="Aumentar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(product, minQty);
                  }}
                  style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 hover:brightness-105 cursor-pointer"
                  aria-label="Agregar al carrito"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {isDetailOpen && (
        <ProductDetailModal
          product={product}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
}
