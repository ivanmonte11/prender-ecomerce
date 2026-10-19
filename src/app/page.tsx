import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { StoreSearchGrid } from '@/components/landing/StoreSearchGrid';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { MerchantCtaSection } from '@/components/landing/MerchantCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://shoppers.prender.store';

export const metadata: Metadata = {
  title: 'Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales',
  description:
    'Plataforma marketplace para descubrir y comprar en tiendas locales. Catálogos oficiales con fotos, precios y stock sincronizados en tiempo real por Prender ERP. Comprá directo por WhatsApp sin intermediarios.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales',
    description:
      'Descubrí y comprá en comercios locales desde una sola plataforma marketplace. Stock en tiempo real y pedidos directos por WhatsApp sin comisiones ni intermediarios.',
    url: BASE_URL,
    siteName: 'Prender Shoppers Marketplace',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-storefront.png`,
        secureUrl: `${BASE_URL}/og-storefront.png`,
        width: 1200,
        height: 630,
        alt: 'Prender Shoppers - Plataforma Marketplace de Tiendas Locales',
        type: 'image/png',
      },
      {
        url: `${BASE_URL}/og-logo.png`,
        secureUrl: `${BASE_URL}/og-logo.png`,
        width: 600,
        height: 600,
        alt: 'Logo Oficial Prender Shoppers',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales',
    description:
      'Plataforma marketplace de comercios locales. Catálogos en vivo y pedidos directos por WhatsApp sin comisiones.',
    images: [`${BASE_URL}/og-storefront.png`],
  },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
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