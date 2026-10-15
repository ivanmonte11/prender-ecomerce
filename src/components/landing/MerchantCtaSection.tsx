import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, RefreshCw, MessageSquare, Globe, Sparkles, Store } from 'lucide-react';

export function MerchantCtaSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: '0% Comisiones por venta',
      description:
        'Tus ganancias quedan 100% en tu bolsillo. No pagues el 15% o 20% que cobran los marketplaces tradicionales.',
      color: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
    },
    {
      icon: RefreshCw,
      title: 'Stock sincronizado con tu ERP',
      description:
        'Cada venta en el mostrador descuenta el inventario web al instante. Sin riesgo de vender productos sin stock.',
      color: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
    },
    {
      icon: MessageSquare,
      title: 'Pedidos directos a tu WhatsApp',
      description:
        'Recibí la orden ordenada con datos del cliente, método de entrega y productos listos para cobrar y despachar.',
      color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    },
    {
      icon: Globe,
      title: 'Tu propio link y presencia de marca',
      description:
        'Compartí tu URL personalizada (tunegocio.prender.store) en Instagram, WhatsApp y Google Maps.',
      color: 'text-violet-300 bg-violet-400/10 border-violet-400/20',
    },
  ];

  return (
    <section id="para-comercios" className="py-20 sm:py-28 relative overflow-hidden bg-slate-50 border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Contenedor Estilo SaaS con Contraste Visual de Alto Impacto */}
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-indigo-800/50">
          {/* Sutil Grid de Fondo en el Card */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Destellos de Luz Internos */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Encabezado */}
          <div className="max-w-3xl mx-auto text-center space-y-5 mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Para Dueños de Negocios y Locales</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Tenés un comercio? <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                Abrí tu tienda online y vendé sin comisiones
              </span>
            </h2>

            <p className="text-indigo-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
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
                  className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${b.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bloque CTA Central */}
          <div className="relative z-10 bg-slate-950/60 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Activación rápida sin contratos de permanencia</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Comenzá a vender online con Prender ERP hoy mismo
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200">
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
