import type { ReactNode } from 'react';

export function Card({ title, children, tone = 'default' }: { title: string; children: ReactNode; tone?: 'default' | 'free' | 'premium' }) {
  const toneClass = tone === 'free' ? 'border-free' : tone === 'premium' ? 'border-premium' : 'border-slate-700';
  return (
    <article className={`rounded-lg border ${toneClass} bg-slate-900 p-4`}>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </article>
  );
}
