import { query } from '@/lib/db/client';
import { logEvent } from '@/lib/logger/logger';

export async function listProducts() {
  return query('select id, code, name, price_cents, currency from payment_products where is_active = true');
}

export async function createCheckoutSession(userId: string, productId: string, idempotencyKey: string) {
  const rows = await query(
    `insert into payment_orders (user_id, product_id, status, idempotency_key)
     values ($1, $2, 'PENDING', $3)
     on conflict (idempotency_key) do update set idempotency_key = excluded.idempotency_key
     returning id`,
    [userId, productId, idempotencyKey]
  );
  logEvent('payment_checkout_created', { userId, productId, orderId: rows[0].id });
  return { orderId: rows[0].id, checkoutUrl: `https://checkout.mock/pulseplay/${rows[0].id}` };
}
