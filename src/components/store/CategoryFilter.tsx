'use client';

import React from 'react';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  totalProductsCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos</span>
            <span
              className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === null
                  ? 'bg-emerald-700/80 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-emerald-700/80 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
