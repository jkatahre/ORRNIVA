import type { Category, Collection, CategorySlug, Material, ProductType } from '../types';

export const CATEGORIES: Category[] = [
  {
    slug: 'home-accessories',
    name: 'Home Accessories',
    description:
      'Frames, vessels, candlelight and living green — the quiet objects that make a room feel lived in.',
    image: 'vine-mirror-console',
    subCategories: [
      { slug: 'photo-frames', name: 'Photo Frames' },
      { slug: 'bookends', name: 'Bookends' },
      { slug: 'globes', name: 'Globes' },
      { slug: 'candle-holders', name: 'Candle Holders' },
      { slug: 'decorative-accents', name: 'Decorative Accents' },
      { slug: 'vases', name: 'Vases' },
      { slug: 'garden-decor', name: 'Garden Decor' },
      { slug: 'planters', name: 'Planters' },
    ],
  },
  {
    slug: 'kitchen-bar',
    name: 'Kitchen & Bar',
    description:
      'Hand-finished boards, stoneware and barware for everyday cooking and unhurried evenings of hosting.',
    image: 'stag-ice-bucket',
    subCategories: [
      { slug: 'chopping-boards', name: 'Chopping Boards' },
      { slug: 'storage', name: 'Storage' },
      { slug: 'mortar-pestle', name: 'Mortar & Pestle' },
      { slug: 'tissue-holders', name: 'Tissue Holders' },
      { slug: 'trivets', name: 'Trivets' },
      { slug: 'bowls', name: 'Bowls' },
      { slug: 'trays', name: 'Trays' },
      { slug: 'plates-platters', name: 'Plates & Platters' },
      { slug: 'coasters', name: 'Coasters' },
      { slug: 'cake-stands', name: 'Cake Stands' },
      { slug: 'bottle-openers', name: 'Bottle Openers' },
      { slug: 'wine-accessories', name: 'Wine Accessories' },
    ],
  },
  {
    slug: 'gifting',
    name: 'Gifting',
    description:
      'Thoughtfully boxed objects for housewarmings, weddings and festivals — wrapped by hand in our studio.',
    image: 'marble-lotus-box',
    subCategories: [
      { slug: 'gift-boxes', name: 'Gift Boxes' },
      { slug: 'decorative-gifts', name: 'Decorative Gifts' },
      { slug: 'premium-gift-collections', name: 'Premium Gift Collections' },
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;

export function findSubCategory(category: CategorySlug, sub: string) {
  return CATEGORY_MAP[category]?.subCategories.find((s) => s.slug === sub);
}

export const MATERIALS: Material[] = [
  'Wood', 'Metal', 'Marble', 'Glass', 'Ceramic', 'Resin', 'Brass', 'Aluminium', 'Stone',
];

export const PRODUCT_TYPES: ProductType[] = [
  'Photo Frames', 'Candle Holders', 'Vases', 'Decorative Bowls', 'Trays', 'Bookends', 'Planters',
  'Storage', 'Coasters', 'Serveware', 'Bar Accessories', 'Decorative Accents', 'Gift Sets',
];

/** Curated, cross-category edits. Resolved at /collections/:slug */
export const COLLECTIONS: Collection[] = [
  {
    slug: 'best-sellers',
    name: 'Best Sellers',
    description: 'The pieces our customers return for, season after season.',
    image: 'deer-bookends',
    match: (p) => p.isBestSeller,
  },
  {
    slug: 'new-arrivals',
    name: 'New Arrivals',
    description: 'Freshly arrived from our partner workshops in Moradabad, Jaipur and Saharanpur.',
    image: 'armillary-sphere-small',
    match: (p) => p.isNewArrival,
  },
  {
    slug: 'the-brass-edit',
    name: 'The Brass Edit',
    description: 'Hand-beaten and cast brass, finished to age gracefully with your home.',
    image: 'peacock-brass-bowl',
    match: (p) => p.material === 'Brass' || p.tags.includes('brass'),
  },
  {
    slug: 'marble-and-stone',
    name: 'Marble & Stone',
    description: 'Makrana marble, granite and soapstone — cool, weighty and permanent.',
    image: 'marble-coaster-set',
    match: (p) => p.material === 'Marble' || p.material === 'Stone',
  },
  {
    slug: 'the-hosts-table',
    name: "The Host's Table",
    description: 'Boards, platters and glassware for long lunches and late dinners.',
    image: 'marble-cheese-board-set',
    match: (p) => p.tags.includes('hosting'),
  },
  {
    slug: 'festive-edit',
    name: 'The Festive Edit',
    description: 'Candlelight, brass and gift-ready pieces for Diwali and the wedding season.',
    image: 'tree-candelabra',
    match: (p) => p.tags.includes('festive'),
  },
  {
    slug: 'green-corners',
    name: 'Green Corners',
    description: 'Planters and garden objects for balconies, sills and sunlit corners.',
    image: 'brass-planter-stand',
    match: (p) => p.productType === 'Planters' || p.subCategory === 'garden-decor',
  },
];

export const COLLECTION_MAP = Object.fromEntries(COLLECTIONS.map((c) => [c.slug, c]));
