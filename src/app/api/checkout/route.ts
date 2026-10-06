import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantId,
      customerName,
      customerPhone,
      customerEmail,
      deliveryType,
      address,
      notes,
      items,
      paymentMethod = 'WHATSAPP', // 'WHATSAPP' | 'MERCADOPAGO'
    } = body;

    // 1. Validaciones de entrada
    if (!tenantId || typeof tenantId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Identificador de tienda no válido.' },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'El nombre y teléfono son obligatorios.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El pedido debe contener al menos un producto.' },
        { status: 400 }
      );
    }

    // 2. Verificar datos de la tienda (Tenant)
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        phone: true,
        slug: true,
        status: true,
        eCommerceEnabled: true,
        shippingFee: true,
        freeShippingThreshold: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'La tienda no existe.' },
        { status: 404 }
      );
    }

    if (tenant.status !== 'ACTIVE' || !tenant.eCommerceEnabled) {
      return NextResponse.json(
        { success: false, error: 'La tienda no está habilitada para recibir pedidos en este momento.' },
        { status: 403 }
      );
    }

    // 3. Cálculos de importes (Server-side)
    const subtotal = items.reduce((sum: number, item: any) => {
      const q = Math.max(0, Number(item.quantity) || 0);
      const p = Math.max(0, Number(item.unitPrice) || 0);
      return sum + q * p;
    }, 0);

    const isDelivery = deliveryType === 'DELIVERY';
    let shippingFee = 0;
    if (isDelivery) {
      const freeThreshold = Number(tenant.freeShippingThreshold) || 0;
      const baseFee = Number(tenant.shippingFee) || 0;
      shippingFee = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : baseFee;
    }

    const total = subtotal + shippingFee;

    // 4. Generación segura de número correlativo de orden (#WEB-XXXX)
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#WEB-${Date.now().toString().slice(-4)}${randomSuffix}`;

    // 5. Creación de la orden en DB dentro de una transacción
    const order = await prisma.onlineOrder.create({
      data: {
        orderNumber,
        tenantId: tenant.id,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        customerEmail: customerEmail ? String(customerEmail).trim() : null,
        deliveryType: isDelivery ? 'DELIVERY' : 'PICKUP',
        address: isDelivery ? String(address || '').trim() : null,
        notes: notes ? String(notes).trim() : null,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName || 'Producto',
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            subtotal: Number(item.quantity) * Number(item.unitPrice),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 6. Formatear y limpiar teléfono de WhatsApp destino
    const cleanPhone = (tenant.phone || '').replace(/\D/g, '');

    // 7. Generar enlace de WhatsApp
    const whatsappUrl = generateWhatsAppOrderUrl({
      orderNumber: order.orderNumber,
      storeName: tenant.name,
      storePhone: cleanPhone,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryType: order.deliveryType,
      address: order.address,
      notes: order.notes,
      items: items.map((i: any) => ({
        name: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal,
      shippingFee,
      total,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Error al crear orden de compra online:', error);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error al procesar el pedido.' },
      { status: 500 }
    );
  }
}