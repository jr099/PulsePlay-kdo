import { query } from '@/lib/db/client';
import { AccessError, NotFoundError } from '@/lib/errors/app-error';
import type { Game, GameVariant } from '@/types/domain';

export async function listGames(): Promise<Game[]> {
  const games = await query<{ id: string; slug: string; name: string; description: string }>('select id, slug, name, description from games where is_active = true');
  const variants = await query<GameVariant>(
    `select id, game_id as "gameId", slug, name, ticket_class as "ticketClass", reward_eligible as "rewardEligible",
      estimated_duration_sec as "estimatedDurationSec", active_ruleset_version as "activeRulesetVersion",
      probability_version_id as "probabilityVersionId", transparency_text as "transparencyText"
    from game_variants where is_active = true`
  );
  return games.map((g) => ({ ...g, variants: variants.filter((v) => v.gameId === g.id) }));
}

export async function getGameBySlug(slug: string): Promise<Game> {
  const games = await listGames();
  const game = games.find((g) => g.slug === slug);
  if (!game) throw new NotFoundError('Game not found');
  return game;
}

export async function getVariantRules(variantId: string) {
  const rows = await query(
    `select gv.id, gv.active_ruleset_version, gr.rule_json, gr.version
     from game_variants gv
     join game_rulesets gr on gr.variant_id = gv.id and gr.version = gv.active_ruleset_version
     where gv.id = $1`,
    [variantId]
  );
  if (!rows[0]) throw new NotFoundError('Rules not found');
  return rows[0];
}

export async function assertVariantAccessible(variantId: string, ticketClass: 'FREE' | 'PREMIUM') {
  const rows = await query<{ ticket_class: 'FREE' | 'PREMIUM' }>('select ticket_class from game_variants where id = $1', [variantId]);
  if (!rows[0]) throw new NotFoundError('Variant not found');
  if (rows[0].ticket_class !== ticketClass) throw new AccessError('Ticket class mismatch');
}
