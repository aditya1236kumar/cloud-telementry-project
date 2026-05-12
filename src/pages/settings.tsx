import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SettingsPage({ theme, onThemeChange }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 rounded-3xl bg-white p-10 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Settings</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">Application preferences</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Manage your interface and experience settings for Cloud Telemetry.
              </p>
            </div>
            <Link href="/dashboard" className="rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Switch between your preferred theme to make Cloud Telemetry easier on your eyes.</p>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Theme mode</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Toggle between light and dark mode for the whole website.</p>
                </div>
                <button
                  onClick={() => onThemeChange(nextTheme)}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {mounted ? `Switch to ${nextTheme} mode` : 'Loading...'}
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Current theme: {theme}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Why use settings</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Customize the interface to match your workspace lighting and preferences, making telemetry analysis more comfortable for longer sessions.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">More options</h4>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">In future updates, this page can include notification preferences, account security, and integration controls.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
