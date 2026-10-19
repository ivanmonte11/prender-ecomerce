const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Cargar el logo de shoppers si existe
  const logoPath = path.join(__dirname, '../public/shoppers-l.png');
  let logoBuffer = null;
  if (fs.existsSync(logoPath)) {
    // Redimensionar logo a un tamaño óptimo para el banner
    logoBuffer = await sharp(logoPath)
      .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
  }

  // Convertir el logo a base64 para incrustarlo de forma segura en SVG
  const logoBase64 = logoBuffer ? `data:image/png;base64,${logoBuffer.toString('base64')}` : '';

  // SVG con diseño premium y profesional
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradientes de fondo -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#0a0f1d" />
    </linearGradient>

    <!-- Gradientes de marca Prender -->
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.25" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.85" />
    </linearGradient>

    <!-- Luces ambientales (Radial) -->
    <radialGradient id="glowPurple" cx="15%" cy="20%" r="45%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowCyan" cx="85%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowBottom" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0" />
    </radialGradient>

    <!-- Filtro de sombra suave -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5" />
    </filter>

    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .title-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 900; }
    .text-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  </style>

  <!-- Fondo base -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Luces ambientales -->
  <rect width="${width}" height="${height}" fill="url(#glowPurple)" />
  <rect width="${width}" height="${height}" fill="url(#glowCyan)" />
  <rect width="${width}" height="${height}" fill="url(#glowBottom)" />

  <!-- Sutil Grid de fondo -->
  <g opacity="0.07" stroke="#94a3b8" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />

    <line x1="150" y1="0" x2="150" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="450" y1="0" x2="450" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="750" y1="0" x2="750" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1050" y1="0" x2="1050" y2="630" />
  </g>

  <!-- Contenedor / Marco de Borde elegante -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

  <!-- ================= LADO IZQUIERDO: CONTENIDO PRINCIPAL ================= -->

  <!-- Badge Superior: Marketplace Oficial -->
  <g transform="translate(80, 75)">
    <rect width="410" height="38" rx="19" fill="url(#badgeGrad)" stroke="rgba(139, 92, 246, 0.45)" stroke-width="1.2" />
    <!-- Punto pulsante -->
    <circle cx="22" cy="19" r="5" fill="#38bdf8" />
    <circle cx="22" cy="19" r="8" fill="#38bdf8" opacity="0.35" />
    <text x="38" y="24" class="text-font" font-size="13" font-weight="700" fill="#c084fc" letter-spacing="1.5">
      PLATAFORMA MARKETPLACE OFICIAL
    </text>
  </g>

  <!-- Título de Marca: Prender Shoppers -->
  <g transform="translate(80, 185)">
    <text class="title-font" font-size="62" letter-spacing="-1.5">
      <tspan fill="#ffffff">Prender</tspan><tspan fill="url(#primaryGrad)">Shoppers</tspan>
    </text>
  </g>

  <!-- Subtítulo Destacado: El Marketplace de tus Comercios Locales -->
  <g transform="translate(80, 242)">
    <text class="title-font" font-size="32" fill="#f8fafc" letter-spacing="-0.5">
      El Marketplace de Comercios y Tiendas Locales
    </text>
  </g>

  <!-- Bajada descriptiva clara -->
  <g transform="translate(80, 288)">
    <text class="text-font" font-size="20" fill="#94a3b8" font-weight="400">
      Explorá catálogos oficiales, descubrí productos de tu zona
    </text>
    <text x="0" y="30" class="text-font" font-size="20" fill="#94a3b8" font-weight="400">
      y comprá directo por <tspan fill="#4ade80" font-weight="700">WhatsApp</tspan> con stock verificado en tiempo real.
    </text>
  </g>

  <!-- ================= TRES PILARES / CARDS INFERIORES ================= -->
  <g transform="translate(80, 395)">
    <!-- Pill 1: Stock en vivo -->
    <g transform="translate(0, 0)">
      <rect width="240" height="66" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <rect x="14" y="15" width="36" height="36" rx="10" fill="#7c3aed" fill-opacity="0.25" />
      <text x="32" y="39" class="text-font" font-size="20" text-anchor="middle">📦</text>
      <text x="60" y="31" class="text-font" font-size="13" font-weight="700" fill="#ffffff">Stock en Vivo</text>
      <text x="60" y="49" class="text-font" font-size="11" font-weight="500" fill="#94a3b8">Sync Prender ERP</text>
    </g>

    <!-- Pill 2: Pedidos por WhatsApp -->
    <g transform="translate(256, 0)">
      <rect width="250" height="66" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <rect x="14" y="15" width="36" height="36" rx="10" fill="#10b981" fill-opacity="0.25" />
      <text x="32" y="39" class="text-font" font-size="20" text-anchor="middle">💬</text>
      <text x="60" y="31" class="text-font" font-size="13" font-weight="700" fill="#ffffff">Pedidos por WhatsApp</text>
      <text x="60" y="49" class="text-font" font-size="11" font-weight="500" fill="#94a3b8">Atención directa</text>
    </g>

    <!-- Pill 3: 0% Comisiones -->
    <g transform="translate(522, 0)">
      <rect width="230" height="66" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <rect x="14" y="15" width="36" height="36" rx="10" fill="#06b6d4" fill-opacity="0.25" />
      <text x="32" y="39" class="text-font" font-size="20" text-anchor="middle">⚡</text>
      <text x="60" y="31" class="text-font" font-size="13" font-weight="700" fill="#ffffff">0% Comisiones</text>
      <text x="60" y="49" class="text-font" font-size="11" font-weight="500" fill="#94a3b8">Precios directos</text>
    </g>
  </g>

  <!-- ================= BARRA INFERIOR / BRANDING DOMINIO ================= -->
  <g transform="translate(80, 525)">
    <line x1="0" y1="0" x2="1040" y2="0" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    
    <g transform="translate(0, 32)">
      <!-- URL Dominio Principal -->
      <circle cx="8" cy="-6" r="4" fill="#06b6d4" />
      <text x="22" y="0" class="title-font" font-size="18" fill="#38bdf8" letter-spacing="0.5">
        shoppers.prender.store
      </text>
    </g>

    <g transform="translate(1040, 32)">
      <text x="0" y="0" class="text-font" font-size="14" font-weight="600" fill="#64748b" text-anchor="end">
        Directorio &amp; Marketplace Oficial • Prender Ecosystem
      </text>
    </g>
  </g>

  <!-- ================= LADO DERECHO: ILUSTRACIÓN / LOGO 3D ================= -->
  <g transform="translate(860, 115)">
    <!-- Círculo brillante con halo -->
    <circle cx="130" cy="130" r="150" fill="url(#primaryGrad)" opacity="0.15" filter="url(#glowEffect)" />
    <circle cx="130" cy="130" r="120" fill="#0f172a" stroke="rgba(255,255,255,0.12)" stroke-width="2" filter="url(#shadow)" />
    
    ${
      logoBase64
        ? `<image href="${logoBase64}" x="25" y="25" width="210" height="210" />`
        : `
      <!-- Fallback si no hay logo -->
      <rect x="60" y="60" width="140" height="140" rx="30" fill="url(#primaryGrad)" />
      <text x="130" y="145" class="title-font" font-size="50" fill="#ffffff" text-anchor="middle">🛍️</text>
    `
    }
    
    <!-- Mini badge flotante 100% Verificado -->
    <g transform="translate(35, 235)">
      <rect width="190" height="42" rx="21" fill="#0b1329" stroke="#38bdf8" stroke-width="1.5" filter="url(#shadow)" />
      <circle cx="24" cy="21" r="9" fill="#10b981" />
      <path d="M 19 21 L 23 25 L 29 17" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="42" y="26" class="text-font" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="0.5">
        TIENDAS VERIFICADAS
      </text>
    </g>
  </g>
</svg>
`;

  const outputPath = path.join(__dirname, '../public/og-storefront.png');
  const appOgPath = path.join(__dirname, '../src/app/opengraph-image.png');
  const appTwitterPath = path.join(__dirname, '../src/app/twitter-image.png');

  console.log('Generando imagen OpenGraph...');

  const imageBuffer = await sharp(Buffer.from(svg))
    .png({
      quality: 90,
      compressionLevel: 9,
      palette: true,
      colors: 128,
    })
    .toBuffer();

  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`Guardado en public: ${outputPath} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);

  // Guardar también en src/app/ para soporte nativo de Next.js App Router
  fs.writeFileSync(appOgPath, imageBuffer);
  console.log(`Guardado en app: ${appOgPath}`);

  fs.writeFileSync(appTwitterPath, imageBuffer);
  console.log(`Guardado en twitter: ${appTwitterPath}`);

  console.log('Generación completada exitosamente.');
}

generateOgImage().catch((err) => {
  console.error('Error generando OG image:', err);
  process.exit(1);
});
