'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, X, MessageCircle, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { StoreTenant } from '@/types/store';
import { cleanPhoneNumber, formatPrice } from '@/lib/whatsapp';

interface StoreHeaderProps {
  tenant: StoreTenant;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StoreHeader({ tenant, searchQuery, onSearchChange }: StoreHeaderProps) {
  const { totalItemsCount, subtotal, openCart } = useCart();
  const waPhone = cleanPhoneNumber(tenant.phone);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 gap-3 sm:gap-6">
          
          {/* Logo & Store Name */}
          <Link
            href={`/store/${tenant.slug}`}
            className="flex items-center gap-3.5 min-w-0 group hover:opacity-95 transition-opacity"
          >
            {tenant.logoUrl ? (
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white shadow-xs p-1 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all">
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div 
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary, #2563eb), var(--brand-secondary, #0f172a))`,
                }}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl text-white flex items-center justify-center font-black text-base sm:text-xl shadow-xs shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all"
              >
                {tenant.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-extrabold text-gray-900 text-base sm:text-lg lg:text-xl truncate tracking-tight">
                {tenant.name}
              </h1>
              {tenant.address && (
                <p className="text-xs text-gray-500 hidden md:flex items-center gap-1.5 truncate mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{tenant.address}</span>
                </p>
              )}
            </div>
          </Link>

          {/* Search Bar in Header (Desktop / Tablet) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar productos en la tienda..."
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white text-sm text-gray-900 placeholder-gray-400 rounded-full border border-gray-200/80 focus:border-gray-400 outline-hidden transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: WhatsApp Contact + Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {waPhone && (
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 rounded-full transition-all hover:brightness-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}

            {/* Cart Button with Prender Indigo/Violet Badge */}
            <button
              onClick={openCart}
              style={{
                backgroundColor: 'var(--brand-primary, #2563eb)',
              }}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 hover:brightness-105 cursor-pointer"
              aria-label="Ver carrito"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white text-[10px] sm:text-[11px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 animate-in zoom-in-50">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {subtotal > 0 ? formatPrice(subtotal) : 'Mi Carrito'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 rounded-full border border-gray-200 focus:border-gray-400 outline-hidden shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
