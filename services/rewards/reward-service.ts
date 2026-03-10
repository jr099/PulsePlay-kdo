import { query } from '@/lib/db/client';
import { NotFoundError, ValidationError } from '@/lib/errors/app-error';
import { logEvent } from '@/lib/logger/logger';

export async function getRewardBalance(userId: string) {
  const rows = await query<{ balance: number }>("select balance::int from wallets where user_id = $1 and asset = 'REWARD_CREDIT'", [userId]);
  return { balance: rows[0]?.balance ?? 0 };
}

export async function listCatalog() {
  return query('select id, name, cost_credits, status from reward_catalog_items where status = $1', ['ACTIVE']);
}

export async function listRedemptions(userId: string) {
  return query('select id, item_id, status, created_at from reward_redemption_requests where user_id = $1 order by created_at desc', [userId]);
}

export async function createRedemption(userId: string, itemId: string, idempotencyKey: string) {
  const items = await query<{ cost_credits: number }>('select cost_credits from reward_catalog_items where id = $1 and status = $2', [itemId, 'ACTIVE']);
  if (!items[0]) throw new NotFoundError('Reward item not found');
  if (items[0].cost_credits <= 0) throw new ValidationError('Invalid reward cost');
  const rows = await query(
    `insert into reward_redemption_requests (user_id, item_id, cost_credits, status, idempotency_key)
     values ($1, $2, $3, 'PENDING', $4)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
     returning id, status`,
    [userId, itemId, items[0].cost_credits, idempotencyKey]
  );
  logEvent('reward_redemption_submitted', { userId, itemId, requestId: rows[0].id });
  return rows[0];
}
