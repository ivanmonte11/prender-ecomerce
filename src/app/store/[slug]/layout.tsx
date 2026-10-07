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
      icons: tenant.logoUrl
        ? [
          { rel: 'icon', url: tenant.logoUrl },
          { rel: 'apple-touch-icon', url: tenant.logoUrl },
        ]
        : undefined,
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
  let primaryColor = '#2563eb';
  let secondaryColor = '#0f172a';

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
        primaryColor: true,
        secondaryColor: true,
      },
    });

    if (tenant) {
      const rawTenant = tenant as Record<string, any>;
      primaryColor = rawTenant.primaryColor || '#2563eb';
      secondaryColor = rawTenant.secondaryColor || '#0f172a';

      tenantConfig = {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        phone: tenant.phone,
        shippingFee: tenant.shippingFee || 0,
        freeShippingThreshold: tenant.freeShippingThreshold || 0,
        primaryColor,
        secondaryColor,
      };
    }
  } catch (err) {
    console.error('Error in StoreLayout fetching tenant:', err);
  }

  return (
    <CartProvider initialTenant={tenantConfig}>
      {/* El div contenedor inyecta las variables CSS dinámicas a todos los componentes hijos */}
      <div
        style={
          {
            '--brand-primary': primaryColor,
            '--brand-secondary': secondaryColor,
          } as React.CSSProperties
        }
        className="min-h-screen bg-gray-50 text-gray-900"
      >
        {children}
      </div>
    </CartProvider>
  );
}