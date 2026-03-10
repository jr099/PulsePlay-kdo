import { getCurrentUserId } from '@/services/auth/auth-service';
import { getLimits, getProfile } from '@/services/profile/profile-service';

export default async function AccountPage() {
  const userId = getCurrentUserId();
  const [profile, limits] = await Promise.all([getProfile(userId), getLimits(userId)]);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Compte</h1>
      <p>Profil: {profile.display_name}</p>
      <p>Consentements: gérés dans user_consents.</p>
      <p>Limite de jeu quotidienne: {limits.daily_play_limit}</p>
      <p>Sécurité: API idempotentes et audit admin.</p>
    </section>
  );
}
