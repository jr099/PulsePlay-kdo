import { query } from '@/lib/db/client';
import { logEvent } from '@/lib/logger/logger';
import type { WalletAsset, WalletBalance } from '@/types/domain';

export async function getBalances(userId: string): Promise<WalletBalance[]> {
  return query<WalletBalance>(
    'select asset::text as asset, balance::int as amount from wallets where user_id = $1 order by asset',
    [userId]
  );
}

export async function getLedger(userId: string) {
  return query(
    'select id, asset, amount_delta, reason, created_at from wallet_ledger where user_id = $1 order by created_at desc limit 100',
    [userId]
  );
}

export async function appendLedgerEntry(input: {
  userId: string;
  walletAsset: WalletAsset;
  amountDelta: number;
  reason: string;
  transactionGroupId: string;
  idempotencyKey: string;
}) {
  const rows = await query<{ id: string }>(
    `insert into wallet_ledger (user_id, asset, amount_delta, reason, transaction_group_id, idempotency_key)
     values ($1, $2::wallet_asset, $3, $4, $5, $6)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
     returning id`,
    [input.userId, input.walletAsset, input.amountDelta, input.reason, input.transactionGroupId, input.idempotencyKey]
  );
  await query(
    `insert into wallets (user_id, asset, balance) values ($1, $2::wallet_asset, $3)
    on conflict (user_id, asset) do update set balance = wallets.balance + excluded.balance, updated_at = now()`,
    [input.userId, input.walletAsset, input.amountDelta]
  );
  logEvent('ledger_entry_created', { userId: input.userId, asset: input.walletAsset, delta: input.amountDelta, reason: input.reason });
  return rows[0];
}

export async function reserveRewardCredits(userId: string, amount: number, idempotencyKey: string) {
  return query(
    `insert into wallet_reservations (user_id, asset, amount, status, idempotency_key)
     values ($1, 'REWARD_CREDIT', $2, 'ACTIVE', $3)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
     returning id, status`,
    [userId, amount, idempotencyKey]
  );
}

export async function releaseReservation(reservationId: string) {
  return query(
    `update wallet_reservations set status = 'RELEASED', released_at = now() where id = $1 returning id, status`,
    [reservationId]
  );
}
