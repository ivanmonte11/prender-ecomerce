import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Columna Principal - Branding */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Store className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Prender<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Stores</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              El marketplace local de comercios independientes verificados. Comprá directo en tus tiendas preferidas sin intermediarios ni comisiones abusivas.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Plataforma oficial de comercios Prender ERP</span>
            </div>
          </div>

          {/* Columna 2: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#explorar-tiendas" className="hover:text-cyan-400 transition-colors">
                  Directorio de Tiendas
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">
                  ¿Cómo Comprar?
                </a>
              </li>
              <li>
                <a href="#explorar-tiendas" className="hover:text-cyan-400 transition-colors">
                  Envíos Gratis
                </a>
              </li>
              <li>
                <a href="#explorar-tiendas" className="hover:text-cyan-400 transition-colors">
                  Retiro en Tienda
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Para Comercios */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Para Negocios
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>Prender ERP</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Crear Tienda Web
                </a>
              </li>
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Sistema de Facturación
                </a>
              </li>
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Control de Stock
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Confianza y Soporte */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Soporte y Ayuda
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="https://prender.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contacto Comercial
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  Operando en Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>
            © {currentYear} Prender ERP. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Impulsando el comercio local con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>y tecnología transparente.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}