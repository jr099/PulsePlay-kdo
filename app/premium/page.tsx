import { listProducts } from '@/services/payments/payment-service';

export default async function PremiumPage() {
  const products = await listProducts();
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Boutique Premium</h1>
      <p>Premium permet l’accès aux variantes premium et packs gems.</p>
      <p>Premium ne garantit jamais un résultat de jeu ni une récompense.</p>
      <ul>{products.map((p: { id: string; name: string; price_cents: number; currency: string }) => <li key={p.id}>{p.name} - {(p.price_cents / 100).toFixed(2)} {p.currency}</li>)}</ul>
    </section>
  );
}
