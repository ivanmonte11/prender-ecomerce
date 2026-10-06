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

    // Dominio raíz esperado (ej: "lvh.me:3001" en dev o "prender.store" en producción)
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lvh.me:3001';

    // Quitar el puerto para trabajar solo con el nombre de dominio (ej: "urbe.lvh.me")
    const hostWithoutPort = hostname.split(':')[0].toLowerCase();
    const rootWithoutPort = rootDomain.split(':')[0].toLowerCase();

    // Obtener el subdominio quitando el dominio raíz del final
    let tenantSlug = '';
    if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
        tenantSlug = hostWithoutPort.replace(`.${rootWithoutPort}`, '');
    }

    // Si detecta un subdominio válido (que no sea 'www' ni el dominio raíz solo)
    if (tenantSlug && tenantSlug !== 'www' && tenantSlug !== rootWithoutPort) {
        // Reescritura interna a /store/[slug]
        url.pathname = `/store/${tenantSlug}${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};