import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OrderStatusView } from './OrderStatusView';

interface OrderStatusPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    collection_status?: string | string[];
    status?: string | string[];
    payment_status?: string | string[];
    payment_id?: string | string[];
    external_reference?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] || null : value || null;
}

function resolvePaymentStatus(value: string | null): 'approved' | 'pending' | 'rejected' {
  const normalized = value?.toLowerCase();
  if (normalized === 'approved' || normalized === 'authorized') return 'approved';
  if (normalized === 'rejected' || normalized === 'cancelled' || normalized === 'canceled') {
    return 'rejected';
  }
  return 'pending';
}

export default async function OrderStatusPage({ params, searchParams }: OrderStatusPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { name: true, phone: true },
  });

  if (!tenant) notFound();

  const returnedStatus = firstParam(
    query.collection_status ?? query.status ?? query.payment_status
  );

  return (
    <OrderStatusView
      slug={slug}
      storeName={tenant.name}
      storePhone={tenant.phone}
      status={resolvePaymentStatus(returnedStatus)}
      paymentId={firstParam(query.payment_id)}
      externalReference={firstParam(query.external_reference)}
    />
  );
}
