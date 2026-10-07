'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Truck, Store as StoreIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StoreTenant } from '@/types/store';
import { cleanPhoneNumber, formatPrice } from '@/lib/whatsapp';

interface StoreHeroProps {
  tenant: StoreTenant;
}

export function StoreHero({ tenant }: StoreHeroProps) {
  const waPhone = cleanPhoneNumber(tenant.phone);

  return (
    <div className="relative bg-white border-b border-gray-100/80 overflow-hidden">
      {/* 1. Fondo Dinámico Ambiental Adaptativo (Capa 1 a 4) */}
      <div
        className="relative h-40 sm:h-56 md:h-68 w-full overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--brand-secondary, #0f172a)',
        }}
      >
        {tenant.bannerUrl ? (
          <img
            src={tenant.bannerUrl}
            alt={tenant.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            {/* Capa 2: Orbes de Luz Ambiental Desenfocadas */}
            <div
              className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-3xl opacity-25"
              style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
            />
            <div
              className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-3xl opacity-25"
              style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
            />
            {/* Capa 3: Textura de Malla Geométrica */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>
        )}

        {/* Capa 4: Gradiente Viñeta Oscuro para Contraste y Legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Contenedor de Información del Comercio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        <div className="pt-3 sm:pt-0 sm:-mt-16 space-y-4">

          {/* Fila Principal: Logo + Nombre + WhatsApp */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

            {/* Logo e Info Principal */}
            <div className="flex items-center sm:items-end gap-4 min-w-0">

              {/* Logo de la Tienda */}
              <div className="relative shrink-0">
                {tenant.logoUrl ? (
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.name}
                    className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl object-contain bg-white p-1.5 shadow-xl border-2 border-white ring-1 ring-black/5"
                  />
                ) : (
                  <div
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary, #2563eb), var(--brand-secondary, #0f172a))`,
                    }}
                    className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl border-2 border-white ring-1 ring-black/5"
                  >
                    {tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Badge Verificado de la Plataforma */}
                <div
                  className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm"
                  title="Tienda Verificada por Prender"
                >
                  <ShieldCheck className="w-3.5 h-3.5 fill-cyan-500 text-white" />
                </div>
              </div>

              {/* Nombre, Categoría y Dirección */}
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">
                    {tenant.name}
                  </h1>
                  {tenant.category && (
                    <span
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--brand-primary, #2563eb) 12%, transparent)',
                        color: 'var(--brand-primary, #2563eb)',
                        borderColor: 'color-mix(in srgb, var(--brand-primary, #2563eb) 25%, transparent)',
                      }}
                      className="px-2.5 py-0.5 text-[11px] font-bold border rounded-full shrink-0 tracking-wide uppercase"
                    >
                      {tenant.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                  {tenant.address && (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--brand-primary, #2563eb)' }} />
                      <span className="truncate">{tenant.address}</span>
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Botón WhatsApp */}
            {waPhone && (
              <div className="pt-1 sm:pt-0 shrink-0">
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Barra Informativa de Servicios */}
          <div className="pt-3 border-t border-gray-100">
            <div className="bg-gray-50/80 rounded-xl px-4 py-2.5 border border-gray-200/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">

              <div className="flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="font-medium">Retiro en local disponible</span>
              </div>

              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />

              {tenant.shippingFee !== null && (
                <>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {tenant.freeShippingThreshold && tenant.freeShippingThreshold > 0 ? (
                        <>
                          Envío gratis desde{' '}
                          <strong className="font-bold text-gray-900">{formatPrice(tenant.freeShippingThreshold)}</strong>
                        </>
                      ) : tenant.shippingFee === 0 ? (
                        <span className="font-bold text-emerald-600">
                          ¡Envío gratis a domicilio!
                        </span>
                      ) : (
                        <>
                          Envío a domicilio (<strong className="text-gray-900">{formatPrice(tenant.shippingFee)}</strong>)
                        </>
                      )}
                    </span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                </>
              )}

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="font-medium">Catálogo online y pedidos directos</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}