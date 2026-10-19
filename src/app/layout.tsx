import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://shoppers.prender.store";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales",
    template: "%s | Prender Shoppers Marketplace",
  },
  description:
    "Plataforma marketplace de comercios y tiendas locales. Explorá catálogos oficiales con stock sincronizado en tiempo real por Prender ERP y realizá tus pedidos directos por WhatsApp sin comisiones ni intermediarios.",
  keywords: [
    "marketplace",
    "plataforma marketplace",
    "marketplace argentina",
    "tiendas online locales",
    "catálogos digitales",
    "comercios de cercanía",
    "compras por whatsapp",
    "pedidos directos",
    "argentina",
    "prender shoppers",
    "prender store",
    "prender erp",
    "ecommerce local argentina",
  ],
  authors: [{ name: "Prender Shoppers", url: BASE_URL }],
  creator: "Prender Shoppers",
  publisher: "Prender",
  category: "shopping",
  classification: "Marketplace / E-commerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/web-app-manifest-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales",
    description:
      "Descubrí y comprá en múltiples tiendas locales desde una sola plataforma marketplace. Catálogos digitales actualizados, stock en vivo y pedidos directos por WhatsApp sin intermediarios.",
    url: BASE_URL,
    siteName: "Prender Shoppers Marketplace",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: `${BASE_URL}/og-storefront.png`,
        secureUrl: `${BASE_URL}/og-storefront.png`,
        width: 1200,
        height: 630,
        alt: "Prender Shoppers - Plataforma Marketplace de Tiendas Locales",
        type: "image/png",
      },
      {
        url: `${BASE_URL}/og-logo.png`,
        secureUrl: `${BASE_URL}/og-logo.png`,
        width: 600,
        height: 600,
        alt: "Logo Oficial Prender Shoppers",
        type: "image/png",
      },
    ],
    countryName: "Argentina",
  },

  twitter: {
    card: "summary_large_image",
    title: "Prender Shoppers | Marketplace Oficial de Comercios y Tiendas Locales",
    description:
      "Plataforma marketplace de tiendas locales. Catálogos en vivo y pedidos directos por WhatsApp sin comisiones ni intermediarios.",
    images: [`${BASE_URL}/og-storefront.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  appleWebApp: {
    title: "Prender Shoppers",
    statusBarStyle: "default",
    startupImage: "/apple-touch-icon.png",
  },

  other: {
    "application-name": "PrenderShoppers",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}