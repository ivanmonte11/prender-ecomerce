export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  // Remove non-numeric characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 54 and doesn't have 9 after country code for Argentina (e.g. 54 11 ... -> 54 9 11 ...)
  if (digits.startsWith('54') && digits.length >= 12 && !digits.startsWith('549')) {
    return `549${digits.slice(2)}`;
  }
  
  // If it's a typical 10-digit Argentine number (e.g. 1123456789 or 3512345678)
  if (digits.length === 10 && !digits.startsWith('54')) {
    return `549${digits}`;
  }

  // If it's 11 digits starting with 15 (e.g. 11 15 23456789)
  if (digits.startsWith('15') && digits.length === 10) {
    return `54911${digits.slice(2)}`;
  }

  return digits;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface WhatsAppOrderMessageParams {
  orderNumber: string;
  storeName: string;
  storePhone: string | null;
  customerName: string;
  customerPhone: string;
  deliveryType: 'PICKUP' | 'DELIVERY';
  address?: string | null;
  notes?: string | null;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    saleType?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export function generateWhatsAppOrderUrl(params: WhatsAppOrderMessageParams): string {
  const {
    orderNumber,
    storeName,
    storePhone,
    customerName,
    customerPhone,
    deliveryType,
    address,
    notes,
    items,
    subtotal,
    shippingFee,
    total,
  } = params;

  const deliveryText =
    deliveryType === 'DELIVERY'
      ? `🛵 *Envío a domicilio*\n📍 *Dirección:* ${address || 'A coordinar'}`
      : `🏪 *Retiro en el local*`;

  const itemsList = items
    .map((item) => {
      const unit = item.saleType === 'weight' ? 'kg' : 'u.';
      const formattedSubtotal = formatPrice(item.quantity * item.unitPrice);
      return `• *${item.quantity} ${unit}* x ${item.name} (${formatPrice(item.unitPrice)}) = ${formattedSubtotal}`;
    })
    .join('\n');

  let text = `🛒 *NUEVO PEDIDO EN ${storeName.toUpperCase()}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🔖 *Orden:* ${orderNumber}\n`;
  text += `👤 *Cliente:* ${customerName}\n`;
  text += `📱 *Teléfono:* ${customerPhone}\n`;
  text += `${deliveryText}\n`;
  if (notes && notes.trim()) {
    text += `📝 *Aclaraciones:* ${notes.trim()}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🛍️ *PRODUCTOS:*\n${itemsList}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💵 *Subtotal:* ${formatPrice(subtotal)}\n`;
  if (deliveryType === 'DELIVERY') {
    text += `🚚 *Envío:* ${shippingFee === 0 ? '¡Gratis!' : formatPrice(shippingFee)}\n`;
  }
  text += `💰 *TOTAL A ABONAR: ${formatPrice(total)}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `¡Hola! Acabo de registrar este pedido a través de la tienda web. ¿Podrían confirmarme la recepción y los pasos para el pago? Muchas gracias! ✨`;

  const targetPhone = cleanPhoneNumber(storePhone);
  if (!targetPhone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
