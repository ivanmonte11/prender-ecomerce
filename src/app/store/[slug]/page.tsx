import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { StoreUnavailable } from '@/components/store/StoreUnavailable';
import { StoreCatalog } from '@/components/store/StoreCatalog';
import { StoreProduct, StoreTenant, StorePromoBanner } from '@/types/store';

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
            transferPrice: true,
            cardPrice: true,
            hasVariants: true,
            sizes: true,
            colors: true,
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

    const products: StoreProduct[] = dbProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        transferPrice: p.transferPrice ? Number(p.transferPrice) : null,
        cardPrice: p.cardPrice ? Number(p.cardPrice) : null,
        hasVariants: Boolean(p.hasVariants),
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : null,
        quantity: Number(p.quantity),
        category: p.category || 'General',
        image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null),
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
        saleType: p.saleType || 'unit',
        isActive: p.isActive,
        publicadoWeb: p.publicadoWeb,
        lowStockThreshold: p.lowStockThreshold ? Number(p.lowStockThreshold) : 5,
    }));

    // 5. Cargar Banners de Ofertas (Compatible con columna JSON promoBanners o tabla promo_banners)
    let promoBanners: StorePromoBanner[] = [];

    // Intento 1: Columna JSON "promoBanners" en la tabla "tenants"
    try {
        const rawTenantBanners = await prisma.$queryRaw<Array<{ promoBanners?: any }>>`
            SELECT "promoBanners" FROM "tenants" WHERE "id" = ${tenant.id} LIMIT 1
        `;
        if (rawTenantBanners?.[0]?.promoBanners) {
            const raw = rawTenantBanners[0].promoBanners;
            promoBanners = Array.isArray(raw)
                ? raw
                : typeof raw === 'string'
                ? JSON.parse(raw)
                : [];
        }
    } catch {
        // Columna aún no migrada en DB
    }

    // Intento 2: Tabla relacional "promo_banners"
    if (promoBanners.length === 0) {
        try {
            const rawTableBanners = await prisma.$queryRaw<Array<any>>`
                SELECT id, "imageUrl", title, subtitle, "linkUrl", badge, "order", "isActive"
                FROM "promo_banners"
                WHERE "tenantId" = ${tenant.id} AND "isActive" = true
                ORDER BY "order" ASC, "createdAt" DESC
            `;
            if (rawTableBanners && rawTableBanners.length > 0) {
                promoBanners = rawTableBanners;
            }
        } catch {
            // Tabla aún no creada
        }
    }

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
        promoBanners,
    };

    return <StoreCatalog tenant={storeTenant} products={products} />;
}