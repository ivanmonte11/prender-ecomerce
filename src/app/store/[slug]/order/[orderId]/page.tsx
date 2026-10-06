import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Store,
  Truck,
  ArrowLeft,
  ShoppingBag,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { formatPrice, generateWhatsAppOrderUrl } from '@/lib/whatsapp';

interface OrderPageProps {
  params: Promise<{
    slug: string;
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { slug, orderId } = await params;

  const order = await prisma.onlineOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              image: true,
              images: true,
              saleType: true,
            },
          },
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          logoUrl: true,
          address: true,
          shippingFee: true,
          freeShippingThreshold: true,
        },
      },
    },
  });

  if (!order || order.tenant.slug !== slug) {
    notFound();
  }

  const isDelivery = order.deliveryType === 'DELIVERY';
  const subtotal = order.items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const total = Number(order.total);
  const shippingFee = total > subtotal ? total - subtotal : 0;

  // Generate WhatsApp URL
  const whatsappUrl = generateWhatsAppOrderUrl({
    orderNumber: order.orderNumber,
    storeName: order.tenant.name,
    storePhone: order.tenant.phone,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryType: order.deliveryType,
    address: order.address,
    notes: order.notes,
    items: order.items.map((i) => ({
      name: i.productName,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      saleType: i.product?.saleType,
    })),
    subtotal,
    shippingFee,
    total,
  });

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </Link>
        </div>

        {/* Success Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="px-3 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Estado: PENDIENTE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              ¡Muchas gracias por tu pedido!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Registramos tu orden con el número{' '}
              <strong className="text-gray-900 font-bold">{order.orderNumber}</strong> para{' '}
              <strong className="text-gray-900 font-bold">{order.tenant.name}</strong>.
            </p>
          </div>

          {/* Primary WhatsApp Action Button */}
          <div className="pt-2 max-w-md mx-auto space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Pedido por WhatsApp</span>
            </a>
            <p className="text-[11px] text-gray-400">
              Tocá el botón para enviar el comprobante directamente al comercio y coordinar pago/entrega.
            </p>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">
                Detalle del Pedido
              </h2>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => {
              const isWeight = item.product?.saleType === 'weight';
              const img =
                item.product?.image ||
                (item.product?.images && item.product.images[0]) ||
                null;

              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.quantity} {isWeight ? 'kg' : 'u.'} x {formatPrice(Number(item.unitPrice))}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-xs sm:text-sm text-gray-900 shrink-0">
                    {formatPrice(Number(item.subtotal))}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                {isDelivery ? (
                  <>
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Envío a Domicilio</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Retiro en Local</span>
                  </>
                )}
              </div>
              {isDelivery && order.address ? (
                <p className="text-gray-600 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </p>
              ) : (
                <p className="text-gray-600">
                  {order.tenant.address || 'Dirección del local a confirmar'}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-1.5">
              <p className="font-bold text-gray-800">Datos de Contacto</p>
              <p className="text-gray-600">{order.customerName}</p>
              <p className="text-gray-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{order.customerPhone}</span>
              </p>
              {order.customerEmail && (
                <p className="text-gray-500">{order.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/50 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-amber-900">Aclaraciones del cliente:</p>
              <p className="text-amber-800 italic">"{order.notes}"</p>
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {isDelivery && (
              <div className="flex justify-between text-gray-600">
                <span>Costo de Envío</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? '¡Gratis!' : formatPrice(shippingFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base sm:text-lg font-black text-gray-950 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-emerald-700">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>¿Tenés alguna duda sobre tu orden? Comunicate directamente con {order.tenant.name}.</p>
        </div>
      </div>
    </div>
  );
}
