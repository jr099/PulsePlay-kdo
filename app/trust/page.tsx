import { getPolicies, getProbabilities } from '@/services/compliance/compliance-service';

export default async function TrustPage() {
  const [policies, probabilities] = await Promise.all([getPolicies(), getProbabilities()]);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Centre de confiance</h1>
      <h2 className="font-semibold">Politiques</h2>
      <ul>{policies.map((p: { policy_type: string; version: string }) => <li key={`${p.policy_type}-${p.version}`}>{p.policy_type} v{p.version}</li>)}</ul>
      <h2 className="font-semibold">Probabilités publiées</h2>
      <ul>{probabilities.map((p: { id: string; game_variant_id: string; version: string }) => <li key={p.id}>{p.game_variant_id} - v{p.version}</li>)}</ul>
    </section>
  );
}
