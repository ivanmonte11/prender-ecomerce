const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOgImages() {
  const logoPath = path.join(__dirname, '../public/shoppers-l.png');
  let logoBuffer = null;
  if (fs.existsSync(logoPath)) {
    logoBuffer = await sharp(logoPath)
      .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
  }

  const logoBase64 = logoBuffer ? `data:image/png;base64,${logoBuffer.toString('base64')}` : '';

  // ==========================================
  // 1. BANNER HORIZONTAL: og-storefront.png (1200x630)
  // ==========================================
  const bannerWidth = 1200;
  const bannerHeight = 630;

  const bannerSvg = `
<svg width="${bannerWidth}" height="${bannerHeight}" viewBox="0 0 ${bannerWidth} ${bannerHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="50%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <radialGradient id="heroPurpleGlow" cx="25%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="heroCyanGlow" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="heroIndigoGlow" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>

    <filter id="softShadow" x="-10%" y="-10%" width="125%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.06" />
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.04" />
    </filter>

    <filter id="heroCircleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#6366f1" flood-opacity="0.12" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.05" />
    </filter>
  </defs>

  <style>
    .title-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 900; }
    .text-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  </style>

  <!-- Fondo Base Claro (Slate-50 de la Landing) -->
  <rect width="${bannerWidth}" height="${bannerHeight}" fill="#f8fafc" />

  <!-- Luces Ambientales Sutiles de la Landing -->
  <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#heroPurpleGlow)" />
  <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#heroCyanGlow)" />
  <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#heroIndigoGlow)" />

  <!-- Sutil Grid Decorativo -->
  <g opacity="0.35" stroke="#cbd5e1" stroke-width="1">
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

  <!-- Marco Exterior con Borde Suave -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#e2e8f0" stroke-width="1.5" />

  <!-- Micro-badge de Confianza -->
  <g transform="translate(80, 72)">
    <rect width="425" height="38" rx="19" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.2" filter="url(#softShadow)" />
    <circle cx="22" cy="19" r="7" fill="#8b5cf6" opacity="0.25" />
    <circle cx="22" cy="19" r="4.5" fill="#7c3aed" />
    <path d="M 36 14 L 42 12 L 48 14 C 48 19 45 23 42 25 C 39 23 36 19 36 14 Z" fill="none" stroke="#7c3aed" stroke-width="1.8" />
    <path d="M 40 18 L 41.5 20 L 44.5 16" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <text x="56" y="24" class="text-font" font-size="12.5" font-weight="700" fill="#6d28d9" letter-spacing="0.5">
      MARKETPLACE OFICIAL DE COMERCIOS LOCALES
    </text>
  </g>

  <!-- Logotipo y Nombre: Prender Shoppers -->
  <g transform="translate(80, 185)">
    <text class="title-font" font-size="62" letter-spacing="-1.5">
      <tspan fill="#0f172a">Prender</tspan><tspan fill="url(#primaryGrad)">Shoppers</tspan>
    </text>
  </g>

  <!-- Titular Principal -->
  <g transform="translate(80, 242)">
    <text class="title-font" font-size="32" fill="#0f172a" letter-spacing="-0.5">
      El Marketplace de Comercios y Tiendas Locales
    </text>
  </g>

  <!-- Bajada descriptiva clara -->
  <g transform="translate(80, 288)">
    <text class="text-font" font-size="19" fill="#475569" font-weight="500">
      Explorá catálogos oficiales con fotos, precios y stock en tiempo real.
    </text>
    <text x="0" y="28" class="text-font" font-size="19" fill="#475569" font-weight="500">
      Hacé tus pedidos online y coordiná directo por <tspan fill="#16a34a" font-weight="800">WhatsApp</tspan>, sin intermediarios.
    </text>
  </g>

  <!-- Tres Cards Inferiores -->
  <g transform="translate(80, 395)">
    <g transform="translate(0, 0)">
      <rect width="235" height="70" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" filter="url(#softShadow)" />
      <rect x="14" y="15" width="40" height="40" rx="12" fill="#f5f3ff" />
      <text x="34" y="42" class="text-font" font-size="20" text-anchor="middle">⚡</text>
      <text x="64" y="32" class="text-font" font-size="13.5" font-weight="800" fill="#0f172a">0% Comisiones</text>
      <text x="64" y="50" class="text-font" font-size="11" font-weight="600" fill="#64748b">Precio Directo de Local</text>
    </g>

    <g transform="translate(252, 0)">
      <rect width="250" height="70" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" filter="url(#softShadow)" />
      <rect x="14" y="15" width="40" height="40" rx="12" fill="#ecfdf5" />
      <text x="34" y="42" class="text-font" font-size="20" text-anchor="middle">💬</text>
      <text x="64" y="32" class="text-font" font-size="13.5" font-weight="800" fill="#0f172a">Por WhatsApp</text>
      <text x="64" y="50" class="text-font" font-size="11" font-weight="600" fill="#64748b">Atención Directa</text>
    </g>

    <g transform="translate(518, 0)">
      <rect width="235" height="70" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" filter="url(#softShadow)" />
      <rect x="14" y="15" width="40" height="40" rx="12" fill="#eff6ff" />
      <text x="34" y="42" class="text-font" font-size="20" text-anchor="middle">📦</text>
      <text x="64" y="32" class="text-font" font-size="13.5" font-weight="800" fill="#0f172a">Stock Real</text>
      <text x="64" y="50" class="text-font" font-size="11" font-weight="600" fill="#64748b">Sync Prender ERP</text>
    </g>
  </g>

  <!-- Barra Inferior -->
  <g transform="translate(80, 525)">
    <line x1="0" y1="0" x2="1040" y2="0" stroke="#e2e8f0" stroke-width="1" />
    <g transform="translate(0, 32)">
      <circle cx="8" cy="-6" r="4.5" fill="#06b6d4" />
      <text x="22" y="0" class="title-font" font-size="18" fill="#4f46e5" letter-spacing="0.2">
        shoppers.prender.store
      </text>
    </g>
    <g transform="translate(1040, 32)">
      <text x="0" y="0" class="text-font" font-size="13.5" font-weight="600" fill="#94a3b8" text-anchor="end">
        Directorio Oficial de Comercios • Prender Ecosystem
      </text>
    </g>
  </g>

  <!-- Ilustración Lado Derecho -->
  <g transform="translate(860, 115)">
    <circle cx="130" cy="130" r="150" fill="url(#primaryGrad)" opacity="0.10" />
    <circle cx="130" cy="130" r="124" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#heroCircleShadow)" />
    ${
      logoBase64
        ? `<image href="${logoBase64}" x="25" y="25" width="210" height="210" />`
        : `<rect x="60" y="60" width="140" height="140" rx="30" fill="url(#primaryGrad)" />`
    }
    <g transform="translate(32, 235)">
      <rect width="196" height="42" rx="21" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#softShadow)" />
      <circle cx="24" cy="21" r="10" fill="#10b981" />
      <path d="M 19 21 L 23 25 L 29 17" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="42" y="26" class="text-font" font-size="11.5" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        TIENDAS VERIFICADAS
      </text>
    </g>
  </g>
</svg>
`;

  // ==========================================
  // 2. LOGO CUADRADO: og-logo.png (600x600)
  // ==========================================
  const logoWidth = 600;
  const logoHeight = 600;

  const squareLogoSvg = `
<svg width="${logoWidth}" height="${logoHeight}" viewBox="0 0 ${logoWidth} ${logoHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sqPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="50%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <radialGradient id="sqPurpleGlow" cx="30%" cy="20%" r="55%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sqCyanGlow" cx="75%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>

    <filter id="sqSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.04" />
    </filter>

    <filter id="sqCenterCircleShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#6366f1" flood-opacity="0.14" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.05" />
    </filter>
  </defs>

  <style>
    .title-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 900; }
    .text-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  </style>

  <!-- Fondo Base Claro -->
  <rect width="${logoWidth}" height="${logoHeight}" fill="#f8fafc" />

  <!-- Luces Ambientales de Marca -->
  <rect width="${logoWidth}" height="${logoHeight}" fill="url(#sqPurpleGlow)" />
  <rect width="${logoWidth}" height="${logoHeight}" fill="url(#sqCyanGlow)" />

  <!-- Grid Sutil -->
  <g opacity="0.30" stroke="#cbd5e1" stroke-width="1">
    <line x1="0" y1="120" x2="600" y2="120" />
    <line x1="0" y1="240" x2="600" y2="240" />
    <line x1="0" y1="360" x2="600" y2="360" />
    <line x1="0" y1="480" x2="600" y2="480" />

    <line x1="120" y1="0" x2="120" y2="600" />
    <line x1="240" y1="0" x2="240" y2="600" />
    <line x1="360" y1="0" x2="360" y2="600" />
    <line x1="480" y1="0" x2="480" y2="600" />
  </g>

  <!-- Marco Exterior -->
  <rect x="20" y="20" width="560" height="560" rx="32" fill="none" stroke="#e2e8f0" stroke-width="1.5" />

  <!-- Micro-badge Superior -->
  <g transform="translate(170, 48)">
    <rect width="260" height="34" rx="17" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.2" filter="url(#sqSoftShadow)" />
    <circle cx="20" cy="17" r="6" fill="#8b5cf6" opacity="0.25" />
    <circle cx="20" cy="17" r="4" fill="#7c3aed" />
    <text x="36" y="22" class="text-font" font-size="11.5" font-weight="800" fill="#6d28d9" letter-spacing="0.8">
      MARKETPLACE OFICIAL
    </text>
  </g>

  <!-- Círculo Central con Bolsa 3D Oficial -->
  <g transform="translate(300, 235)">
    <!-- Halo exterior -->
    <circle cx="0" cy="0" r="140" fill="url(#sqPrimaryGrad)" opacity="0.10" />
    
    <!-- Círculo blanco elevado -->
    <circle cx="0" cy="0" r="118" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#sqCenterCircleShadow)" />

    ${
      logoBase64
        ? `<image href="${logoBase64}" x="-95" y="-95" width="190" height="190" />`
        : `<rect x="-50" y="-50" width="100" height="100" rx="20" fill="url(#sqPrimaryGrad)" />`
    }

    <!-- Badge flotante: Tiendas Verificadas -->
    <g transform="translate(-94, 94)">
      <rect width="188" height="38" rx="19" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#sqSoftShadow)" />
      <circle cx="22" cy="19" r="9" fill="#10b981" />
      <path d="M 17.5 19 L 21 22.5 L 26.5 15.5" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="38" y="23.5" class="text-font" font-size="10.5" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        TIENDAS VERIFICADAS
      </text>
    </g>
  </g>

  <!-- Nombre de Marca: Prender Shoppers -->
  <g transform="translate(300, 422)">
    <text class="title-font" font-size="42" text-anchor="middle" letter-spacing="-1">
      <tspan fill="#0f172a">Prender</tspan><tspan fill="url(#sqPrimaryGrad)">Shoppers</tspan>
    </text>
  </g>

  <!-- Tagline / Subtítulo -->
  <g transform="translate(300, 458)">
    <text class="text-font" font-size="14.5" fill="#64748b" font-weight="700" text-anchor="middle" letter-spacing="0.8">
      PLATAFORMA DE COMERCIOS LOCALES
    </text>
  </g>

  <!-- Separador fino -->
  <line x1="160" y1="492" x2="440" y2="492" stroke="#e2e8f0" stroke-width="1" />

  <!-- Dominio web inferior -->
  <g transform="translate(300, 528)">
    <g transform="translate(-105, 0)">
      <circle cx="0" cy="-5" r="4.5" fill="#06b6d4" />
      <text x="14" y="0" class="title-font" font-size="16.5" fill="#4f46e5" letter-spacing="0.3">
        shoppers.prender.store
      </text>
    </g>
  </g>
</svg>
`;

  const bannerOutputPath = path.join(__dirname, '../public/og-storefront.png');
  const logoOutputPath = path.join(__dirname, '../public/og-logo.png');
  const appOgPath = path.join(__dirname, '../src/app/opengraph-image.png');
  const appTwitterPath = path.join(__dirname, '../src/app/twitter-image.png');

  console.log('Generando imágenes OpenGraph (Modo Claro - Landing)...');

  // Guardar Banner (1200x630)
  const bannerBuffer = await sharp(Buffer.from(bannerSvg))
    .png({ quality: 90, compressionLevel: 9, palette: true, colors: 128 })
    .toBuffer();

  fs.writeFileSync(bannerOutputPath, bannerBuffer);
  fs.writeFileSync(appOgPath, bannerBuffer);
  fs.writeFileSync(appTwitterPath, bannerBuffer);
  console.log(`Banner guardado: ${bannerOutputPath} (${(bannerBuffer.length / 1024).toFixed(1)} KB)`);

  // Guardar Logo Cuadrado (600x600)
  const logoSquareBuffer = await sharp(Buffer.from(squareLogoSvg))
    .png({ quality: 90, compressionLevel: 9, palette: true, colors: 128 })
    .toBuffer();

  fs.writeFileSync(logoOutputPath, logoSquareBuffer);
  console.log(`Logo cuadrado guardado: ${logoOutputPath} (${(logoSquareBuffer.length / 1024).toFixed(1)} KB)`);

  console.log('¡Todas las imágenes OG fueron generadas exitosamente!');
}

generateOgImages().catch((err) => {
  console.error('Error generando imágenes OG:', err);
  process.exit(1);
});
