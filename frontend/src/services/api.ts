/**
 * Service layer. Every data call the UI makes goes through here, so switching
 * from the bundled mock data to the Express API (see /backend) is a matter of
 * setting VITE_API_URL — components don't change.
 */
import { PRODUCTS, PRODUCT_BY_SLUG } from '../data/products';
import type { Order, OrderStatus, Product, User } from '../types';
import { readStore, writeStore } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const USE_API = !!API_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readStore<string | null>('token', null);
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? `Request failed (${res.status})`);
  return body as T;
}

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ——— Products
export async function fetchProducts(): Promise<Product[]> {
  if (USE_API) return http<Product[]>('/products');
  return PRODUCTS;
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  if (USE_API) return http<Product>(`/products/${slug}`).catch(() => undefined);
  return PRODUCT_BY_SLUG.get(slug);
}

// ——— Auth (mock: accounts live in localStorage with a SHA-256 password hash)
interface StoredUser extends User {
  passwordHash: string;
}

async function hash(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(input: { name: string; email: string; phone?: string; password: string }) {
  if (USE_API) return http<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
  await delay();
  const users = readStore<StoredUser[]>('users', []);
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists.');
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    phone: input.phone,
    createdAt: new Date().toISOString(),
    passwordHash: await hash(input.password),
  };
  writeStore('users', [...users, user]);
  const { passwordHash: _omit, ...publicUser } = user;
  void _omit;
  return { user: publicUser, token: `mock.${user.id}` };
}

export async function loginUser(email: string, password: string) {
  if (USE_API) return http<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  await delay();
  const users = readStore<StoredUser[]>('users', []);
  const found = users.find((u) => u.email === email.trim().toLowerCase());
  if (!found || found.passwordHash !== (await hash(password))) throw new Error('Incorrect email or password.');
  const { passwordHash: _omit, ...publicUser } = found;
  void _omit;
  return { user: publicUser, token: `mock.${found.id}` };
}

export async function requestPasswordReset(email: string) {
  if (USE_API) return http<{ ok: true }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  await delay(400);
  // Always succeed so the response doesn't reveal which emails have accounts.
  return { ok: true as const };
}

export async function updateProfile(user: User) {
  if (USE_API) return http<User>('/auth/me', { method: 'PUT', body: JSON.stringify(user) });
  await delay();
  const users = readStore<StoredUser[]>('users', []);
  writeStore(
    'users',
    users.map((u) => (u.id === user.id ? { ...u, name: user.name, phone: user.phone } : u)),
  );
  return user;
}

// ——— Orders (mock: stored locally; status advances with time since placement)
const STATUS_STEPS: OrderStatus[] = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function withLiveStatus(o: Order): Order {
  const hours = (Date.now() - new Date(o.createdAt).getTime()) / 3_600_000;
  const step = hours > 96 ? 4 : hours > 72 ? 3 : hours > 24 ? 2 : hours > 4 ? 1 : 0;
  return { ...o, status: STATUS_STEPS[step] };
}

export async function placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  if (USE_API) return http<Order>('/orders', { method: 'POST', body: JSON.stringify(order) });
  await delay(700);
  const id = `ORV${Date.now().toString().slice(-8)}`;
  const full: Order = { ...order, id, createdAt: new Date().toISOString(), status: 'Confirmed' };
  writeStore('orders', [full, ...readStore<Order[]>('orders', [])]);
  return full;
}

export async function fetchOrders(email: string): Promise<Order[]> {
  if (USE_API) return http<Order[]>('/orders/mine');
  await delay(150);
  return readStore<Order[]>('orders', [])
    .filter((o) => o.email === email.toLowerCase())
    .map(withLiveStatus);
}

export async function trackOrder(id: string, contact: string): Promise<Order | undefined> {
  if (USE_API) return http<Order>(`/orders/track?id=${encodeURIComponent(id)}&contact=${encodeURIComponent(contact)}`).catch(() => undefined);
  await delay(400);
  const c = contact.trim().toLowerCase();
  const digits = c.replace(/\D/g, '');
  const o = readStore<Order[]>('orders', []).find((x) => {
    if (x.id.toUpperCase() !== id.trim().toUpperCase()) return false;
    const emailMatch = x.email === c;
    const phoneMatch = digits.length >= 10 && x.address.phone.replace(/\D/g, '').endsWith(digits.slice(-10));
    return emailMatch || phoneMatch;
  });
  return o ? withLiveStatus(o) : undefined;
}

export { STATUS_STEPS };

// ——— Newsletter & contact
export async function subscribeNewsletter(email: string): Promise<{ ok: true; already: boolean }> {
  if (USE_API) return http<{ ok: true; already: boolean }>('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
  await delay(350);
  const list = readStore<string[]>('newsletter', []);
  const e = email.trim().toLowerCase();
  if (list.includes(e)) return { ok: true as const, already: true };
  writeStore('newsletter', [...list, e]);
  return { ok: true as const, already: false };
}

export async function sendContactMessage(msg: { name: string; email: string; phone?: string; subject: string; message: string }) {
  if (USE_API) return http<{ ok: true }>('/contact', { method: 'POST', body: JSON.stringify(msg) });
  await delay(500);
  writeStore('messages', [...readStore<unknown[]>('messages', []), { ...msg, at: new Date().toISOString() }]);
  return { ok: true as const };
}
