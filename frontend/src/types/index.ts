export type CategorySlug = 'home-accessories' | 'kitchen-bar' | 'gifting';

export type Material =
  | 'Wood'
  | 'Metal'
  | 'Marble'
  | 'Glass'
  | 'Ceramic'
  | 'Resin'
  | 'Brass'
  | 'Aluminium'
  | 'Stone';

export type ProductType =
  | 'Photo Frames'
  | 'Candle Holders'
  | 'Vases'
  | 'Decorative Bowls'
  | 'Trays'
  | 'Bookends'
  | 'Planters'
  | 'Storage'
  | 'Coasters'
  | 'Serveware'
  | 'Bar Accessories'
  | 'Decorative Accents'
  | 'Gift Sets';

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  category: CategorySlug;
  subCategory: string; // sub-category slug, e.g. "photo-frames"
  productType: ProductType;
  material: Material;
  finish: string;
  dimensions: string;
  weight: string;
  care: string;
  price: number;
  originalPrice?: number;
  images: string[]; // image keys, resolved by utils/image
  availability: boolean;
  stock: number;
  rating?: number;
  reviewCount?: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: string; // ISO date, used for "Newest" sort
  salesRank: number; // lower = sells more
}

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  subCategories: SubCategory[];
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
  match: (p: Product) => boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export type SortKey =
  | 'featured'
  | 'relevance'
  | 'best-selling'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating';

export interface FilterState {
  categories: CategorySlug[];
  types: ProductType[];
  materials: Material[];
  availability: ('in-stock' | 'out-of-stock')[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortKey;
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  email: string;
  createdAt: string;
  lines: OrderLine[];
  address: Address;
  payment: PaymentMethod;
  subtotal: number;
  discount: number;
  prepaidDiscount: number;
  shipping: number;
  codFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}
