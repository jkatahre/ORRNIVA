import { Product } from '../models/Product.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const SORTS = {
  featured: { availability: -1, isFeatured: -1, salesRank: 1 },
  'best-selling': { salesRank: 1 },
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
};

const list = (v) => (v ? String(v).split(',').filter(Boolean) : []);

/** GET /api/products?category=&type=&material=&availability=&min=&max=&sort=&q= */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, type, material, availability, min, max, sort = 'featured', q } = req.query;
  const filter = {};
  if (list(category).length) filter.category = { $in: list(category) };
  if (list(type).length) filter.productType = { $in: list(type) };
  if (list(material).length) filter.material = { $in: list(material) };
  const avail = list(availability);
  if (avail.length === 1) filter.availability = avail[0] === 'in-stock';
  if (min || max) filter.price = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) };
  if (q) filter.$text = { $search: String(q).slice(0, 100) };
  const products = await Product.find(filter).sort(SORTS[sort] ?? SORTS.featured).lean({ virtuals: false });
  res.json(products.map(({ _id, ...p }) => p));
});

/** GET /api/products/:slug */
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new HttpError(404, 'Product not found.');
  res.json(product);
});
