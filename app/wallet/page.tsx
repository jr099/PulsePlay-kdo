import { getCurrentUserId } from '@/services/auth/auth-service';
import { getBalances, getLedger } from '@/services/wallet/wallet-service';

export default async function WalletPage() {
  const userId = getCurrentUserId();
  const [balances, ledger] = await Promise.all([getBalances(userId), getLedger(userId)]);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Wallet Center</h1>
      <ul>{balances.map((b) => <li key={b.asset}>{b.asset}: {b.amount}</li>)}</ul>
      <h2 className="font-semibold">Historique</h2>
      <ul className="text-sm">{ledger.map((l: { id: string; created_at: string; asset: string; amount_delta: number; reason: string }) => <li key={l.id}>{l.created_at}: {l.asset} {l.amount_delta} ({l.reason})</li>)}</ul>
    </section>
  );
}
