import { randomUUID } from 'crypto';
import { query } from '@/lib/db/client';
import { NotFoundError, ValidationError } from '@/lib/errors/app-error';
import { logEvent } from '@/lib/logger/logger';
import { appendLedgerEntry } from '@/services/wallet/wallet-service';

export async function createEntry(userId: string, variantId: string, idempotencyKey: string) {
  const variants = await query<{ ticket_class: 'FREE' | 'PREMIUM'; active_ruleset_version: string; reward_eligible: boolean }>(
    'select ticket_class, active_ruleset_version, reward_eligible from game_variants where id = $1',
    [variantId]
  );
  if (!variants[0]) throw new NotFoundError('Variant not found');
  const asset = variants[0].ticket_class === 'FREE' ? 'TICKET_FREE' : 'TICKET_PREMIUM';

  const group = await query<{ id: string }>('insert into ledger_transaction_groups (reason) values ($1) returning id', ['game_entry']);
  await appendLedgerEntry({ userId, walletAsset: asset, amountDelta: -1, reason: 'ticket_consumption', transactionGroupId: group[0].id, idempotencyKey: `${idempotencyKey}:ticket` });
  logEvent('ticket_consumed', { userId, variantId, asset });

  const runs = await query<{ id: string }>(
    `insert into game_runs (user_id, variant_id, status, ruleset_version, idempotency_key)
     values ($1, $2, 'RUNNING', $3, $4)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
     returning id`,
    [userId, variantId, variants[0].active_ruleset_version, idempotencyKey]
  );
  logEvent('game_entry_created', { userId, variantId, runId: runs[0].id });
  return { runId: runs[0].id, rewardEligible: variants[0].reward_eligible, rulesetVersion: variants[0].active_ruleset_version };
}

export async function completeRun(userId: string, runId: string, score: number, idempotencyKey: string) {
  const runs = await query<{ id: string; ruleset_version: string; variant_id: string }>(
    'select id, ruleset_version, variant_id from game_runs where id = $1 and user_id = $2',
    [runId, userId]
  );
  if (!runs[0]) throw new NotFoundError('Run not found');
  if (score < 0) throw new ValidationError('Invalid score');

  const coins = score >= 50 ? 10 : 3;
  const xp = score >= 50 ? 25 : 10;
  const rewardCredits = score >= 80 ? 2 : 0;
  const groupId = randomUUID();
  await query('insert into ledger_transaction_groups (id, reason) values ($1, $2)', [groupId, 'run_completion']);

  await appendLedgerEntry({ userId, walletAsset: 'COIN', amountDelta: coins, reason: 'run_reward_coin', transactionGroupId: groupId, idempotencyKey: `${idempotencyKey}:coin` });
  await appendLedgerEntry({ userId, walletAsset: 'SEASON_XP', amountDelta: xp, reason: 'run_reward_xp', transactionGroupId: groupId, idempotencyKey: `${idempotencyKey}:xp` });
  if (rewardCredits > 0) {
    await appendLedgerEntry({ userId, walletAsset: 'REWARD_CREDIT', amountDelta: rewardCredits, reason: 'run_reward_credit', transactionGroupId: groupId, idempotencyKey: `${idempotencyKey}:reward` });
  }

  await query('update game_runs set status = $2, completed_at = now() where id = $1', [runId, 'COMPLETED']);
  await query(
    `insert into game_results (run_id, score, coins_awarded, xp_awarded, reward_credits_awarded, ruleset_version, idempotency_key)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key`,
    [runId, score, coins, xp, rewardCredits, runs[0].ruleset_version, idempotencyKey]
  );
  logEvent('game_run_completed', { runId, userId, score, rulesetVersion: runs[0].ruleset_version });
  return { runId, coins, xp, rewardCredits, rulesetVersion: runs[0].ruleset_version };
}
