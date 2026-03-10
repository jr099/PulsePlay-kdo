import { getVariantRules } from '@/services/games/game-service';

export default async function PreGamePage({ params }: { params: { variantId: string } }) {
  const rules = await getVariantRules(params.variantId);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Pré-partie</h1>
      <p>Ticket consommé selon la classe de variante.</p>
      <p>Version de règle: {rules.version}</p>
      <p>Reward eligibility: gouvernée par règle publiée.</p>
      <p>Probabilité/version: consulter Centre de confiance.</p>
      <button className="rounded bg-sky-500 px-4 py-2 text-black">Confirmer l’entrée</button>
    </section>
  );
}
