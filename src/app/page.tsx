import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Store, Search, ExternalLink, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export const revalidate = 60; // Revalida el catálogo de tiendas cada 60 segundos

export default async function HomePage() {
  // Obtener únicamente comercios activos que tengan venta web habilitada
  const tenants = await prisma.tenant.findMany({
    where: {
      status: 'ACTIVE',
      eCommerceEnabled: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      logoUrl: true,
      bannerUrl: true,
      address: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Dominio base para los enlaces a cada storefront
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'prender.store';

  // Extraer el tipo explícito derivado del query de Prisma
  type TenantItem = (typeof tenants)[number];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white font-bold">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Prender<span className="text-blue-500">Stores</span>
            </span>
          </div>

          <a
            href="https://prender.store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <span>¿Tenés un negocio?</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Plataforma Oficial de Tiendas Locales</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Comprá directo en tus <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              comercios preferidos
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Explorá los catálogos oficiales, realizá tus pedidos online y coordiná la entrega directamente con cada tienda sin intermediarios.
          </p>
        </div>
      </section>

      {/* Directorio de Tiendas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Tiendas Disponibles</h2>
            <p className="text-sm text-slate-400">Descubrí las tiendas adheridas a Prender ERP</p>
          </div>
          <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
            {tenants.length} {tenants.length === 1 ? 'Comercio' : 'Comercio/s'}
          </span>
        </div>

        {tenants.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-300">Próximamente más tiendas</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Estamos sumando nuevos comercios a la plataforma todos los días.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant: TenantItem) => {
              // Construir URL fija o dinámica según entorno
              const storeUrl = process.env.NODE_ENV === 'development'
                ? `http://${tenant.slug}.${rootDomain}`
                : `https://${tenant.slug}.${rootDomain}`;

              return (
                <a
                  key={tenant.id}
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
                >
                  {/* Banner superior */}
                  <div className="h-28 bg-slate-800 relative w-full overflow-hidden">
                    {tenant.bannerUrl ? (
                      <Image
                        src={tenant.bannerUrl}
                        alt={tenant.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900" />
                    )}
                  </div>

                  {/* Info del comercio */}
                  <div className="p-5 flex-1 flex flex-col justify-between relative pt-0">
                    <div>
                      {/* Logo flotante */}
                      <div className="-mt-10 mb-3 relative inline-block">
                        <div className="w-16 h-16 rounded-xl border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg relative">
                          {tenant.logoUrl ? (
                            <Image
                              src={tenant.logoUrl}
                              alt={tenant.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xl">
                              {tenant.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                        <span>{tenant.name}</span>
                        <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>

                      {tenant.category && (
                        <span className="inline-block mt-1 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md">
                          {tenant.category}
                        </span>
                      )}

                      {tenant.address && (
                        <p className="text-xs text-slate-400 mt-3 line-clamp-1">
                          📍 {tenant.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-blue-400 group-hover:text-blue-300">
                      <span>Ver tienda online</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Call To Action */}
      <footer className="border-t border-slate-800/80 py-12 bg-slate-950 mt-12 text-center text-slate-500 text-sm">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <p className="text-slate-400">
            ¿Querés vender online con tu propio catálogo y gestionar tu stock en tiempo real?
          </p>
          <a
            href="https://prender.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-medium bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition"
          >
            <span>Crear mi tienda con Prender ERP</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-600 pt-6">
            © {new Date().getFullYear()} Prender. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}