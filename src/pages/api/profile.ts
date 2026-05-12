import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, bio, avatarUrl } = req.body as { name: string; bio?: string; avatarUrl?: string };
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  await prisma.user.update({
    where: { id: payload.userId },
    data: { name, bio: bio || null, avatarUrl: avatarUrl || null },
  });

  return res.status(200).json({ message: 'Profile updated' });
}
