import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Evitar reescrituras para archivos estáticos, imágenes de Next, favicons o peticiones de API
    if (
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Dominio raíz (en Vercel usará "prender.store", en local "lvh.me:3001")
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'prender.store';

    // Quitar el puerto para trabajar solo con el nombre de dominio
    const hostWithoutPort = hostname.split(':')[0].toLowerCase();
    const rootWithoutPort = rootDomain.split(':')[0].toLowerCase();

    // Extraer el subdominio
    let tenantSlug = '';
    if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
        tenantSlug = hostWithoutPort.replace(`.${rootWithoutPort}`, '');
    }

    // Si el subdominio es 'shoppers', 'www' o está vacío, muestra la Landing / Marketplace principal
    if (
        !tenantSlug ||
        tenantSlug === 'www' ||
        tenantSlug === 'shoppers' ||
        tenantSlug === rootWithoutPort
    ) {
        return NextResponse.next();
    }

    // Si detecta un subdominio válido de comercio (ej: "urbe") -> reescritura interna a /store/[slug]
    url.pathname = `/store/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};