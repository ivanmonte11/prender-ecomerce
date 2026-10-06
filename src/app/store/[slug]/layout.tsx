import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CartProvider } from '@/context/CartContext';

interface StoreLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { name: true, logoUrl: true, category: true },
    });

    if (!tenant) {
      return {
        title: 'Tienda Online | Prender Storefront',
      };
    }

    return {
      title: `${tenant.name} | Tienda Online`,
      description: `Comprá online en ${tenant.name}. Catálogo actualizado, precios y envíos a domicilio o retiro en local.`,
    };
  } catch {
    return {
      title: 'Tienda Online | Prender Storefront',
    };
  }
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;

  let tenantConfig = undefined;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        shippingFee: true,
        freeShippingThreshold: true,
      },
    });

    if (tenant) {
      tenantConfig = {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        phone: tenant.phone,
        shippingFee: tenant.shippingFee || 0,
        freeShippingThreshold: tenant.freeShippingThreshold || 0,
      };
    }
  } catch (err) {
    console.error('Error in StoreLayout fetching tenant:', err);
  }

  return <CartProvider initialTenant={tenantConfig}>{children}</CartProvider>;
}
