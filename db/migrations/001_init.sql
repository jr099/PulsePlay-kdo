create extension if not exists pgcrypto;

do $$ begin
  create type wallet_asset as enum ('COIN','TICKET_FREE','TICKET_PREMIUM','SEASON_XP','GEM','REWARD_CREDIT');
exception when duplicate_object then null; end $$;
do $$ begin
  create type ticket_class as enum ('FREE','PREMIUM');
exception when duplicate_object then null; end $$;

do $$ begin
  create type run_status as enum ('RUNNING','COMPLETED','CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type redemption_status as enum ('PENDING','APPROVED','REJECTED','FULFILLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reservation_status as enum ('ACTIVE','RELEASED','CONSUMED');
exception when duplicate_object then null; end $$;

create table if not exists users (id uuid primary key default gen_random_uuid(), email text not null unique, created_at timestamptz not null default now());
create table if not exists profiles (user_id uuid primary key references users(id), display_name text not null, updated_at timestamptz not null default now());
create table if not exists user_consents (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), consent_type text not null, granted boolean not null, created_at timestamptz not null default now());
create table if not exists user_limits (user_id uuid primary key references users(id), daily_play_limit int not null default 100, updated_at timestamptz not null default now());

create table if not exists wallets (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), asset wallet_asset not null, balance bigint not null default 0, updated_at timestamptz not null default now(), unique(user_id, asset));
create table if not exists ledger_transaction_groups (id uuid primary key default gen_random_uuid(), reason text not null, created_at timestamptz not null default now());
create table if not exists wallet_ledger (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), asset wallet_asset not null,
  amount_delta bigint not null, reason text not null, transaction_group_id uuid not null references ledger_transaction_groups(id),
  idempotency_key text not null unique, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create index if not exists idx_wallet_ledger_user_created on wallet_ledger(user_id, created_at desc);
create table if not exists wallet_reservations (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), asset wallet_asset not null, amount bigint not null, status reservation_status not null, idempotency_key text unique, released_at timestamptz, created_at timestamptz not null default now());

create table if not exists games (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, description text not null, is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists game_variants (
  id uuid primary key default gen_random_uuid(), game_id uuid not null references games(id), slug text not null unique, name text not null,
  ticket_class ticket_class not null, reward_eligible boolean not null, estimated_duration_sec int not null,
  active_ruleset_version text not null, probability_version_id uuid, transparency_text text not null, is_active boolean not null default true,
  created_at timestamptz not null default now());
create table if not exists game_rulesets (id uuid primary key default gen_random_uuid(), variant_id uuid not null references game_variants(id), version text not null, rule_json jsonb not null, published_at timestamptz not null default now(), unique(variant_id, version));
create table if not exists game_runs (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), variant_id uuid not null references game_variants(id), status run_status not null, ruleset_version text not null, idempotency_key text not null unique, created_at timestamptz not null default now(), completed_at timestamptz);
create table if not exists game_results (id uuid primary key default gen_random_uuid(), run_id uuid not null references game_runs(id), score int not null check(score >= 0), coins_awarded int not null, xp_awarded int not null, reward_credits_awarded int not null, ruleset_version text not null, idempotency_key text unique, created_at timestamptz not null default now());

create table if not exists seasons (id uuid primary key default gen_random_uuid(), name text not null, is_active boolean not null default false, starts_at timestamptz not null, ends_at timestamptz not null, created_at timestamptz not null default now());
create table if not exists season_rulesets (id uuid primary key default gen_random_uuid(), season_id uuid not null references seasons(id), version text not null, rules_json jsonb not null, published_at timestamptz not null default now());
create table if not exists season_progress (id uuid primary key default gen_random_uuid(), season_id uuid not null references seasons(id), user_id uuid not null references users(id), xp_total int not null default 0, updated_at timestamptz not null default now(), unique(season_id, user_id));
create table if not exists missions (id uuid primary key default gen_random_uuid(), season_id uuid not null references seasons(id), title text not null, target_value int not null, created_at timestamptz not null default now());
create table if not exists mission_progress (id uuid primary key default gen_random_uuid(), mission_id uuid not null references missions(id), user_id uuid not null references users(id), progress_value int not null default 0, updated_at timestamptz not null default now(), unique(mission_id, user_id));
create table if not exists leaderboard_snapshots (id uuid primary key default gen_random_uuid(), season_id uuid not null references seasons(id), rank int not null, user_id uuid not null references users(id), xp_total int not null, captured_at timestamptz not null default now());

create table if not exists reward_rulesets (id uuid primary key default gen_random_uuid(), version text not null unique, rules_json jsonb not null, published_at timestamptz not null default now());
create table if not exists reward_catalog_items (id uuid primary key default gen_random_uuid(), name text not null, cost_credits int not null check(cost_credits > 0), status text not null, metadata jsonb not null default '{}'::jsonb);
create table if not exists reward_credit_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), amount_delta int not null, reason text not null, created_at timestamptz not null default now());
create table if not exists reward_redemption_requests (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), item_id uuid not null references reward_catalog_items(id), cost_credits int not null, status redemption_status not null, idempotency_key text unique, reviewed_at timestamptz, created_at timestamptz not null default now());

create table if not exists payment_products (id uuid primary key default gen_random_uuid(), code text unique not null, name text not null, price_cents int not null, currency text not null default 'EUR', is_active boolean not null default true);
create table if not exists payment_orders (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), product_id uuid not null references payment_products(id), status text not null, idempotency_key text unique, created_at timestamptz not null default now());
create table if not exists payment_transactions (id uuid primary key default gen_random_uuid(), order_id uuid not null references payment_orders(id), provider text not null, provider_tx_id text, status text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table if not exists payment_webhook_events (id uuid primary key default gen_random_uuid(), provider text not null, event_type text not null, payload jsonb not null, idempotency_key text unique, received_at timestamptz not null default now());

create table if not exists audit_logs (id uuid primary key default gen_random_uuid(), actor_id text not null, action_type text not null, entity_type text not null, entity_id text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table if not exists admin_actions (id uuid primary key default gen_random_uuid(), admin_user_id text not null, action_type text not null, target_id text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table if not exists policy_versions (id uuid primary key default gen_random_uuid(), policy_type text not null, version text not null, content_md text not null, published boolean not null default true, published_at timestamptz not null default now(), unique(policy_type, version));
create table if not exists probability_versions (id uuid primary key default gen_random_uuid(), game_variant_id uuid references game_variants(id), version text not null, disclosure_text text not null, published boolean not null default true, published_at timestamptz not null default now(), unique(game_variant_id, version));
create table if not exists risk_flags (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id), flag_type text not null, severity text not null, status text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
