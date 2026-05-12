import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const data = await response.json();
      setError(data.message || 'Registration failed');
    }
  }

  return (
    <main className="container py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-2 text-slate-600">Register to view telemetry insights and forecasts.</p>

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
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-sky-600 px-4 py-3 text-white transition hover:bg-sky-700">
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
