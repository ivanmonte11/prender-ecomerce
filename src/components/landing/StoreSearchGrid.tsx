'use client';

import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, X, SlidersHorizontal, Truck, MessageCircle, Sparkles } from 'lucide-react';
import { StoreCard, TenantCardData } from './StoreCard';

interface StoreSearchGridProps {
  tenants: TenantCardData[];
  rootDomain: string;
}

type ServiceFilter = 'ALL' | 'FREE_SHIPPING' | 'WHATSAPP';
type SortOption = 'DEFAULT' | 'NAME_ASC' | 'MOST_PRODUCTS';

export function StoreSearchGrid({ tenants, rootDomain }: StoreSearchGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DEFAULT');

  // Categorías con conteo dinámico
  const categoriesWithCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tenants) {
      if (t.category) {
        map.set(t.category, (map.get(t.category) || 0) + 1);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [tenants]);

  // Filtrado reactivo multi-campo + filtros de servicio
  const filteredTenants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return tenants
      .filter((tenant) => {
        // Filtro por texto
        const matchesSearch =
          !q ||
          tenant.name.toLowerCase().includes(q) ||
          (tenant.category && tenant.category.toLowerCase().includes(q)) ||
          (tenant.address && tenant.address.toLowerCase().includes(q));

        // Filtro por categoría
        const matchesCategory = selectedCategory
          ? tenant.category?.toLowerCase() === selectedCategory.toLowerCase()
          : true;

        // Filtro por tipo de servicio
        let matchesService = true;
        if (serviceFilter === 'FREE_SHIPPING') {
          matchesService =
            tenant.shippingFee === 0 ||
            (typeof tenant.freeShippingThreshold === 'number' && tenant.freeShippingThreshold > 0);
        } else if (serviceFilter === 'WHATSAPP') {
          matchesService = Boolean(tenant.phone);
        }

        return matchesSearch && matchesCategory && matchesService;
      })
      .sort((a, b) => {
        if (sortOption === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        }
        if (sortOption === 'MOST_PRODUCTS') {
          const aCount = a._count?.products || 0;
          const bCount = b._count?.products || 0;
          return bCount - aCount;
        }
        return 0;
      });
  }, [tenants, searchQuery, selectedCategory, serviceFilter, sortOption]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== null || serviceFilter !== 'ALL';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setServiceFilter('ALL');
    setSortOption('DEFAULT');
  };

  return (
    <section id="explorar-tiendas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
      {/* Encabezado del Directorio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Directorio de Comercios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Descubrí y comprá en tiendas adheridas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Catálogos oficiales con stock verificado por Prender ERP
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-white text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            {filteredTenants.length} {filteredTenants.length === 1 ? 'tienda' : 'tiendas'} {hasActiveFilters && `(de ${tenants.length})`}
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros Rápidos */}
      <div className="space-y-4 mb-10 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Input Buscador Universal */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de comercio, rubro o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 sm:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title="Borrar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-violet-500 transition cursor-pointer shadow-xs"
            >
              <option value="DEFAULT">Orden: Destacadas</option>
              <option value="NAME_ASC">Nombre (A - Z)</option>
              <option value="MOST_PRODUCTS">Más productos</option>
            </select>
          </div>
        </div>

        {/* Filtros de Servicio Rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Servicios:</span>
          </span>

          <button
            onClick={() => setServiceFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
              serviceFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todos los servicios
          </button>

          <button
            onClick={() => setServiceFilter(serviceFilter === 'FREE_SHIPPING' ? 'ALL' : 'FREE_SHIPPING')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition inline-flex items-center gap-1.5 ${
              serviceFilter === 'FREE_SHIPPING'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Con Envío Gratis</span>
          </button>

          <button
            onClick={() => setServiceFilter(serviceFilter === 'WHATSAPP' ? 'ALL' : 'WHATSAPP')}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition inline-flex items-center gap-1.5 ${
              serviceFilter === 'WHATSAPP'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Directo</span>
          </button>
        </div>

        {/* Pastillas de Categorías con Conteo Dinámico */}
        {categoriesWithCount.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              Todos los rubros ({tenants.length})
            </button>

            {categoriesWithCount.map(([category, count]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Comercios */}
      {filteredTenants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No se encontraron tiendas
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No encontramos resultados que coincidan con "${searchQuery}".`
              : 'No hay tiendas disponibles con los filtros seleccionados.'}
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 px-5 py-2.5 rounded-xl transition shadow-md shadow-violet-500/20"
          >
            <X className="w-4 h-4" />
            <span>Restablecer búsqueda y filtros</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTenants.map((tenant) => (
            <StoreCard key={tenant.id} tenant={tenant} rootDomain={rootDomain} />
          ))}
        </div>
      )}
    </section>
  );
}