import React from 'react';
import Link from 'next/link';
import { Store, ArrowRight, Sparkles } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Store className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                Prender<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Stores</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Marketplace
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Comercios Locales Verificados
            </span>
          </div>
        </Link>

        {/* Center Quick Nav (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#explorar-tiendas"
            className="hover:text-cyan-400 transition-colors"
          >
            Explorar Tiendas
          </a>
          <a
            href="#como-funciona"
            className="hover:text-cyan-400 transition-colors"
          >
            ¿Cómo Funciona?
          </a>
          <a
            href="#para-comercios"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Para Negocios</span>
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://prender.store"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/20 transition-all duration-300 border border-blue-400/30 group"
          >
            <span>Crear mi Tienda</span>
            <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
}