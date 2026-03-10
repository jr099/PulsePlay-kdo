import { query } from '@/lib/db/client';
import { NotFoundError } from '@/lib/errors/app-error';

export async function getCurrentSeason() {
  const rows = await query('select id, name, starts_at, ends_at from seasons where is_active = true limit 1');
  if (!rows[0]) throw new NotFoundError('No active season');
  return rows[0];
}

export async function getLeaderboard() {
  return query('select rank, user_id, xp_total from leaderboard_snapshots where season_id = (select id from seasons where is_active = true limit 1) order by rank limit 20');
}

export async function getMissions(userId: string) {
  return query(
    `select m.id, m.title, m.target_value, coalesce(mp.progress_value,0) as progress_value
     from missions m
     left join mission_progress mp on mp.mission_id = m.id and mp.user_id = $1
     where m.season_id = (select id from seasons where is_active = true limit 1)`,
    [userId]
  );
}
