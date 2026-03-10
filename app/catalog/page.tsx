import { listGames } from '@/services/games/game-service';
import { GameVariantCard } from '@/components/domain/game-variant-card';

export default async function CatalogPage() {
  const games = await listGames();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Catalogue jeux</h1>
      {games.map((game) => (
        <div key={game.id} className="space-y-2">
          <h2 className="text-xl">{game.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {game.variants.map((variant) => <GameVariantCard key={variant.id} variant={variant} />)}
          </div>
        </div>
      ))}
    </section>
  );
}
