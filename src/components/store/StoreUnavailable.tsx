import React from 'react';
import Link from 'next/link';
import { Store, AlertTriangle, ArrowLeft } from 'lucide-react';

interface StoreUnavailableProps {
  title?: string;
  message?: string;
  reason?: 'NOT_FOUND' | 'INACTIVE' | 'ECOMMERCE_DISABLED';
}

export function StoreUnavailable({
  title,
  message,
  reason = 'NOT_FOUND',
}: StoreUnavailableProps) {
  const defaultTitle =
    reason === 'NOT_FOUND'
      ? 'Tienda no encontrada'
      : reason === 'ECOMMERCE_DISABLED'
      ? 'Tienda online no disponible'
      : 'Tienda temporalmente inactiva';

  const defaultMessage =
    reason === 'NOT_FOUND'
      ? 'El comercio que estás buscando no existe o la dirección web ingresada no es válida.'
      : reason === 'ECOMMERCE_DISABLED'
      ? 'Este comercio aún no tiene habilitada la venta online o se encuentra en mantenimiento.'
      : 'Esta tienda se encuentra temporalmente suspendida o fuera de servicio.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
          {reason === 'NOT_FOUND' ? (
            <Store className="w-8 h-8 stroke-1.5" />
          ) : (
            <AlertTriangle className="w-8 h-8 stroke-1.5" />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {title || defaultTitle}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {message || defaultMessage}
          </p>
        </div>

        <div className="pt-2">
          <a
            href="https://prender.store"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir a Prender</span>
          </a>
        </div>
      </div>
    </div>
  );
}
