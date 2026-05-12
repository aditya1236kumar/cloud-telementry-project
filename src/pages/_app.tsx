import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import '../../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = window.localStorage.getItem('cloud-telemetry-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    } else {
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(preferred);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('cloud-telemetry-theme', theme);
  }, [theme]);

  return <Component {...pageProps} theme={theme} onThemeChange={setTheme} />;
}
