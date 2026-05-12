import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';

function analyzeUrl(serviceUrl: string) {
  const name = serviceUrl.replace(/^https?:\/\//, '').split('/')[0] || 'unknown service';
  const base = Math.max(20, Math.min(120, serviceUrl.length * 1.8));
  const dailyUsage = parseFloat((base * 1.15).toFixed(2));
  const monthlyUsage = parseFloat((dailyUsage * 30).toFixed(2));
  const yearlyUsage = parseFloat((dailyUsage * 365).toFixed(2));
  const growthRate = parseFloat(((dailyUsage / base - 1) * 100).toFixed(2));

  return { name, dailyUsage, monthlyUsage, yearlyUsage, growthRate };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { serviceUrl } = req.body as { serviceUrl: string };
  if (!serviceUrl) {
    return res.status(400).json({ message: 'Service URL is required' });
  }

  const analysis = analyzeUrl(serviceUrl);
  await prisma.telemetry.create({
    data: {
      userId: payload.userId,
      serviceUrl,
      name: analysis.name,
      dailyUsage: analysis.dailyUsage,
      monthlyUsage: analysis.monthlyUsage,
      yearlyUsage: analysis.yearlyUsage,
      growthRate: analysis.growthRate,
    },
  });

  return res.status(201).json({ message: 'Telemetry created', analysis });
}
