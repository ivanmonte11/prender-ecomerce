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
    } = body;

    // Validation
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

    // Verify tenant
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

    // Calculate subtotal and shipping
    const subtotal = items.reduce((sum: number, item: any) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      return sum + q * p;
    }, 0);

    const isDelivery = deliveryType === 'DELIVERY';
    let shippingFee = 0;
    if (isDelivery) {
      const freeThreshold = tenant.freeShippingThreshold || 0;
      const baseFee = tenant.shippingFee || 0;
      if (freeThreshold > 0 && subtotal >= freeThreshold) {
        shippingFee = 0;
      } else {
        shippingFee = baseFee;
      }
    }

    const total = subtotal + shippingFee;

    // Generate consecutive order number (#WEB-1001, etc.)
    const existingOrdersCount = await prisma.onlineOrder.count({
      where: { tenantId: tenant.id },
    });
    const orderNumber = `#WEB-${1001 + existingOrdersCount}`;

    // Create OnlineOrder with OnlineOrderItems in transaction
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

    // Generate WhatsApp link
    const whatsappUrl = generateWhatsAppOrderUrl({
      orderNumber: order.orderNumber,
      storeName: tenant.name,
      storePhone: tenant.phone,
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
    console.error('Error creating online order:', error);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error al procesar el pedido.' },
      { status: 500 }
    );
  }
}
