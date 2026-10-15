import React from 'react';
import { ShieldCheck, Search, ArrowRight, Zap, CheckCircle2, MessageCircle } from 'lucide-react';

interface LandingHeroProps {
  totalStores: number;
}

export function LandingHero({ totalStores }: LandingHeroProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden border-b border-slate-200/80 bg-slate-50">
      {/* Luces Ambientales Sutiles de Fondo (Modo Claro Prender) */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[350px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sutil Grid Decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        {/* Micro-badge de Confianza */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-violet-700 text-xs sm:text-sm font-semibold border border-violet-200 shadow-sm backdrop-blur-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600" />
          </span>
          <ShieldCheck className="w-4 h-4 text-violet-600" />
          <span>Marketplace Oficial de Comercios Locales Verificados</span>
        </div>

        {/* Titular Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
          Comprá directo en tus <br />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            comercios preferidos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-slate-600 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
          Explorá catálogos oficiales con fotos y precios actualizados en tiempo real por el sistema de cada local.
          Realizá tu pedido online y coordiná la entrega <strong className="text-slate-900 font-semibold">directamente por WhatsApp</strong>, sin intermediarios ni costos extra.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#explorar-tiendas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 transition-all shadow-xl shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5 text-white" />
            <span>Explorar Tiendas Disponibles</span>
          </a>

          <a
            href="https://prender.store"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
          >
            <span>¿Tenés un negocio? Sumalo acá</span>
            <ArrowRight className="w-4 h-4 text-violet-600" />
          </a>
        </div>

        {/* Métricas Vivas e Indicadores de Confianza */}
        <div className="pt-8 border-t border-slate-200/80 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900">{totalStores}</p>
                <p className="text-xs text-slate-500 font-medium">Tiendas Verificadas</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900">0% Comisiones</p>
                <p className="text-xs text-slate-500 font-medium">Precio Directo de Local</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900">WhatsApp</p>
                <p className="text-xs text-slate-500 font-medium">Atención Personalizada</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900">Stock Real</p>
                <p className="text-xs text-slate-500 font-medium">Sync con Prender ERP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}