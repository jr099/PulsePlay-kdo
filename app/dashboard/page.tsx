import { getCurrentUserId } from '@/services/auth/auth-service';
import { getBalances } from '@/services/wallet/wallet-service';
import { listGames } from '@/services/games/game-service';
import { GameVariantCard } from '@/components/domain/game-variant-card';

export default async function DashboardPage() {
  const userId = getCurrentUserId();
  const [balances, games] = await Promise.all([getBalances(userId), listGames()]);
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard Jouer</h1>
      <div className="rounded border border-slate-700 p-3">
        <h2 className="font-semibold">Soldes</h2>
        <ul className="text-sm">{balances.map((b) => <li key={b.asset}>{b.asset}: {b.amount}</li>)}</ul>
      </div>
      <p className="text-sm">Objectif du jour: compléter 3 runs et gagner 50 XP.</p>
      <div className="grid gap-3 sm:grid-cols-2">{games.flatMap((g) => g.variants).map((v) => <GameVariantCard key={v.id} variant={v} />)}</div>
    </section>
  );
}
