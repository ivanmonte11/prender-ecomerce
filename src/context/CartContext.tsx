'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, DeliveryType, StoreProduct } from '@/types/store';

interface TenantCartConfig {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: StoreProduct, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  
  notes: string;
  setNotes: (notes: string) => void;

  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;

  tenantConfig: TenantCartConfig | null;
  setTenantConfig: (config: TenantCartConfig) => void;

  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  amountForFreeShipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialTenant,
}: {
  children: ReactNode;
  initialTenant?: TenantCartConfig;
}) {
  const [tenantConfig, setTenantConfigState] = useState<TenantCartConfig | null>(initialTenant || null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('PICKUP');
  const [notes, setNotes] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from localStorage based on tenant slug
  useEffect(() => {
    if (!tenantConfig?.slug) return;
    try {
      const storageKey = `prender_cart_${tenantConfig.slug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
        if (parsed.deliveryType === 'PICKUP' || parsed.deliveryType === 'DELIVERY') {
          setDeliveryType(parsed.deliveryType);
        }
      }
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, [tenantConfig?.slug]);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized || !tenantConfig?.slug) return;
    try {
      const storageKey = `prender_cart_${tenantConfig.slug}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          items,
          deliveryType,
        })
      );
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items, deliveryType, tenantConfig?.slug, isInitialized]);

  const setTenantConfig = (config: TenantCartConfig) => {
    setTenantConfigState(config);
  };

  const addItem = (product: StoreProduct, qty: number = 1) => {
    const step = product.saleType === 'weight' ? 0.25 : 1;
    const addQuantity = qty || step;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        const newQty = Math.round((existing.quantity + addQuantity) * 1000) / 1000;
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: addQuantity,
          saleType: product.saleType,
          image: product.image || (product.images && product.images[0]) || null,
          maxStock: product.quantity,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const cleanQty = Math.round(quantity * 1000) / 1000;
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: cleanQty } : item))
    );
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
    setNotes('');
    if (tenantConfig?.slug) {
      try {
        localStorage.removeItem(`prender_cart_${tenantConfig.slug}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => {
      return item.saleType === 'weight' ? acc + 1 : acc + item.quantity;
    }, 0);
  }, [items]);

  const freeShippingThreshold = tenantConfig?.freeShippingThreshold || 0;
  const standardShippingFee = tenantConfig?.shippingFee || 0;

  const isFreeShipping = useMemo(() => {
    if (deliveryType !== 'DELIVERY') return false;
    if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) {
      return true;
    }
    return standardShippingFee === 0;
  }, [deliveryType, freeShippingThreshold, standardShippingFee, subtotal]);

  const shippingFee = useMemo(() => {
    if (deliveryType !== 'DELIVERY') return 0;
    if (isFreeShipping) return 0;
    return standardShippingFee;
  }, [deliveryType, isFreeShipping, standardShippingFee]);

  const amountForFreeShipping = useMemo(() => {
    if (freeShippingThreshold <= 0 || subtotal >= freeShippingThreshold) return 0;
    return freeShippingThreshold - subtotal;
  }, [freeShippingThreshold, subtotal]);

  const total = useMemo(() => {
    return subtotal + shippingFee;
  }, [subtotal, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        deliveryType,
        setDeliveryType,
        notes,
        setNotes,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        tenantConfig,
        setTenantConfig,
        totalItemsCount,
        subtotal,
        shippingFee,
        isFreeShipping,
        amountForFreeShipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
