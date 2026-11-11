import type { Coupon } from '../types';

export const SITE = {
  name: 'Orrniva',
  tagline: 'Objects for the considered Indian home',
  email: 'care@orrniva.in',
  phone: '+91 80 4718 2260',
  whatsapp: '+91 98450 22617',
  address: 'Studio 4, Lavelle Road, Bengaluru, Karnataka 560001',
  hours: 'Mon – Sat, 10:00 – 19:00 IST',
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    pinterest: 'https://www.pinterest.com/',
    youtube: 'https://www.youtube.com/',
  },
  catalogueEdition: 'Edition 04 · Autumn – Winter 2026',
} as const;

export const COMMERCE = {
  currency: 'INR',
  freeShippingThreshold: 999,
  standardShipping: 99,
  codFee: 49,
  prepaidDiscountPercent: 5,
  prepaidDiscountCap: 250,
  maxQtyPerItem: 10,
} as const;

export const COUPONS: Coupon[] = [
  {
    code: 'ORRNIVA10',
    description: '10% off your order, up to ₹500',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    maxDiscount: 500,
  },
  {
    code: 'WELCOME200',
    description: '₹200 off orders above ₹1,499',
    type: 'flat',
    value: 200,
    minSubtotal: 1499,
  },
  {
    code: 'FESTIVE15',
    description: '15% off orders above ₹2,999, up to ₹1,200',
    type: 'percent',
    value: 15,
    minSubtotal: 2999,
    maxDiscount: 1200,
  },
];

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];
