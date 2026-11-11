import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'orrniva-api' }));
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(env.port, () => console.log(`Orrniva API listening on http://localhost:${env.port}`));
