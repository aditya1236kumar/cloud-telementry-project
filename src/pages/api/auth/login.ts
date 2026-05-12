import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { verifyPassword, signToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
  return res.status(200).json({ message: 'Login successful' });
}
