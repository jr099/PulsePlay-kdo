import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">PulsePlay - jeu responsable et traçable</h1>
      <p>Coins, Tickets, XP Saison, Gems et Reward Credits restent séparés et auditables.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-free p-4">Free: Ticket Free, sans achat requis.</div>
        <div className="rounded border border-premium p-4">Premium: Ticket Premium pour variante dédiée.</div>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard" className="rounded bg-sky-500 px-4 py-2 text-black">Accéder</Link>
        <Link href="/trust" className="rounded border px-4 py-2">Centre de confiance</Link>
      </div>
    </section>
  );
}
