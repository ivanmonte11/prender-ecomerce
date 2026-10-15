import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200/80 bg-white text-slate-500 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Columna Principal - Branding */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            {/* Contenedor con Gradiente Prender */}
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-1 shadow-md shadow-violet-500/20 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/shoppers-l.png"
                                    alt="Prender Shoppers Logo"
                                    width={36}
                                    height={36}
                                    className="object-contain w-full h-full drop-shadow-md"
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                Prender<span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Shoppers</span>
                            </span>
                        </Link>

                        <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                            El marketplace local de comercios independientes verificados. Comprá directo en tus tiendas preferidas sin intermediarios ni comisiones abusivas.
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Plataforma oficial de comercios Prender ERP</span>
                        </div>
                    </div>

                    {/* Columna 2: Marketplace */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Marketplace
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a href="#explorar-tiendas" className="hover:text-violet-600 transition-colors">
                                    Directorio de Tiendas
                                </a>
                            </li>
                            <li>
                                <a href="#como-funciona" className="hover:text-violet-600 transition-colors">
                                    ¿Cómo Comprar?
                                </a>
                            </li>
                            <li>
                                <a href="#explorar-tiendas" className="hover:text-violet-600 transition-colors">
                                    Envíos Gratis
                                </a>
                            </li>
                            <li>
                                <a href="#explorar-tiendas" className="hover:text-violet-600 transition-colors">
                                    Retiro en Tienda
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Para Comercios */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Para Negocios
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors flex items-center gap-1"
                                >
                                    <span>Prender ERP</span>
                                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors"
                                >
                                    Crear Tienda Web
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors"
                                >
                                    Sistema de Facturación
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors"
                                >
                                    Control de Stock
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Confianza y Soporte */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                            Soporte y Ayuda
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors"
                                >
                                    Centro de Ayuda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://prender.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-violet-600 transition-colors"
                                >
                                    Contacto Comercial
                                </a>
                            </li>
                            <li>
                                <span className="text-xs text-slate-500 font-medium">
                                    Operando en Argentina
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Barra Inferior */}
                <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
                    <p className="font-medium">
                        © {currentYear} Prender ERP. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-2 font-medium text-slate-600">
                        <Cpu className="w-3.5 h-3.5 text-violet-600" />
                        <span>Desarrollado con tecnología de alta disponibilidad por <strong>MonteStack</strong>.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}