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

export const metadata: Metadata = {
  title: {
    default: "Prender Stores - Plataforma Oficial de Tiendas Locales",
    template: "%s | Prender Stores",
  },
  description:
    "Explorá catálogos oficiales de comercios locales, realizá tus pedidos online y coordiná la entrega directamente por WhatsApp sin intermediarios.",
  keywords: [
    "tiendas online",
    "catálogo digital",
    "compras por whatsapp",
    "comercios locales",
    "pedidos directos",
    "argentina",
    "prender store",
    "prender erp",
    "ecommerce local",
  ],
  authors: [{ name: "Prender", url: "https://shoppers.prender.store" }],
  creator: "Prender",
  publisher: "Prender",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://shoppers.prender.store"
  ),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Prender Stores - Directorio Oficial de Tiendas Online",
    description:
      "Explorá comercios verificados, revisá sus catálogos actualizados en tiempo real y hace tus compras directo por WhatsApp.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://shoppers.prender.store",
    siteName: "Prender Stores",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-storefront.png",
        width: 1200,
        height: 630,
        alt: "Prender Stores - Marketplace de Tiendas Locales",
        type: "image/png",
      },
    ],
    countryName: "Argentina",
  },

  twitter: {
    card: "summary_large_image",
    title: "Prender Stores - Tiendas Online Locales",
    description:
      "Comprá directamente en tus comercios preferidos sin intermediarios.",
    images: ["/og-storefront.png"],
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
    title: "Prender Stores",
    statusBarStyle: "black-translucent",
    startupImage: "/apple-touch-icon.png",
  },

  other: {
    "application-name": "PrenderStores",
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