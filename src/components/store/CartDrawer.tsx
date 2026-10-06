'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  Truck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/whatsapp';
import { StoreTenant } from '@/types/store';

interface CartDrawerProps {
  tenant: StoreTenant;
}

export function CartDrawer({ tenant }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    deliveryType,
    setDeliveryType,
    notes,
    setNotes,
    isCartOpen,
    closeCart,
    subtotal,
    shippingFee,
    isFreeShipping,
    amountForFreeShipping,
    total,
    totalItemsCount,
  } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('El carrito está vacío.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresá tu nombre completo.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage('Por favor ingresá tu número de teléfono / WhatsApp.');
      return;
    }

    if (deliveryType === 'DELIVERY' && !address.trim()) {
      setErrorMessage('Por favor ingresá la dirección de entrega.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        tenantId: tenant.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryType,
        address: deliveryType === 'DELIVERY' ? address.trim() : undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          subtotal: i.quantity * i.price,
        })),
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudo procesar el pedido. Por favor reintentá.');
      }

      // Order created successfully
      const { orderId, whatsappUrl } = data;
      clearCart();
      closeCart();

      // Open WhatsApp in new tab if available
      if (whatsappUrl) {
        try {
          window.open(whatsappUrl, '_blank');
        } catch {
          // Popup blocked fallback
        }
      }

      // Redirect to the confirmation screen
      router.push(`/store/${tenant.slug}/order/${orderId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Ocurrió un error al procesar tu compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-gray-100">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <p className="font-bold text-gray-900 text-base">Tu carrito está vacío</p>
                  <p className="text-xs text-gray-500">
                    Navegá por nuestro catálogo y agregá los productos que más te gusten.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress */}
                {tenant.freeShippingThreshold && tenant.freeShippingThreshold > 0 && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        {isFreeShipping ? '¡Tenés Envío Gratis!' : 'Envío Gratis'}
                      </span>
                      <span>
                        {isFreeShipping
                          ? '100%'
                          : `Faltan ${formatPrice(amountForFreeShipping)}`}
                      </span>
                    </div>
                    <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / tenant.freeShippingThreshold) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3 divide-y divide-gray-100">
                  {items.map((item) => {
                    const isWeight = item.saleType === 'weight';
                    const step = isWeight ? 0.25 : 1;
                    return (
                      <div key={item.productId} className="pt-3 first:pt-0 flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-gray-300 stroke-1" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            {formatPrice(item.price)} {isWeight ? 'x kg' : 'c/u'}
                          </p>
                          <p className="text-xs font-black text-emerald-700 mt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Stepper + Delete */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - step)}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-700 hover:text-emerald-700 shadow-2xs transition-colors cursor-pointer"
                              aria-label="Restar"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 px-2 min-w-[28px] text-center">
                              {item.quantity}
                              {isWeight ? 'kg' : ''}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + step)}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
                              aria-label="Sumar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Type Selector */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Forma de Entrega
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        deliveryType === 'PICKUP'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-600 shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Store className="w-4 h-4 mb-1 text-emerald-600" />
                      <span className="text-xs font-bold">Retiro en local</span>
                      <span className="text-[10px] text-gray-500">Gratis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        deliveryType === 'DELIVERY'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-600 shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1 text-emerald-600" />
                      <span className="text-xs font-bold">Envío a domicilio</span>
                      <span className="text-[10px] text-gray-500">
                        {isFreeShipping ? '¡Gratis!' : formatPrice(shippingFee)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Customer Checkout Form */}
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-3 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Datos del Pedido
                  </label>

                  <div>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nombre y Apellido *"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Teléfono / WhatsApp (Ej: 1123456789) *"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email (opcional)"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                  </div>

                  {deliveryType === 'DELIVERY' && (
                    <div>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Dirección completa y piso/depto *"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Aclaraciones especiales (horario, sin sal, timbre, etc.)..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden resize-none transition-all"
                    />
                  </div>
                </form>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with Totals & Submit */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3 z-10">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                {deliveryType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Costo de envío</span>
                    <span className="font-semibold text-gray-900">
                      {isFreeShipping ? (
                        <span className="text-emerald-700 font-bold">¡Gratis!</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-black text-gray-950 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-emerald-700">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registrando pedido...</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-5 h-5" />
                    <span>Confirmar Pedido ({formatPrice(total)})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
