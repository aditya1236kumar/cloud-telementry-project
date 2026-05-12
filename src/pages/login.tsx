import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const data = await response.json();
      setError(data.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
              CT
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Cloud Telemetry</p>
              <p className="text-sm text-slate-600">Your service analytics HQ</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
            <a href="#services" className="transition hover:text-slate-900">Browse services</a>
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#how-to-use" className="transition hover:text-slate-900">How to use</a>
            <a href="/settings" className="transition hover:text-slate-900">Settings</a>
            <a href="#footer" className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 transition hover:bg-slate-200">About</a>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-8 rounded-3xl bg-white p-10 shadow-sm">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
              Built for cloud operators, managers, and students
            </span>

            <div className="space-y-5">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                Smart cloud telemetry intelligence for every service.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                Analyze cloud service links, monitor usage trends, and get reliable forecasts for daily, monthly, and yearly growth. Designed for real-world cloud operations, academic projects, and enterprise visibility.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-2xl font-semibold text-slate-900">100+</p>
                <p className="mt-2 text-sm text-slate-600">Cloud services supported</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-2xl font-semibold text-slate-900">24/7</p>
                <p className="mt-2 text-sm text-slate-600">Telemetry monitoring readiness</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-2xl font-semibold text-slate-900">7-day</p>
                <p className="mt-2 text-sm text-slate-600">Forecast horizon by default</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Supported clouds</h2>
              <p className="mt-2 text-sm text-slate-600">Connect to leading cloud platforms and custom endpoints for complete coverage.</p>
              <div id="services" className="mt-5 grid gap-3 sm:grid-cols-3">
                {['AWS', 'Azure', 'GCP', 'IBM Cloud', 'Oracle', 'DigitalOcean'].map((name) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-sm">{name.slice(0, 2)}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-xs text-slate-500">Cloud service</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="features" className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Predictive usage estimates', detail: 'Daily, monthly, and yearly forecasts you can trust.' },
                { title: 'Multi-cloud insights', detail: 'Aggregate metrics from AWS, Azure, GCP and custom services.' },
                { title: 'User profile & service history', detail: 'Manage your cloud links, profile photo, and usage logs.' },
                { title: 'Secure session auth', detail: 'Protected login with encrypted credentials and cookies.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>

            <div id="how-to-use" className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
              <h2 className="text-2xl font-semibold text-white">How to use this site</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <p>1. Register or login to access your private dashboard.</p>
                <p>2. Paste a valid cloud service link into the telemetry analyzer.</p>
                <p>3. View active usage metrics, service forecasts, and growth predictions.</p>
                <p>4. Use the profile page to store your details and display your user photo.</p>
                <p>5. Repeat with multiple services to compare cloud performance side by side.</p>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Member login</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Secure access to your cloud analytics.</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">Sign in</div>
            </div>

            <p className="text-sm text-slate-600">Login to save your cloud service links, view history, and track predictions over time.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                Sign in
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">New here?</p>
              <p className="mt-2 text-sm text-slate-600">Create your account to start analyzing cloud services in minutes.</p>
              <Link href="/register" className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Create account
              </Link>
            </div>
          </section>
        </div>
      </section>

      <footer id="footer" className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">C 2026 Cloud Telemetry JECRC University minor project.</p>
          <p>Aditya Kumar &amp; Manvendra Singh.</p>
        </div>
      </footer>
    </main>
  );
}
