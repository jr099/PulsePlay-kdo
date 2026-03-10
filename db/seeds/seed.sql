insert into users (id, email) values ('00000000-0000-0000-0000-000000000001','demo@pulseplay.local') on conflict do nothing;
insert into profiles (user_id, display_name) values ('00000000-0000-0000-0000-000000000001','Demo Player') on conflict (user_id) do nothing;
insert into user_limits (user_id, daily_play_limit) values ('00000000-0000-0000-0000-000000000001', 30) on conflict (user_id) do nothing;

insert into wallets (user_id, asset, balance) values
('00000000-0000-0000-0000-000000000001','COIN',100),
('00000000-0000-0000-0000-000000000001','TICKET_FREE',5),
('00000000-0000-0000-0000-000000000001','TICKET_PREMIUM',2),
('00000000-0000-0000-0000-000000000001','SEASON_XP',0),
('00000000-0000-0000-0000-000000000001','GEM',50),
('00000000-0000-0000-0000-000000000001','REWARD_CREDIT',10)
on conflict (user_id, asset) do nothing;

insert into seasons (id, name, is_active, starts_at, ends_at)
values ('10000000-0000-0000-0000-000000000001', 'Season Alpha', true, now() - interval '7 days', now() + interval '30 days')
on conflict (id) do nothing;

insert into games (id, slug, name, description) values
('20000000-0000-0000-0000-000000000001','scratch-blitz','Scratch Blitz','Jeu de démonstration PulsePlay')
on conflict (id) do nothing;

insert into game_variants (id, game_id, slug, name, ticket_class, reward_eligible, estimated_duration_sec, active_ruleset_version, transparency_text)
values
('21000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','scratch-blitz-free','Scratch Blitz Free','FREE',true,45,'v1','Variante free: ticket free uniquement.'),
('21000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','scratch-blitz-premium','Scratch Blitz Premium','PREMIUM',true,45,'v1','Variante premium: ticket premium requis.')
on conflict (id) do nothing;

insert into game_rulesets (variant_id, version, rule_json) values
('21000000-0000-0000-0000-000000000001','v1','{"coin":{"base":3,"high_score":10},"xp":{"base":10,"high_score":25},"reward":{"high_score":2}}'),
('21000000-0000-0000-0000-000000000002','v1','{"coin":{"base":5,"high_score":12},"xp":{"base":12,"high_score":30},"reward":{"high_score":3}}')
on conflict (variant_id, version) do nothing;

insert into missions (id, season_id, title, target_value) values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Compléter 3 parties',3),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Gagner 50 XP',50)
on conflict (id) do nothing;

insert into mission_progress (mission_id, user_id, progress_value) values
('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',1),
('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',12)
on conflict (mission_id, user_id) do nothing;

insert into leaderboard_snapshots (season_id, rank, user_id, xp_total)
values ('10000000-0000-0000-0000-000000000001',1,'00000000-0000-0000-0000-000000000001',120)
on conflict do nothing;

insert into reward_catalog_items (id, name, cost_credits, status, metadata) values
('40000000-0000-0000-0000-000000000001','Carte cadeau 5€',50,'ACTIVE','{}'),
('40000000-0000-0000-0000-000000000002','Skin exclusif',20,'ACTIVE','{}'),
('40000000-0000-0000-0000-000000000003','Boost saison',15,'ACTIVE','{}')
on conflict (id) do nothing;

insert into payment_products (id, code, name, price_cents, currency, is_active) values
('50000000-0000-0000-0000-000000000001','gems_pack_s','Pack Gems S',499,'EUR',true),
('50000000-0000-0000-0000-000000000002','premium_pass_m','Premium Pass Mensuel',999,'EUR',true)
on conflict (id) do nothing;

insert into policy_versions (policy_type, version, content_md, published)
values
('terms','1.0.0','Conditions PulsePlay v1',true),
('privacy','1.0.0','Politique de confidentialité v1',true)
on conflict (policy_type, version) do nothing;

insert into probability_versions (id, game_variant_id, version, disclosure_text, published)
values ('60000000-0000-0000-0000-000000000001','21000000-0000-0000-0000-000000000001','1.0.0','Distribution de score publiée v1',true)
on conflict (id) do nothing;

update game_variants set probability_version_id = '60000000-0000-0000-0000-000000000001' where id = '21000000-0000-0000-0000-000000000001';
