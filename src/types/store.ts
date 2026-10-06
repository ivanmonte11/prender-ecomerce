export interface StoreTenant {
  id: string;
  name: string;
  slug: string;
  category: string;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  address: string | null;
  shippingFee: number | null;
  freeShippingThreshold: number | null;
  status: string;
  eCommerceEnabled: boolean;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
  image: string | null;
  images: string[];
  saleType: string; // 'unit' | 'weight'
  isActive: boolean;
  publicadoWeb: boolean;
  lowStockThreshold?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  saleType: string;
  image: string | null;
  maxStock: number;
}

export type DeliveryType = 'PICKUP' | 'DELIVERY';

export interface CheckoutCustomerData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: DeliveryType;
  address?: string;
  notes?: string;
}

export interface CheckoutPayload extends CheckoutCustomerData {
  tenantId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export interface OnlineOrderDetail {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryType: 'PICKUP' | 'DELIVERY';
  address: string | null;
  notes: string | null;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: {
      image: string | null;
      saleType: string;
    };
  }[];
  tenant: {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    logoUrl: string | null;
    address: string | null;
    shippingFee: number | null;
    freeShippingThreshold: number | null;
  };
}
