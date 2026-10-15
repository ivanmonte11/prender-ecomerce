import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { StoreSearchGrid } from '@/components/landing/StoreSearchGrid';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { MerchantCtaSection } from '@/components/landing/MerchantCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Prender Stores | Marketplace de Comercios y Tiendas Locales',
  description:
    'Explorá catálogos oficiales de comercios locales. Comprá directo por WhatsApp sin comisiones ni intermediarios, con stock en vivo verificado por Prender ERP.',
};

export const revalidate = 60; // Revalidación ISR cada 60 segundos

export default async function HomePage() {
  // Obtener únicamente comercios activos que tengan venta web habilitada
  const tenants = await prisma.tenant.findMany({
    where: {
      status: 'ACTIVE',
      eCommerceEnabled: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      logoUrl: true,
      bannerUrl: true,
      address: true,
      phone: true,
      shippingFee: true,
      freeShippingThreshold: true,
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
              publicadoWeb: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Dominio base para los enlaces a cada tienda
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'prender.store';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero totalStores={tenants.length} />
        <StoreSearchGrid tenants={tenants} rootDomain={rootDomain} />
        <HowItWorksSection />
        <MerchantCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}