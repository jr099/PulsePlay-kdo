import Link from 'next/link';
import type { GameVariant } from '@/types/domain';
import { Card } from '@/components/ui/card';

export function GameVariantCard({ variant }: { variant: GameVariant }) {
  return (
    <Card title={variant.name} tone={variant.ticketClass === 'FREE' ? 'free' : 'premium'}>
      <p className="text-sm">Ticket requis: {variant.ticketClass}</p>
      <p className="text-sm">Reward eligible: {variant.rewardEligible ? 'Oui' : 'Non'}</p>
      <p className="text-sm">Probabilité version: {variant.probabilityVersionId ?? 'N/A'}</p>
      <div className="mt-3 flex gap-2 text-sm">
        <Link className="rounded border px-2 py-1" href={`/play/${variant.id}`}>Pré-partie</Link>
      </div>
    </Card>
  );
}
