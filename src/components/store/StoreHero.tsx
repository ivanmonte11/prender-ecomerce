'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Truck, Store as StoreIcon, ShieldCheck, Clock } from 'lucide-react';
import { StoreTenant } from '@/types/store';
import { cleanPhoneNumber, formatPrice } from '@/lib/whatsapp';

interface StoreHeroProps {
  tenant: StoreTenant;
}

export function StoreHero({ tenant }: StoreHeroProps) {
  const waPhone = cleanPhoneNumber(tenant.phone);

  return (
    <div className="relative bg-white border-b border-gray-100 overflow-hidden">
      {/* Banner / Cover Image */}
      <div className="relative h-36 sm:h-52 md:h-64 w-full bg-linear-to-r from-slate-800 via-emerald-950 to-slate-900 overflow-hidden">
        {tenant.bannerUrl ? (
          <img
            src={tenant.bannerUrl}
            alt={tenant.name}
            className="w-full h-full object-cover object-center opacity-85"
          />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Store Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Logo & Main Info */}
            <div className="flex items-end gap-4">
              <div className="relative">
                {tenant.logoUrl ? (
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-contain bg-white p-1.5 shadow-md border-2 border-white ring-1 ring-gray-100"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-2 border-white ring-1 ring-gray-100">
                    {tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white" title="Tienda Activa">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    {tenant.name}
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full">
                    {tenant.category || 'Tienda Oficial'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-gray-600">
                  {tenant.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{tenant.address}</span>
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions / WhatsApp */}
            {waPhone && (
              <div className="flex items-center gap-2 pt-2 md:pt-0">
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Delivery & Benefits Badges */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200/70 rounded-lg text-xs font-medium text-gray-700">
              <StoreIcon className="w-3.5 h-3.5 text-gray-500" />
              <span>Retiro en local disponible</span>
            </div>

            {tenant.shippingFee !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-xs font-medium text-emerald-800">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {tenant.freeShippingThreshold && tenant.freeShippingThreshold > 0 ? (
                    <>
                      Envío gratis a partir de{' '}
                      <strong className="font-bold">{formatPrice(tenant.freeShippingThreshold)}</strong>
                    </>
                  ) : tenant.shippingFee === 0 ? (
                    '¡Envío gratis a domicilio!'
                  ) : (
                    <>
                      Envío a domicilio ({formatPrice(tenant.shippingFee)})
                    </>
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200/70 rounded-lg text-xs font-medium text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Atención y pedidos online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
