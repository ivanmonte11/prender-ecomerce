'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cleanPhoneNumber, formatPrice } from '@/lib/whatsapp';
import type { DeliveryType } from '@/types/store';

type PaymentStatus = 'approved' | 'pending' | 'rejected';

interface CheckoutSummary {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryType: DeliveryType;
  address: string;
  notes: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    selectedSize?: string | null;
    selectedColor?: string | null;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

interface OrderStatusViewProps {
  slug: string;
  storeName: string;
  storePhone: string | null;
  status: PaymentStatus;
  paymentId: string | null;
  externalReference: string | null;
}

function isCheckoutSummary(value: unknown): value is CheckoutSummary {
  if (typeof value !== 'object' || value === null) return false;
  const summary = value as Record<string, unknown>;
  return typeof summary.customerName === 'string'
    && typeof summary.customerPhone === 'string'
    && typeof summary.customerEmail === 'string'
    && (summary.deliveryType === 'PICKUP' || summary.deliveryType === 'DELIVERY')
    && typeof summary.address === 'string'
    && typeof summary.notes === 'string'
    && typeof summary.subtotal === 'number'
    && Number.isFinite(summary.subtotal)
    && typeof summary.shippingFee === 'number'
    && Number.isFinite(summary.shippingFee)
    && typeof summary.total === 'number'
    && Number.isFinite(summary.total)
    && Array.isArray(summary.items)
    && summary.items.every((item: unknown) =>
      typeof item === 'object'
      && item !== null
      && 'name' in item
      && typeof item.name === 'string'
      && 'quantity' in item
      && typeof item.quantity === 'number'
      && Number.isFinite(item.quantity)
      && 'unitPrice' in item
      && typeof item.unitPrice === 'number'
      && Number.isFinite(item.unitPrice)
      && (!('selectedSize' in item) || item.selectedSize === null || typeof item.selectedSize === 'string')
      && (!('selectedColor' in item) || item.selectedColor === null || typeof item.selectedColor === 'string')
    );
}

export function OrderStatusView({
  slug,
  storeName,
  storePhone,
  status,
  paymentId,
  externalReference,
}: OrderStatusViewProps) {
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`prender_checkout_${slug}`);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isCheckoutSummary(parsed)) setSummary(parsed);
      }
    } catch (error) {
      console.error('No se pudo recuperar el resumen del checkout:', error);
    }
    if (status === 'approved') clearCart();
  }, [clearCart, slug, status]);

  const orderReference = externalReference || paymentId || 'Pago Mercado Pago';
  const orderDetails = summary
    ? `\n${summary.items.map((item) => {
      const variants = [
        item.selectedSize ? `Talle: ${item.selectedSize}` : '',
        item.selectedColor ? `Color: ${item.selectedColor}` : '',
      ].filter(Boolean).join(' / ');
      return `• ${item.quantity} x ${item.name}${variants ? ` (${variants})` : ''}`;
    }).join('\n')}\nTotal: ${formatPrice(summary.total)}`
    : '';
  const message = status === 'approved'
    ? `Hola ${storeName}, realicé el pago de mi compra en Mercado Pago. Referencia: ${orderReference}${paymentId ? ` (ID ${paymentId})` : ''}.${orderDetails}\n¿Me confirman la recepción?`
    : `Hola ${storeName}, consulto por el pago ${orderReference}${paymentId ? ` (ID ${paymentId})` : ''}.${orderDetails}`;
  const confirmationUrl = `https://wa.me/${cleanPhoneNumber(storePhone)}?text=${encodeURIComponent(message)}`;

  const statusContent = {
    approved: {
      title: '¡Pago Aprobado!',
      description: 'Mercado Pago acreditó tu pago. La tienda recibirá la confirmación de la operación.',
      Icon: CheckCircle2,
    },
    pending: {
      title: 'Pago Pendiente',
      description: 'La transacción todavía se está procesando. Si necesitás ayuda, contactá al comercio.',
      Icon: Clock3,
    },
    rejected: {
      title: 'Pago Rechazado',
      description: 'No se pudo completar el pago. Podés intentar nuevamente o acordar el pago por WhatsApp.',
      Icon: AlertCircle,
    },
  }[status];
  const StatusIcon = statusContent.Icon;
  const statusClasses = {
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    rejected: 'bg-red-50 text-red-700 ring-red-100',
  }[status];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href={`/store/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a {storeName}
        </Link>

        <section className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-lg sm:p-10">
          <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-8 ${statusClasses}`}>
            <StatusIcon className="h-9 w-9" />
          </span>
          <h1 className="mt-6 text-2xl font-black text-gray-950 sm:text-3xl">{statusContent.title}</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
            {statusContent.description}
          </p>
          {paymentId && (
            <p className="mt-4 text-xs text-gray-500">
              ID de pago: <span className="font-semibold text-gray-700">{paymentId}</span>
            </p>
          )}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {status === 'approved' ? (
              <a
                href={confirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-5 w-5" />
                Enviar confirmación por WhatsApp a la tienda
              </a>
            ) : status === 'pending' ? (
              <a
                href={confirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar al comercio
              </a>
            ) : (
              <>
                <Link
                  href={`/store/${slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-bold text-white hover:bg-sky-800"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Reintentar compra
                </Link>
                <a
                  href={confirmationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-5 py-3 font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  Acordar por WhatsApp
                </a>
              </>
            )}
          </div>
        </section>

        {summary && (
          <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="font-bold text-gray-900">Resumen de la compra</h2>
              <p className="mt-1 text-sm text-gray-500">
                {summary.customerName} · {summary.customerPhone}
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {summary.items.map((item, index) => (
                <li key={`${item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-700">
                    {item.quantity} × {item.name}
                    {item.selectedSize ? ` · Talle ${item.selectedSize}` : ''}
                    {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>
            {summary.shippingFee > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>{formatPrice(summary.shippingFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-4 font-black text-gray-950">
              <span>Total</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
