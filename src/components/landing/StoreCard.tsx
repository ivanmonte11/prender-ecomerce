import React from 'react';
import Image from 'next/image';
import { ExternalLink, ArrowRight, MapPin, BadgeCheck, Truck, ShoppingBag, MessageCircle } from 'lucide-react';

export interface TenantCardData {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  address: string | null;
  phone?: string | null;
  shippingFee?: number | null;
  freeShippingThreshold?: number | null;
  _count?: {
    products?: number;
  };
}

interface StoreCardProps {
  tenant: TenantCardData;
  rootDomain: string;
}

export function StoreCard({ tenant, rootDomain }: StoreCardProps) {
  const storeUrl =
    process.env.NODE_ENV === 'development'
      ? `http://${tenant.slug}.${rootDomain}`
      : `https://${tenant.slug}.${rootDomain}`;

  const hasFreeShipping =
    tenant.shippingFee === 0 ||
    (typeof tenant.freeShippingThreshold === 'number' && tenant.freeShippingThreshold > 0);

  const productCount = tenant._count?.products;

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Banner Superior con Cover y Badges Flotantes */}
      <div className="h-32 bg-slate-100 relative w-full overflow-hidden">
        {tenant.bannerUrl ? (
          <Image
            src={tenant.bannerUrl}
            alt={tenant.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-violet-100 via-indigo-50 to-cyan-100 flex items-center justify-center">
            <span className="text-violet-900/20 font-black text-2xl tracking-widest uppercase">
              Prender Store
            </span>
          </div>
        )}

        {/* Gradiente sutil para legibilidad de badges sobre banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Badge: Verificada por Prender ERP (Azul Cian) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500 text-white text-[11px] font-bold shadow-md">
          <BadgeCheck className="w-3.5 h-3.5 fill-white text-cyan-500" />
          <span>Verificada</span>
        </div>

        {/* Badge: Envíos */}
        {hasFreeShipping && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
            <Truck className="w-3.5 h-3.5" />
            <span>Envío Gratis</span>
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between relative pt-0">
        <div>
          {/* Fila del Logo flotante y Acceso directo */}
          <div className="flex items-end justify-between -mt-10 mb-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-md relative shrink-0">
              {tenant.logoUrl ? (
                <Image
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-violet-700 text-xl bg-gradient-to-tr from-violet-50 to-indigo-100">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Micro Badge de Productos en Línea */}
            {typeof productCount === 'number' && productCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3 h-3 text-violet-600" />
                <span>{productCount} {productCount === 1 ? 'producto' : 'productos'}</span>
              </span>
            )}
          </div>

          {/* Nombre de la Tienda */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors flex items-center justify-between">
            <span className="truncate">{tenant.name}</span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors shrink-0 ml-2" />
          </h3>

          {/* Categoría / Rubro */}
          {tenant.category && (
            <span className="inline-block mt-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
              {tenant.category}
            </span>
          )}

          {/* Dirección o Localidad */}
          {tenant.address ? (
            <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{tenant.address}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-2.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Envíos a todo el país / Local</span>
            </p>
          )}

          {/* Tags de Servicios Soportados */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              <span>Pedido WhatsApp</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
              <Truck className="w-3 h-3 text-cyan-600" />
              <span>Envío / Retiro</span>
            </span>
          </div>
        </div>

        {/* Footer de Tarjeta con Call to Action */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600 group-hover:text-violet-700">
          <span>Ver catálogo online</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </a>
  );
}