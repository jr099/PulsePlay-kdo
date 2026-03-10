import '@/styles/globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-slate-800 bg-slate-900">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4 text-sm">
            <Link href="/" className="font-semibold">PulsePlay</Link>
            <div className="flex gap-3">
              <Link href="/catalog">Catalogue</Link>
              <Link href="/dashboard">Jouer</Link>
              <Link href="/trust">Confiance</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
