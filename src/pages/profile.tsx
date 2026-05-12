import { useState } from 'react';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';
import { verifyToken } from '../lib/auth';
import cookie from 'cookie';

export default function ProfilePage({ user }: any) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio }),
    });

    if (response.ok) {
      setMessage('Profile saved successfully.');
      router.replace('/profile');
    } else {
      const data = await response.json();
      setMessage(data.message || 'Unable to save profile');
    }
  }

  return (
    <main className="container py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Profile details</h1>
            <p className="mt-2 text-slate-600">Update your name and bio.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.push('/settings')} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200">
              Settings
            </button>
            <button onClick={() => router.push('/dashboard')} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">
              Back to dashboard
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Bio</label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              rows={4}
            />
          </div>

          {message && <p className="text-sm text-slate-600">{message}</p>}

          <button type="submit" className="rounded-full bg-sky-600 px-6 py-3 text-white transition hover:bg-sky-700">
            Save profile
          </button>
        </form>
      </div>
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

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

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
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      },
    },
  };
}
