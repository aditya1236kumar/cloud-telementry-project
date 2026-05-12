import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      iat: number;
      exp: number;
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.token || null;
}
