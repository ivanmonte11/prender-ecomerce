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
      className="group relative bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col backdrop-blur-xs"
    >
      {/* Banner Superior con Cover y Badges Flotantes */}
      <div className="h-32 bg-slate-800 relative w-full overflow-hidden">
        {tenant.bannerUrl ? (
          <Image
            src={tenant.bannerUrl}
            alt={tenant.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950/60" />
        )}

        {/* Gradiente sutil para legibilidad de badges sobre banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

        {/* Badge: Verificada por Prender ERP */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[11px] font-bold shadow-md">
          <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
          <span>Verificada</span>
        </div>

        {/* Badge: Envíos */}
        {hasFreeShipping && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shadow-md">
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
            <div className="w-16 h-16 rounded-2xl border-2 border-slate-950 bg-slate-800 overflow-hidden shadow-xl relative shrink-0">
              {tenant.logoUrl ? (
                <Image
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-cyan-400 text-xl bg-gradient-to-tr from-slate-900 to-slate-800">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Micro Badge de Productos en Línea */}
            {typeof productCount === 'number' && productCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3 h-3 text-cyan-400" />
                <span>{productCount} {productCount === 1 ? 'producto' : 'productos'}</span>
              </span>
            )}
          </div>

          {/* Nombre de la Tienda */}
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
            <span className="truncate">{tenant.name}</span>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </h3>

          {/* Categoría / Rubro */}
          {tenant.category && (
            <span className="inline-block mt-1 text-[11px] font-bold text-slate-300 bg-slate-800/80 border border-slate-700/50 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
              {tenant.category}
            </span>
          )}

          {/* Dirección o Localidad */}
          {tenant.address ? (
            <p className="text-xs text-slate-400 mt-2.5 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{tenant.address}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Envíos a todo el país / Local</span>
            </p>
          )}

          {/* Tags de Servicios Soportados */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950/60 border border-slate-800 px-2 py-0.5 rounded-md">
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>Pedido WhatsApp</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950/60 border border-slate-800 px-2 py-0.5 rounded-md">
              <Truck className="w-3 h-3 text-cyan-400" />
              <span>Envío / Retiro</span>
            </span>
          </div>
        </div>

        {/* Footer de Tarjeta con Call to Action */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
          <span>Ver catálogo online</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </a>
  );
}