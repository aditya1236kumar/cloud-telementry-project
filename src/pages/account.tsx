import { useState } from 'react';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';
import { getTokenFromRequest, verifyToken } from '../lib/auth';
import cookie from 'cookie';

export default function AccountPage({ user }: any) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [message, setMessage] = useState('');

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio }),
    });

    if (response.ok) {
      setMessage('Profile updated successfully.');
      router.replace('/account#edit-profile');
    } else {
      const data = await response.json();
      setMessage(data.message || 'Unable to save profile');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout');
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Account center</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Manage your profile and sign out securely.</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Use this page to update your details or logout from your session.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/settings')}
                className="rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
              >
                Logout now
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <section id="edit-profile" className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Edit profile</h2>
            <p className="mt-2 text-slate-600">Update your display name and bio.</p>

            <form onSubmit={handleSave} className="mt-8 space-y-6">
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
                Save changes
              </button>
            </form>
          </section>
        </div>
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
