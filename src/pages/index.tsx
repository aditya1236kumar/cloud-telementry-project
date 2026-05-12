import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Cloud Telemetry</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Autonomous cloud telemetry analytics with predictions
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600">
            Paste your cloud service link, manage profile data, and view usage trends with charts and forecasts.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="rounded-full bg-sky-600 px-6 py-3 text-white transition hover:bg-sky-700">
              Start free
            </Link>
            <Link href="/login" className="rounded-full border border-slate-200 px-6 py-3 text-slate-700 transition hover:bg-slate-50">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
