import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { COMMERCE, computeTotals, newOrderId } from '../services/pricing.js';

/** POST /api/orders — prices and stock are taken from the database, not the request. */
export const createOrder = asyncHandler(async (req, res) => {
  const { email, lines, address, payment, couponCode } = req.body ?? {};
  if (!Array.isArray(lines) || !lines.length) throw new HttpError(400, 'Your bag is empty.');
  if (!['upi', 'card', 'cod'].includes(payment)) throw new HttpError(400, 'Choose a payment method.');

  const products = await Product.find({ id: { $in: lines.map((l) => l.productId) } });
  const byId = new Map(products.map((p) => [p.id, p]));
  const orderLines = lines.map((l) => {
    const p = byId.get(l.productId);
    const qty = Math.floor(Number(l.quantity));
    if (!p) throw new HttpError(400, 'A product in your bag is no longer available.');
    if (!p.availability || p.stock < qty) throw new HttpError(409, `${p.name} has only ${p.stock} left in stock.`);
    if (!(qty >= 1 && qty <= COMMERCE.maxQtyPerItem)) throw new HttpError(400, 'Invalid quantity.');
    // image path is display-only; accept the client's resolved path if it is a safe local image path
    const image = /^\/images\/[a-z-]+\/[a-z0-9-]+\.webp$/.test(l.image ?? '') ? l.image : undefined;
    return { productId: p.id, name: p.name, image, price: p.price, quantity: qty };
  });

  const subtotal = orderLines.reduce((s, l) => s + l.price * l.quantity, 0);
  const totals = computeTotals(subtotal, couponCode, payment);

  const order = await Order.create({
    id: newOrderId(),
    user: req.user?._id,
    email: req.user?.email ?? email,
    lines: orderLines,
    address,
    payment,
    ...totals,
  });

  // decrement stock
  await Promise.all(
    orderLines.map((l) =>
      Product.updateOne({ id: l.productId }, [{ $set: { stock: { $subtract: ['$stock', l.quantity] } } }, { $set: { availability: { $gt: ['$stock', 0] } } }]),
    ),
  );

  res.status(201).json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ $or: [{ user: req.user._id }, { email: req.user.email }] }).sort({ createdAt: -1 });
  res.json(orders);
});

/** GET /api/orders/track?id=&contact= — contact must match the order email or phone. */
export const trackOrder = asyncHandler(async (req, res) => {
  const id = String(req.query.id ?? '').toUpperCase();
  const contact = String(req.query.contact ?? '').trim().toLowerCase();
  const order = await Order.findOne({ id });
  const digits = contact.replace(/\D/g, '');
  const matches = order && (order.email === contact || (digits.length >= 10 && order.address.phone.endsWith(digits.slice(-10))));
  if (!matches) throw new HttpError(404, 'Order not found.');
  res.json(order);
});
