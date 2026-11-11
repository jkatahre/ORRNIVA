import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from './error.js';

export const signToken = (user) => jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

async function resolveUser(req) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
}

/** Requires a valid JWT. */
export async function protect(req, _res, next) {
  const user = await resolveUser(req);
  if (!user) return next(new HttpError(401, 'Please sign in to continue.'));
  req.user = user;
  next();
}

/** Attaches the user if a valid JWT is present; otherwise continues as a guest. */
export async function optionalAuth(req, _res, next) {
  req.user = await resolveUser(req);
  next();
}
