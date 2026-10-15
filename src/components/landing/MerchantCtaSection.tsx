import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, RefreshCw, MessageSquare, Globe, Sparkles, Store } from 'lucide-react';

export function MerchantCtaSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: '0% Comisiones por venta',
      description:
        'Tus ganancias quedan 100% en tu bolsillo. No pagues el 15% o 20% que cobran los marketplaces tradicionales.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: RefreshCw,
      title: 'Stock sincronizado con tu ERP',
      description:
        'Cada venta en el mostrador descuenta el inventario web al instante. Sin riesgo de vender productos sin stock.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: MessageSquare,
      title: 'Pedidos directos a tu WhatsApp',
      description:
        'Recibí la orden ordenada con datos del cliente, método de entrega y productos listos para cobrar y despachar.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Globe,
      title: 'Tu propio link y presencia de marca',
      description:
        'Compartí tu URL personalizada (tunegocio.prender.store) en Instagram, WhatsApp y Google Maps.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <section id="para-comercios" className="py-20 sm:py-28 relative overflow-hidden bg-slate-950 border-t border-slate-800/80 scroll-mt-20">
      {/* Luces Ambientales B2B */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Contenedor Estilo SaaS */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Sutil Grid de Fondo en el Card */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Encabezado */}
          <div className="max-w-3xl mx-auto text-center space-y-5 mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Para Dueños de Negocios y Locales</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Tenés un comercio? <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Abrí tu tienda online y vendé sin comisiones
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Sumate a la plataforma que combina la potencia de un sistema de facturación y stock (Prender ERP) con una tienda web moderna pensada para multiplicar tus ventas por WhatsApp.
            </p>
          </div>

          {/* Grilla de 4 Beneficios Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${b.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bloque CTA Central */}
          <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Activación rápida sin contratos de permanencia</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Comenzá a vender online con Prender ERP hoy mismo
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Probá la plataforma y descubrí cómo simplificar tu facturación, stock y ventas digitales.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="https://prender.store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Store className="w-4 h-4 text-slate-950" />
                <span>Crear Tienda en Prender</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
