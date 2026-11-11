import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body ?? {};
  if (!name || !email || !password) throw new HttpError(400, 'Name, email and password are required.');
  if (!STRONG.test(password)) throw new HttpError(400, 'Password must be 8+ characters with upper, lower case and a number.');
  if (await User.exists({ email: String(email).toLowerCase() })) throw new HttpError(409, 'An account with this email already exists.');
  const user = await User.create({ name, email, phone: phone || undefined, password });
  res.status(201).json({ user, token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = email && (await User.findOne({ email: String(email).toLowerCase() }).select('+password'));
  if (!user || !(await user.comparePassword(String(password ?? '')))) throw new HttpError(401, 'Incorrect email or password.');
  res.json({ user, token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => res.json(req.user));

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body ?? {};
  if (name) req.user.name = name;
  req.user.phone = phone || undefined;
  await req.user.save();
  res.json(req.user);
});

/** Always responds 200 so the endpoint can't be used to discover registered emails. */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body ?? {};
  const user = email && (await User.findOne({ email: String(email).toLowerCase() }));
  if (user) {
    // TODO: generate a single-use reset token and send it via your email provider.
  }
  res.json({ ok: true });
});
