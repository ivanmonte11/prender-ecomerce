'use client';

import React, { useState, useMemo } from 'react';
import { StoreTenant, StoreProduct } from '@/types/store';
import { StoreHeader } from './StoreHeader';
import { StoreHero } from './StoreHero';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { CartDrawer } from './CartDrawer';
import { Search, PackageOpen, Sparkles } from 'lucide-react';

interface StoreCatalogProps {
  tenant: StoreTenant;
  products: StoreProduct[];
}

export function StoreCatalog({ tenant, products }: StoreCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Compute category list with product counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === null ||
        (product.category || 'General').toLowerCase() === selectedCategory.toLowerCase();

      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.description && product.description.toLowerCase().includes(normalizedQuery)) ||
        (product.category && product.category.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Group filtered products by category if no specific category is filtered and no search query
  const groupedProducts = useMemo(() => {
    if (selectedCategory !== null || searchQuery.trim() !== '') {
      return null;
    }

    const groups: { [key: string]: StoreProduct[] } = {};
    products.forEach((product) => {
      const cat = product.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });

    return groups;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        {/* Navigation / Header */}
        <StoreHeader
          tenant={tenant}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section */}
        <StoreHero tenant={tenant} />

        {/* Category Navigation Pills */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalProductsCount={products.length}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xs text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-lg">Catálogo sin productos</h3>
                <p className="text-xs text-gray-500">
                  Pronto vas a poder encontrar novedades y productos en esta tienda.
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xs text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 stroke-1.5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-lg">Sin resultados</h3>
                <p className="text-xs text-gray-500">
                  No encontramos ningún producto que coincida con tu búsqueda.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Ver todos los productos
              </button>
            </div>
          ) : groupedProducts ? (
            // Grouped By Category View
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([categoryName, items]) => (
                <section key={categoryName} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                        {categoryName}
                      </h2>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                    {items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            // Filtered / Search View
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory : 'Resultados de la búsqueda'}
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    ({filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'producto' : 'productos'})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cart Drawer Modal */}
      <CartDrawer tenant={tenant} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-16 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-gray-600 font-semibold">{tenant.name} © {new Date().getFullYear()}</p>
          <p className="flex items-center justify-center gap-1">
            <span>Potenciado por</span>
            <a
              href="https://prender.store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline"
            >
              Prender ERP
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
