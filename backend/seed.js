/**
 * Seed MongoDB with the catalogue exported from the frontend.
 * Regenerate data/products.json after editing frontend/src/data/products.ts:
 *   npm run export-products -w backend
 */
import 'dotenv/config';
import fs from 'node:fs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';

const products = JSON.parse(fs.readFileSync(new URL('./data/products.json', import.meta.url), 'utf8'));

await connectDB();
await Product.deleteMany({});
await Product.insertMany(products);
console.log(`Seeded ${products.length} products.`);
await mongoose.disconnect();
