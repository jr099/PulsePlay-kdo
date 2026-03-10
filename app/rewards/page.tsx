import { getCurrentUserId } from '@/services/auth/auth-service';
import { getRewardBalance, listCatalog, listRedemptions } from '@/services/rewards/reward-service';

export default async function RewardsPage() {
  const userId = getCurrentUserId();
  const [balance, catalog, redemptions] = await Promise.all([getRewardBalance(userId), listCatalog(), listRedemptions(userId)]);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Rewards Hub</h1>
      <p>Solde Reward Credits: {balance.balance}</p>
      <h2 className="font-semibold">Catalogue</h2>
      <ul>{catalog.map((c: { id: string; name: string; cost_credits: number }) => <li key={c.id}>{c.name} - {c.cost_credits} RC</li>)}</ul>
      <h2 className="font-semibold">Demandes</h2>
      <ul>{redemptions.map((r: { id: string; status: string }) => <li key={r.id}>{r.id} - {r.status}</li>)}</ul>
    </section>
  );
}
