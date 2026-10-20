'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { StorePromoBanner } from '@/types/store';
import { cleanPhoneNumber } from '@/lib/whatsapp';

interface StorePromoCarouselProps {
  banners?: StorePromoBanner[] | null;
  tenantName: string;
  phone?: string | null;
  freeShippingThreshold?: number | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export function StorePromoCarousel({
  banners,
  tenantName,
  phone,
  freeShippingThreshold,
  primaryColor,
  secondaryColor,
}: StorePromoCarouselProps) {
  const waPhone = cleanPhoneNumber(phone);

  // Banners por defecto si la tienda aún no cargó fotos en Prender ERP
  const defaultBanners: StorePromoBanner[] = [
    {
      id: 'demo-banner-1',
      badge: '🔥 PROMOCIÓN ESPECIAL',
      title: 'Descuentos Exclusivos en Local',
      subtitle: 'Aboná con transferencia o efectivo y accedé a precios preferenciales en prendas seleccionadas.',
      linkUrl: waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`¡Hola ${tenantName}! Quisiera consultar por las promociones vigentes.`)}` : '#catalogo',
    },
    {
      id: 'demo-banner-2',
      badge: '🚚 ENVÍOS Y RETIROS',
      title: freeShippingThreshold && freeShippingThreshold > 0
        ? `Envío Gratis desde $${freeShippingThreshold.toLocaleString('es-AR')}`
        : 'Envíos Rápidos a Domicilio',
      subtitle: 'Hacé tu pedido online y coordinamos la entrega por WhatsApp en el día.',
      linkUrl: waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`¡Hola! Quisiera coordinar un envío con ${tenantName}.`)}` : '#catalogo',
    },
    {
      id: 'demo-banner-3',
      badge: '✨ NUEVA COLECCIÓN',
      title: 'Catálogo con Stock en Vivo',
      subtitle: 'Descubrí todos los nuevos ingresos sincronizados en tiempo real con Prender ERP.',
      linkUrl: '#catalogo',
    },
  ];

  // Si hay banners reales cargados usamos esos, si no los de demostración
  const activeBanners = (banners && banners.length > 0) ? banners : defaultBanners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  }, [activeBanners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  }, [activeBanners.length]);

  // Autoplay cada 4.5 segundos si no está pausado por hover o interacción
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused, nextSlide]);

  // Soporte Touch Swipe para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide(); // Deslizar a la izquierda -> siguiente
    } else if (diff < -45) {
      prevSlide(); // Deslizar a la derecha -> anterior
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!activeBanners || activeBanners.length === 0) return null;

  return (
    <div className="pt-3">
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm bg-gray-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenedor de Diapositivas con Animación de Desplazamiento */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeBanners.map((banner, index) => {
            const hasImage = Boolean(banner.imageUrl);

            return (
              <div
                key={banner.id || `banner-${index}`}
                className="w-full shrink-0 relative min-h-[145px] sm:min-h-[175px] md:min-h-[195px] flex items-center overflow-hidden"
              >
                {/* 1. Fondo de la diapositiva */}
                {hasImage ? (
                  <>
                    <img
                      src={banner.imageUrl!}
                      alt={banner.title || 'Oferta especial'}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Gradiente oscuro suave para legibilidad si hay textos superpuestos */}
                    {(banner.title || banner.subtitle) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
                    )}
                  </>
                ) : (
                  // Fondo con gradiente elegante basado en la identidad del comercio
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${secondaryColor || '#0f172a'} 0%, #1e1b4b 60%, ${primaryColor || '#2563eb'} 100%)`,
                    }}
                  >
                    {/* Textura sutil y luces decorativas */}
                    <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-20 bg-white" />
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blur-3xl opacity-25" style={{ backgroundColor: primaryColor || '#2563eb' }} />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
                  </div>
                )}

                {/* 2. Contenido Textual y Acciones (si tiene texto configurado) */}
                {(banner.title || banner.subtitle || banner.badge) ? (
                  <div className="relative z-10 w-full px-5 sm:px-8 py-4 sm:py-6 flex flex-col justify-center items-start max-w-2xl text-left">
                    {/* Badge */}
                    {banner.badge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20 mb-2 shadow-xs">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{banner.badge}</span>
                      </div>
                    )}

                    {/* Titular */}
                    {banner.title && (
                      <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
                        {banner.title}
                      </h3>
                    )}

                    {/* Subtítulo descriptivo */}
                    {banner.subtitle && (
                      <p className="text-xs sm:text-sm text-gray-200/90 font-normal mt-1 leading-relaxed max-w-xl line-clamp-2">
                        {banner.subtitle}
                      </p>
                    )}

                    {/* Botón de Acción / Enlace si está configurado */}
                    {banner.linkUrl && (
                      <div className="mt-3">
                        <a
                          href={banner.linkUrl}
                          target={banner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          rel={banner.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
                        >
                          {banner.linkUrl.includes('wa.me') ? (
                            <>
                              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                              <span>Consultar oferta</span>
                            </>
                          ) : (
                            <>
                              <span>Ver promoción</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  // Si es un banner gráfico completo sin textos, todo el slide puede tener enlace
                  banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      target={banner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel={banner.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="absolute inset-0 z-10"
                      aria-label="Ver oferta"
                    />
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Flechas de Navegación (Visibles si hay más de 1 banner) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Banner anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 z-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Siguiente banner"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 z-20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 4. Indicadores de Paginación (Dots) */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {activeBanners.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir al banner ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-5 bg-white shadow-xs'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
