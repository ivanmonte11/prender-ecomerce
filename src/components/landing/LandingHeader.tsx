import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LandingHeader() {
    return (
        <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Contenedor con Gradiente Prender */}
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-1 shadow-md shadow-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/30 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
                        <Image
                            src="/shoppers-l.png"
                            alt="Prender Shoppers Logo"
                            width={40}
                            height={40}
                            className="object-contain w-full h-full drop-shadow-md"
                            priority
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                                Prender<span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Shoppers</span>
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200/70">
                                Marketplace
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                            Comercios Locales Verificados
                        </span>
                    </div>
                </Link>

                {/* Center Quick Nav (Desktop) */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
                    <a
                        href="#explorar-tiendas"
                        className="hover:text-violet-600 transition-colors"
                    >
                        Explorar Tiendas
                    </a>
                    <a
                        href="#como-funciona"
                        className="hover:text-violet-600 transition-colors"
                    >
                        ¿Cómo Funciona?
                    </a>
                    <a
                        href="#para-comercios"
                        className="hover:text-violet-600 transition-colors flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Para Negocios</span>
                    </a>
                </nav>

                {/* Action Button */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://prender.store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 group"
                    >
                        <span>Crear mi Tienda</span>
                        <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </header>
    );
}