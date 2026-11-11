import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    details: [String],
    category: { type: String, enum: ['home-accessories', 'kitchen-bar', 'gifting'], required: true, index: true },
    subCategory: { type: String, index: true },
    productType: String,
    material: { type: String, index: true },
    finish: String,
    dimensions: String,
    weight: String,
    care: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    images: [String],
    availability: { type: Boolean, default: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: Number,
    reviewCount: Number,
    isFeatured: Boolean,
    isBestSeller: Boolean,
    isNewArrival: Boolean,
    tags: [String],
    salesRank: Number,
    createdAt: Date,
  },
  { versionKey: false },
);

productSchema.index({ name: 'text', description: 'text', material: 'text', tags: 'text' });

productSchema.set('toJSON', { transform: (_doc, ret) => { delete ret._id; return ret; } });

export const Product = mongoose.model('Product', productSchema);
