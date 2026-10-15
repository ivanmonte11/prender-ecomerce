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
      color: 'from-violet-600 to-indigo-600',
    },
    {
      number: '02',
      title: 'Armá tu pedido sin registros',
      description:
        'Agregá productos al carrito, seleccioná Envío a domicilio o Retiro en el local e ingresá tus datos sin descargar apps ni recordar contraseñas.',
      icon: ShoppingBag,
      color: 'from-indigo-600 to-blue-600',
    },
    {
      number: '03',
      title: 'Coordiná directo por WhatsApp',
      description:
        'El pedido llega ordenado y detallado al WhatsApp oficial del comercio. Pagás por transferencia, efectivo o tarjeta y coordinás la entrega sin intermediarios.',
      icon: MessageCircle,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 border-t border-slate-200/80 bg-white relative overflow-hidden scroll-mt-20">
      {/* Sutil Luz de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-violet-600" />
            <span>Experiencia Ágil y Sin Fricciones</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ¿Cómo comprar en <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Prender Shoppers?
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
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
                className="group relative bg-slate-50 border border-slate-200/80 hover:border-violet-300 hover:bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Número y Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-slate-300 group-hover:text-violet-600 transition-colors">
                      {step.number}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${step.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin costo adicional por pedido</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Inferior de Garantía */}
        <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-violet-50 via-indigo-50/40 to-cyan-50 border border-violet-100 rounded-2xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Comercio 100% Justo y Transparente</p>
              <p className="text-xs text-slate-600">Tu compra apoya a comerciantes locales. Sin comisiones abusivas de intermediarios.</p>
            </div>
          </div>

          <a
            href="#explorar-tiendas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800 transition shrink-0"
          >
            <span>Ver comercios</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
