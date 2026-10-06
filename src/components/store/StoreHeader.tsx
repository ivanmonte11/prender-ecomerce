'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, X, MessageCircle, Store, MapPin } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Store Name */}
          <Link
            href={`/store/${tenant.slug}`}
            className="flex items-center gap-3 min-w-0 group hover:opacity-90 transition-opacity"
          >
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border border-gray-100 bg-white shadow-xs p-1 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                {tenant.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-base sm:text-lg truncate tracking-tight">
                {tenant.name}
              </h1>
              {tenant.address && (
                <p className="text-xs text-gray-500 hidden md:flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
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
                placeholder="Buscar productos por nombre..."
                className="w-full pl-9 pr-8 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm text-gray-900 placeholder-gray-400 rounded-full border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
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
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              aria-label="Ver carrito"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                {subtotal > 0 ? formatPrice(subtotal) : 'Mi Carrito'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 rounded-full border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
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
