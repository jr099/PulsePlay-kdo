import { query } from '@/lib/db/client';
import { NotFoundError } from '@/lib/errors/app-error';

export async function getProfile(userId: string) {
  const rows = await query<{ user_id: string; display_name: string }>('select user_id, display_name from profiles where user_id = $1', [userId]);
  if (!rows[0]) throw new NotFoundError('Profile not found');
  return rows[0];
}

export async function updateProfile(userId: string, displayName: string) {
  const rows = await query<{ user_id: string; display_name: string }>(
    'update profiles set display_name = $2, updated_at = now() where user_id = $1 returning user_id, display_name',
    [userId, displayName]
  );
  if (!rows[0]) throw new NotFoundError('Profile not found');
  return rows[0];
}

export async function getLimits(userId: string) {
  const rows = await query<{ daily_play_limit: number }>('select daily_play_limit from user_limits where user_id = $1', [userId]);
  if (!rows[0]) throw new NotFoundError('Limits not found');
  return rows[0];
}

export async function updateLimits(userId: string, dailyPlayLimit: number) {
  const rows = await query<{ daily_play_limit: number }>(
    'update user_limits set daily_play_limit = $2, updated_at = now() where user_id = $1 returning daily_play_limit',
    [userId, dailyPlayLimit]
  );
  if (!rows[0]) throw new NotFoundError('Limits not found');
  return rows[0];
}
