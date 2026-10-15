import React from 'react';
import { ShieldCheck, Search, ArrowRight, Zap, CheckCircle2, MessageCircle } from 'lucide-react';

interface LandingHeroProps {
  totalStores: number;
}

export function LandingHero({ totalStores }: LandingHeroProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden border-b border-slate-800/80 bg-slate-950">
      {/* Luces Ambientales de Fondo (Sensación de Profundidad) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Sutil Grid de Fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        {/* Micro-badge de Confianza */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-cyan-400 text-xs sm:text-sm font-semibold border border-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Marketplace Oficial de Comercios Locales Verificados</span>
        </div>

        {/* Titular Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Comprá directo en tus <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            comercios preferidos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
          Explorá catálogos oficiales con fotos y precios actualizados en tiempo real por el sistema de cada local.
          Realizá tu pedido online y coordiná la entrega <strong className="text-white font-semibold">directamente por WhatsApp</strong>, sin intermediarios ni costos extra.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#explorar-tiendas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5 text-slate-950" />
            <span>Explorar Tiendas Disponibles</span>
          </a>

          <a
            href="https://prender.store"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all hover:text-white"
          >
            <span>¿Tenés un negocio? Sumalo acá</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </a>
        </div>

        {/* Métricas Vivas e Indicadores de Confianza */}
        <div className="pt-8 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white">{totalStores}</p>
                <p className="text-xs text-slate-400 font-medium">Tiendas Verificadas</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white">0% Comisiones</p>
                <p className="text-xs text-slate-400 font-medium">Precio Directo de Local</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white">WhatsApp</p>
                <p className="text-xs text-slate-400 font-medium">Atención Personalizada</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white">Stock Real</p>
                <p className="text-xs text-slate-400 font-medium">Sync con Prender ERP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}