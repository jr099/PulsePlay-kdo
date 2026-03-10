# PulsePlay MVP Foundation

Socle MVP Next.js + TypeScript strict + Tailwind + PostgreSQL avec séparation claire gameplay / premium / rewards / paiements / conformité.

## Choix Tickets (MVP)
Le modèle retient **deux assets distincts**: `TICKET_FREE` et `TICKET_PREMIUM` dans `wallet_asset`.
Ce choix simplifie l'auditabilité et évite toute ambiguïté entre flux free et premium.

## Stack
- Next.js App Router
- TypeScript strict
- TailwindCSS
- PostgreSQL (`pg`)
- Zod validation

## Lancement local
1. Copier les variables:
```bash
cp .env.example .env.local
```
2. Installer:
```bash
npm install
```
3. Initialiser la base:
```bash
psql "$DATABASE_URL" -f db/migrations/001_init.sql
npm run seed
```
4. Lancer:
```bash
npm run dev
```

## Variables d'environnement
Voir `.env.example`.

## API MVP
Routes disponibles sous `app/api/*`:
- `/api/me`, `/api/profile`, `/api/profile/limits`
- `/api/wallets`, `/api/wallets/ledger`
- `/api/games`, `/api/games/[slug]`, `/api/games/variants/[id]/rules`, `/api/games/entries`, `/api/games/runs/[id]/complete`
- `/api/seasons/current`, `/api/seasons/current/leaderboard`, `/api/seasons/current/missions`
- `/api/rewards/balance`, `/api/rewards/catalog`, `/api/rewards/redemptions`
- `/api/payments/products`, `/api/payments/checkout-session`
- `/api/compliance/policies`, `/api/compliance/probabilities`
- `/api/admin/rewards/queue`, `/api/admin/rewards/[id]/approve`, `/api/admin/rewards/[id]/reject`
