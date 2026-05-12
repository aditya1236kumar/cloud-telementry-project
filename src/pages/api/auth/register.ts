import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { hashPassword, signToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body as { name: string; email: string; password: string };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
  return res.status(201).json({ message: 'User created' });
}
