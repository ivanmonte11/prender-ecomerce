import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { StoreUnavailable } from '@/components/store/StoreUnavailable';
import { StoreCatalog } from '@/components/store/StoreCatalog';
import { StoreProduct, StoreTenant } from '@/types/store';

interface StorePageProps {
    params: Promise<{
        slug: string;
    }>;
}


export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
    const { slug } = await params;
    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        select: {
            name: true,
            category: true,
            logoUrl: true,
            bannerUrl: true,
            address: true,
        },
    });

    if (!tenant) {
        return {
            title: 'Tienda no encontrada | Prender Shoppers',
        };
    }

    const title = `${tenant.name} | Catálogo Online Oficial`;
    const description = `Comprá online en ${tenant.name}${tenant.category ? ` (${tenant.category})` : ''}. Catálogo con stock en vivo y pedidos directos por WhatsApp con Prender ERP.`;
    const storeUrl = `https://shoppers.prender.store/store/${slug}`;
    
    const ogImages = tenant.logoUrl
        ? [
            {
                url: tenant.logoUrl,
                alt: `Logo de ${tenant.name}`,
            },
            {
                url: 'https://shoppers.prender.store/og-storefront.png',
                width: 1200,
                height: 630,
                alt: 'Prender Shoppers Marketplace',
            },
        ]
        : [
            {
                url: 'https://shoppers.prender.store/og-storefront.png',
                width: 1200,
                height: 630,
                alt: 'Prender Shoppers Marketplace',
            },
            {
                url: 'https://shoppers.prender.store/og-logo.png',
                width: 600,
                height: 600,
                alt: 'Logo Oficial Prender Shoppers',
            },
        ];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: storeUrl,
            siteName: 'Prender Shoppers Marketplace',
            type: 'website',
            locale: 'es_AR',
            images: ogImages,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: tenant.logoUrl ? [tenant.logoUrl] : ['https://shoppers.prender.store/og-storefront.png'],
        },
    };
}

export default async function StorePage({ params }: StorePageProps) {
    const { slug } = await params;

    // 1. Fetch Tenant data
    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            phone: true,
            email: true,
            logoUrl: true,
            bannerUrl: true,
            address: true,
            shippingFee: true,
            freeShippingThreshold: true,
            status: true,
            eCommerceEnabled: true,
            primaryColor: true,
            secondaryColor: true,
        },
    });

    // 2. Validate Tenant Existence & Status
    if (!tenant) {
        return <StoreUnavailable reason="NOT_FOUND" />;
    }

    if (tenant.status !== 'ACTIVE') {
        return (
            <StoreUnavailable
                reason="INACTIVE"
                title="Tienda no disponible"
                message="Esta tienda se encuentra temporalmente inactiva o suspendida. Por favor comunicate con el comercio para más información."
            />
        );
    }

    if (!tenant.eCommerceEnabled) {
        return (
            <StoreUnavailable
                reason="ECOMMERCE_DISABLED"
                title="Venta online deshabilitada"
                message={`La tienda de ${tenant.name} no tiene habilitada la venta web en este momento.`}
            />
        );
    }

    // 3. Fetch Active & Published Products
    const dbProducts = await prisma.product.findMany({
        where: {
            tenantId: tenant.id,
            publicadoWeb: true,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            category: true,
            image: true,
            images: true,
            saleType: true,
            isActive: true,
            publicadoWeb: true,
            lowStockThreshold: true,
        },
        orderBy: [
            { category: 'asc' },
            { name: 'asc' },
        ],
    });

    // 4. Map Decimal to numbers for serialization (Tipado explícito en p)
    type DbProduct = (typeof dbProducts)[number];

    const products: StoreProduct[] = dbProducts.map((p: DbProduct) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        quantity: Number(p.quantity),
        category: p.category || 'General',
        image: p.image,
        images: p.images || [],
        saleType: p.saleType || 'unit',
        isActive: p.isActive,
        publicadoWeb: p.publicadoWeb,
        lowStockThreshold: p.lowStockThreshold ? Number(p.lowStockThreshold) : 5,
    }));

    const storeTenant: StoreTenant = {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        category: tenant.category,
        phone: tenant.phone,
        email: tenant.email,
        logoUrl: tenant.logoUrl,
        bannerUrl: tenant.bannerUrl,
        address: tenant.address,
        shippingFee: tenant.shippingFee,
        freeShippingThreshold: tenant.freeShippingThreshold,
        status: tenant.status,
        eCommerceEnabled: tenant.eCommerceEnabled,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
    };

    return <StoreCatalog tenant={storeTenant} products={products} />;
}