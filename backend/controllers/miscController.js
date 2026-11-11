import { ContactMessage, Subscriber } from '../models/Subscriber.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email)) throw new HttpError(400, 'Please enter a valid email address.');
  const existing = await Subscriber.findOne({ email });
  if (!existing) await Subscriber.create({ email });
  res.json({ ok: true, already: !!existing });
});

export const contact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body ?? {};
  if (!EMAIL.test(String(email ?? ''))) throw new HttpError(400, 'Please enter a valid email address.');
  await ContactMessage.create({ name, email, phone, subject, message });
  res.status(201).json({ ok: true });
});
