import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  parseCheckoutStockItems,
  validateAndReserveCheckoutStock,
} from '@/lib/checkout-stock';

interface RouteContext {
  params: Promise<{ tenant: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { tenant } = await params;
  if (!/^[a-zA-Z0-9_-]+$/.test(tenant)) {
    return NextResponse.json({ error: 'Identificador de tienda no válido.' }, { status: 400 });
  }

  const store = await prisma.tenant.findUnique({
    where: { slug: tenant },
    select: { id: true, mpEnabled: true },
  });
  if (!store) {
    return NextResponse.json({ error: 'La tienda no existe.' }, { status: 404 });
  }
  if (!store.mpEnabled) {
    return NextResponse.json(
      { error: 'Esta tienda no tiene habilitados los pagos online.' },
      { status: 403 }
    );
  }

  let checkoutBody: unknown;
  try {
    checkoutBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'El pedido no contiene datos válidos.' }, { status: 400 });
  }
  if (typeof checkoutBody !== 'object' || checkoutBody === null || !('items' in checkoutBody)) {
    return NextResponse.json({ error: 'El pedido debe contener productos.' }, { status: 400 });
  }
  const stockItems = parseCheckoutStockItems(checkoutBody.items);
  if (!stockItems) {
    return NextResponse.json({ error: 'Los productos o cantidades del pedido no son válidos.' }, { status: 400 });
  }
  const stockError = await prisma.$transaction((transaction) =>
    validateAndReserveCheckoutStock(transaction, store.id, stockItems, false)
  );
  if (stockError) {
    return NextResponse.json({ error: stockError }, { status: 409 });
  }

  const erpBaseUrl = process.env.ERP_API_BASE_URL;
  if (!erpBaseUrl) {
    return NextResponse.json(
      { error: 'El servicio de pagos no está configurado. Contactá a la tienda.' },
      { status: 503 }
    );
  }

  let preferenceUrl: URL;
  try {
    const baseUrl = new URL(erpBaseUrl);
    if (baseUrl.protocol !== 'https:' && baseUrl.hostname !== 'localhost') {
      throw new Error('ERP_API_BASE_URL debe usar HTTPS.');
    }
    preferenceUrl = new URL(
      `/api/${encodeURIComponent(tenant)}/checkout/preference`,
      baseUrl
    );
  } catch (error: unknown) {
    console.error('ERP_API_BASE_URL no es válido:', error);
    return NextResponse.json(
      { error: 'La configuración del servicio de pagos no es válida.' },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(preferenceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutBody),
      cache: 'no-store',
    });
    const responseBody = await upstreamResponse.text();

    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: {
        'Content-Type': upstreamResponse.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error(`Error al solicitar preferencia de pago para ${tenant}:`, error);
    return NextResponse.json(
      { error: 'No se pudo conectar con el servicio de pagos. Intentá nuevamente.' },
      { status: 502 }
    );
  }
}
