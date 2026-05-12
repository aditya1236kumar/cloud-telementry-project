import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';
import { verifyToken } from '../lib/auth';
import cookie from 'cookie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });

export default function Dashboard({ user, telemetryRecords }: any) {
  const router = useRouter();
  const [serviceUrl, setServiceUrl] = useState('');
  const [message, setMessage] = useState('');

  const latest = telemetryRecords[0] || null;
  const labels = ['Daily', 'Monthly', 'Yearly'];
  const pieData = {
    labels,
    datasets: [
      {
        data: latest ? [latest.dailyUsage, latest.monthlyUsage, latest.yearlyUsage] : [0, 0, 0],
        backgroundColor: ['#0ea5e9', '#22c55e', '#f97316'],
      },
    ],
  };

  const lineData = {
    labels: ['30d ago', '20d ago', '10d ago', 'Today'],
    datasets: [
      {
        label: 'Predicted usage',
        data: latest
          ? [
              latest.dailyUsage * 0.7,
              latest.dailyUsage * 0.85,
              latest.dailyUsage * 0.95,
              latest.dailyUsage,
            ]
          : [0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: '#0ea5e9',
      },
    ],
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceUrl }),
    });

    if (response.ok) {
      setServiceUrl('');
      router.replace(router.asPath);
    } else {
      const data = await response.json();
      setMessage(data.message || 'Unable to generate telemetry');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout');
    router.push('/login');
  }

  return (
    <main className="container py-12">
      <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Telemetry dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, {user.name}</h1>
          <p className="mt-2 text-slate-600">Track cloud usage, view analytics, and forecast growth.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => router.push('/settings')} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
            Settings
          </button>
          <button onClick={() => router.push('/account')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
            Manage account
          </button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Add cloud service link</h2>
          <p className="mt-2 text-slate-600">Paste any cloud service URL to generate telemetry analysis and predictions.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="url"
              value={serviceUrl}
              placeholder="https://example.cloudprovider.com/service"
              onChange={(event) => setServiceUrl(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
            <button className="self-start rounded-full bg-sky-600 px-6 py-3 text-white transition hover:bg-sky-700">
              Analyze telemetry
            </button>
            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>

          {latest ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Latest analysis</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{latest.name}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Daily usage</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{latest.dailyUsage.toFixed(1)} units</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Monthly usage</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{latest.monthlyUsage.toFixed(1)} units</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Yearly projection</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{latest.yearlyUsage.toFixed(1)} units</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-slate-600">No telemetry has been analyzed yet. Submit your first cloud link to see predictions.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Usage trend</h3>
            <div className="mt-6">
              <Line data={lineData} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Distribution</h3>
            <div className="mt-6">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      telemetry: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
      },
      telemetryRecords: user.telemetry.map((item) => ({
        id: item.id,
        serviceUrl: item.serviceUrl,
        name: item.name,
        dailyUsage: item.dailyUsage,
        monthlyUsage: item.monthlyUsage,
        yearlyUsage: item.yearlyUsage,
        growthRate: item.growthRate,
        createdAt: item.createdAt.toISOString(),
      })),
    },
  };
}
