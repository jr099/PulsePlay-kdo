import { getCurrentSeason, getLeaderboard, getMissions } from '@/services/seasons/season-service';
import { getCurrentUserId } from '@/services/auth/auth-service';

export default async function SeasonPage() {
  const [season, leaderboard, missions] = await Promise.all([getCurrentSeason(), getLeaderboard(), getMissions(getCurrentUserId())]);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Hub Saison</h1>
      <p>Saison active: {season.name}</p>
      <ul className="text-sm">{missions.map((m: { id: string; title: string; progress_value: number; target_value: number }) => <li key={m.id}>{m.title} - {m.progress_value}/{m.target_value}</li>)}</ul>
      <ul className="text-sm">{leaderboard.map((l: { rank: number; user_id: string; xp_total: number }) => <li key={l.rank}>#{l.rank} - {l.user_id} ({l.xp_total} XP)</li>)}</ul>
    </section>
  );
}
