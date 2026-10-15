import React from 'react';
import { Search, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Elegí tu tienda y catálogo',
      description:
        'Explorá los productos con precios actualizados y fotos reales. El catálogo está sincronizado en tiempo real con el stock físico del local.',
      icon: Search,
      color: 'from-cyan-500 to-blue-500',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      number: '02',
      title: 'Armá tu pedido sin registros',
      description:
        'Agregá productos al carrito, seleccioná Envío a domicilio o Retiro en el local e ingresá tus datos sin descargar apps ni recordar contraseñas.',
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-500',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      number: '03',
      title: 'Coordiná directo por WhatsApp',
      description:
        'El pedido llega ordenado y detallado al WhatsApp oficial del comercio. Pagás por transferencia, efectivo o tarjeta y coordinás la entrega sin intermediarios.',
      icon: MessageCircle,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden scroll-mt-20">
      {/* Luz Ambiental de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Experiencia Ágil y Sin Fricciones</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¿Cómo comprar en <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Prender Stores?
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Conectamos compradores con los negocios de siempre. Fácil, rápido y con la cercanía de la atención personalizada de cada comerciante.
          </p>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-3xl p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Número y Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors">
                      {step.number}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${step.color} text-white shadow-lg shadow-blue-500/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sin costo adicional por pedido</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Inferior de Garantía */}
        <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Comercio 100% Justo y Transparente</p>
              <p className="text-xs text-slate-400">Tu compra apoya a comerciantes locales. Sin comisiones abusivas de intermediarios.</p>
            </div>
          </div>

          <a
            href="#explorar-tiendas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition shrink-0"
          >
            <span>Ver comercios</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
