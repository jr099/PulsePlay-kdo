import { query } from '@/lib/db/client';
import { NotFoundError } from '@/lib/errors/app-error';
import { logEvent } from '@/lib/logger/logger';

export async function listRewardQueue() {
  return query(`select rr.id, rr.user_id, rr.item_id, rr.cost_credits, rr.status, rr.created_at
    from reward_redemption_requests rr where rr.status = 'PENDING' order by rr.created_at`);
}

async function updateRedemptionStatus(id: string, status: 'APPROVED' | 'REJECTED', adminUserId: string) {
  const rows = await query('update reward_redemption_requests set status = $2, reviewed_at = now() where id = $1 returning id', [id, status]);
  if (!rows[0]) throw new NotFoundError('Redemption not found');
  await query('insert into admin_actions (admin_user_id, action_type, target_id, metadata) values ($1, $2, $3, $4)', [adminUserId, `reward_${status.toLowerCase()}`, id, JSON.stringify({ status })]);
  logEvent(status === 'APPROVED' ? 'reward_redemption_approved' : 'reward_redemption_rejected', { id, adminUserId });
  logEvent('admin_action_created', { id, status, adminUserId });
  return rows[0];
}

export const approveRedemption = (id: string, adminUserId: string) => updateRedemptionStatus(id, 'APPROVED', adminUserId);
export const rejectRedemption = (id: string, adminUserId: string) => updateRedemptionStatus(id, 'REJECTED', adminUserId);
