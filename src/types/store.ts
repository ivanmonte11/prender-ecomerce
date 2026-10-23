export interface StorePromoBanner {
  id: string;
  imageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  linkUrl?: string | null;
  badge?: string | null;
  order?: number;
  isActive?: boolean;
}

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
  mpEnabled: boolean;
  mpPublicKey: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  promoBanners?: StorePromoBanner[] | null;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  transferPrice?: number | null;
  cardPrice?: number | null;
  hasVariants?: boolean;
  sizes?: string[];
  colors?: ProductColor[] | null;
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
  itemKey?: string; // Llave única compuesta: `${productId}_${selectedSize || ''}_${selectedColor?.name || ''}`
  productId: string;
  name: string;
  price: number;
  transferPrice?: number | null;
  cardPrice?: number | null;
  selectedSize?: string | null;
  selectedColor?: ProductColor | null;
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
    selectedSize?: string | null;
    selectedColor?: ProductColor | null;
    transferPrice?: number | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal?: number;
  shippingFee?: number;
  total?: number;
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
