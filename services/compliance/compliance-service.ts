import { query } from '@/lib/db/client';

export async function getPolicies() {
  return query('select policy_type, version, content_md, published_at from policy_versions where published = true order by published_at desc');
}

export async function getProbabilities() {
  return query('select id, game_variant_id, version, disclosure_text, published_at from probability_versions where published = true order by published_at desc');
}
