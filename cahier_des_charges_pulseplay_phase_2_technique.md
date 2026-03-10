# Cahier des charges technique — PulsePlay

## 1. Synthèse technique

PulsePlay est une plateforme de mini-jeux compétitifs mobile-first, pensée pour une architecture moderne, modulaire, observable et conforme-by-design. Ce document n’est pas un blueprint produit : c’est un **cahier des charges d’implémentation** destiné à cadrer le travail design + développement et à servir de base au futur prompt Codex.

Le périmètre couvre le socle MVP permettant : authentification, profil, wallets multi-ressources, ledger append-only, tickets free/premium, variantes de jeux, progression saisonnière, rewards, paiements premium, conformité, auditabilité et console admin. Le document tranche les ambiguïtés structurantes entre free, premium, reward, conversion et sortie patrimoniale.

---

## 2. Plan d’action

### Objectif du document
Transformer les décisions produit déjà validées en un référentiel exécutable pour démarrer le développement du site et de l’API.

### Livrables attendus à partir de ce CDC
- architecture applicative cible
- découpage fonctionnel des modules
- spécification des pages MVP
- schéma de données cible
- contrats d’API minimaux
- règles métier impératives
- contraintes de conformité et de sécurité
- plan de build 90 jours

### Hors périmètre de ce document
- copywriting marketing final
- code source complet
- wireframes détaillés haute fidélité
- dimensionnement infra final détaillé
- contenu juridique rédigé par conseil externe

---

## 3. Contexte et objectifs produit

### Positionnement
PulsePlay est une plateforme de mini-jeux compétitifs avec progression transparente, économie lisible et séparation claire entre jeu, premium, récompenses et sorties de valeur.

### Objectifs business
- créer une boucle de sessions courtes mobile-first
- monétiser des accès premium et options de confort
- conserver un cadre de confiance lisible
- permettre des rewards encadrés et traçables
- éviter les mécaniques legacy opaques du segment

### Objectifs techniques
- livrer une base maintenable et modulaire
- rendre tous les flux de valeur auditables
- isoler les domaines sensibles : paiements, rewards, conformité
- garantir l’idempotence des opérations financières
- fournir une base exploitable par Codex pour accélérer le build

---

## 4. Principes structurants obligatoires

### 4.1 Principes produit
- l’économie doit rester compréhensible en une lecture
- toute ressource doit avoir une définition claire
- aucune promesse implicite de rendement
- les règles de gain, conversion et retrait doivent être explicites
- les différences entre free et premium doivent être visibles avant l’entrée en jeu

### 4.2 Principes techniques
- architecture API-first
- séparation stricte des domaines métier
- ledger append-only pour toute variation de valeur
- règles métier versionnées
- journalisation structurée des événements critiques
- traitements async idempotents pour paiements, rewards, settlements et antifraude

### 4.3 Principes UX
- mobile-first
- sessions courtes de 30 à 90 secondes
- accès en un tap aux règles applicables
- pas de bascule manipulatrice free vers paywall pour poursuivre exactement la même session
- historique personnel clair et exportable

---

## 5. Stack technique obligatoire

### Frontend
- Next.js App Router
- React
- TypeScript strict
- TailwindCSS
- design system composable
- validation d’inputs côté client via schémas typés
- API client typée
- state management par domaine
- mobile-first natif

### Backend
- architecture backend moderne de type NestJS ou équivalent modulaire
- API REST ou BFF structuré par domaine
- services métier explicites
- traitements async pour webhooks, rewards, antifraude, notifications
- versioning des règles métier

### Data
- PostgreSQL
- ledger append-only
- tables de configuration versionnées
- tables d’audit et d’événements
- exports auditables

### Infra
- observabilité native
- logs structurés
- monitoring et alerting
- gestion des secrets
- RBAC
- CI/CD
- retries et dead-letter si nécessaire

---

## 6. Périmètre fonctionnel MVP

### 6.1 Inclus MVP
- inscription / connexion
- profil utilisateur
- centre compte et consentements
- wallets multi-ressources
- ledger consultable
- tickets free et premium
- au moins un mini-jeu avec variante free et variante premium distinctes
- résultats de partie
- progression saisonnière
- missions de base
- leaderboard simple
- Rewards Hub
- boutique premium (Gems / Tickets Premium selon règles)
- paiements
- historique et exports de base
- console admin minimale

### 6.2 Inclus consolidation
- redemption requests complètes
- antifraude v1
- audit views
- publication des probabilités/barèmes par mode
- contrôle des limites utilisateur

### 6.3 Exclus MVP
- superposition de multiples monnaies opaques
- modes legacy ambigus
- mécaniques de continuation payante de la même session gratuite
- système social complet communautaire
- marketplace entre joueurs

---

## 7. Modèle économique et ressources

### 7.1 Ressources officielles
PulsePlay gère exactement cinq ressources fonctionnelles visibles côté utilisateur :
- Coins
- Tickets
- XP Saison
- Gems
- Reward Credits

### 7.2 Coins
**Définition** : monnaie ludique interne.

**Sources** : gains de partie, objectifs quotidiens, missions, progression.

**Usages** : boutique interne digitale, contenus cosmétiques ou conforts non patrimoniaux selon barème public.

**Achat direct** : non recommandé en MVP.

**Conversion** : possible vers catalogue digital interne seulement, jamais vers Reward Credits ni cash.

**Sortie patrimoniale** : non.

### 7.3 Tickets
**Définition** : unité d’entrée en partie.

**Classes obligatoires** :
- Ticket Free
- Ticket Premium

**Règle structurante** : un Ticket Premium débloque une **variante premium distincte** du jeu ou un mode premium dédié. Il ne sert pas à continuer artificiellement une session free interrompue.

**Sources** :
- Ticket Free : dotation quotidienne, missions, bonus de progression
- Ticket Premium : achat, bundle premium, bonus premium annoncés

**Conversion** : non.

**Sortie patrimoniale** : non en tant qu’asset lui-même.

**Point critique** : des modes free et premium peuvent partager un cadre commun de rewards ou de sortie patrimoniale possible, mais ce partage doit être explicitement documenté, versionné, publié et auditable.

### 7.4 XP Saison
**Définition** : ressource de progression compétitive et saisonnière.

**Achat direct** : non.

**Conversion / sortie** : non.

**Usage** : niveaux, missions, classement, badges et statuts.

### 7.5 Gems
**Définition** : monnaie premium optionnelle.

**Sources** : achats, bonus commerciaux, compensation support si nécessaire.

**Usages** : accès premium, cosmétiques, conforts, battle pass ou équivalent non cash.

**Conversion** : jamais vers Reward Credits ni cash.

**Sortie patrimoniale** : non.

### 7.6 Reward Credits
**Définition** : solde de récompenses éligibles distinct du jeu et du premium.

**Sources** : événements, objectifs, campagnes, performances ou compétitions explicitement marqués reward-eligible.

**Achat direct** : interdit.

**Conversion** : vers catalogue reward externe éligible, selon règles publiées.

**Sortie patrimoniale** : possible selon cadre légal, zone, seuils et contrôles.

---

## 8. Frontières de valeur obligatoires

### 8.1 Ce qui est purement ludique
- Coins
- XP Saison
- partie de jeu
- progression saisonnière
- cosmétiques internes

### 8.2 Ce qui est premium mais non patrimonial
- Gems
- Tickets Premium
- accès à des variantes premium
- options de confort et de personnalisation

### 8.3 Ce qui est éligible à récompense
- Reward Credits uniquement
- certains runs, missions, campagnes ou compétitions marqués reward-eligible

### 8.4 Ce qui peut sortir vers l’externe
- Reward Credits, via catalogue ou mécanisme de retrait autorisé

### 8.5 Ce qui ne peut jamais être acheté directement
- Reward Credits
- issue d’un tirage
- gain garanti
- probabilités secrètement améliorées
- rang saisonnier direct

---

## 9. Règles free / premium obligatoires

### 9.1 Séparation fonctionnelle
- free et premium sont des parcours distincts
- chaque jeu compatible doit exposer ses variantes explicitement
- la variante premium doit être identifiable avant entrée
- la variante premium peut avoir ses propres règles, coûts, plafonds, barèmes et reward eligibility

### 9.2 Interdits produit
- interrompre une session gratuite pour pousser l’utilisateur à payer afin de continuer exactement le même run
- masquer les différences de probabilités, de reward eligibility ou de plafond entre variantes
- laisser croire qu’acheter augmente secrètement l’espérance de gain

### 9.3 Obligations d’affichage
Avant chaque entrée en jeu, afficher :
- type de ticket consommé
- nom du mode / variante
- coût d’accès
- reward eligibility
- probabilités si aléatoire
- limites, plafonds, cooldowns ou conditions spécifiques
- version de règles applicable ou référence consultable

---

## 10. Parcours utilisateur détaillés

### 10.1 Parcours visiteur
1. arrive sur la landing
2. consulte le catalogue jeux
3. consulte le centre de confiance
4. consulte les règles / probabilités
5. crée un compte

### 10.2 Parcours joueur free
1. reçoit des Tickets Free
2. accède au hub Jouer
3. choisit un mode free
4. lit les règles pré-partie
5. lance la session
6. voit le résultat
7. gagne Coins / XP / éventuellement Reward Credits si mode éligible
8. consulte son wallet et sa progression

### 10.3 Parcours joueur premium
1. achète Gems ou Tickets Premium
2. accède à la boutique ou au hub Jouer
3. sélectionne une variante premium distincte
4. lit les règles premium applicables
5. lance la session premium
6. consulte les impacts sur wallet / progression / reward

### 10.4 Parcours rewards
1. consulte le solde Reward Credits
2. ouvre le catalogue
3. visualise les seuils, conditions et délais
4. soumet une demande
5. suit le statut
6. reçoit validation, rejet ou settlement

### 10.5 Parcours admin rewards
1. ouvre la file de review
2. analyse la légitimité
3. consulte l’historique ledger, parties, paiements et flags antifraude
4. approuve ou rejette
5. l’action est journalisée

---

## 11. Architecture fonctionnelle des pages et modules

### 11.1 Navigation primaire
- Jouer
- Saison
- Rewards
- Compte

### 11.2 Landing
**Objectif** : expliquer la promesse produit et la transparence.

**Sections** : hero, comment ça marche, ressources, free vs premium, règles, rewards, centre de confiance, FAQ.

### 11.3 Catalogue Jeux
**Objectif** : présenter les jeux et variantes sans inscription obligatoire.

**Contenus** : modes disponibles, type de ticket requis, durée, nature de la mécanique, reward eligibility, lien vers règles.

### 11.4 Dashboard / Hub Jouer
**Objectif** : concentrer l’accès rapide aux sessions.

**Données affichées** : soldes essentiels, tickets disponibles, objectifs du jour, jeux recommandés, variantes free/premium.

### 11.5 Écran pré-partie
**Objectif** : sécuriser l’entrée en jeu.

**Données obligatoires** : ticket consommé, coût, variante, probabilités, reward eligibility, règles, caps.

### 11.6 Résultat de partie
**Objectif** : rendre visible l’impact du run.

**Données** : résultat, Coins, XP, Reward Credits éventuels, règles appliquées, lien vers historique.

### 11.7 Hub Saison
**Objectif** : progression, missions et leaderboard.

### 11.8 Rewards Hub
**Objectif** : visualiser Reward Credits, catalogue, demandes, statuts.

### 11.9 Wallet Center
**Objectif** : historique complet par ressource.

### 11.10 Boutique Premium
**Objectif** : vendre Gems, packs ou accès premium sans ambiguïté.

### 11.11 Compte / Sécurité / Limites
**Objectif** : gestion profil, consentements, limites et sécurité.

### 11.12 Centre de confiance
**Objectif** : publier règles, probabilités, barèmes, politiques, délais et versions.

### 11.13 Console Admin
**Objectif** : ops, rewards review, antifraude, ajustements, publication de règles.

---

## 12. Architecture applicative cible

### 12.1 Frontend
Structure recommandée :
- `app/`
- `components/`
- `hooks/`
- `services/`
- `lib/`
- `types/`
- `styles/`

Découpage de domaines front :
- auth
- profile
- wallet
- games
- seasons
- rewards
- payments
- compliance
- admin

### 12.2 Backend
Modules de domaine attendus :
- auth
- profile
- wallet
- games
- seasons
- rewards
- payments
- withdrawals
- notifications
- compliance
- admin

### 12.3 Services transverses
- rules engine / configuration versionnée
- audit logging
- antifraude / risk flags
- notification dispatcher
- jobs async
- export service

---

## 13. Modèle de données minimal sérieux

### 13.1 Tables identité / compte
- users
- profiles
- user_consents
- user_limits
- user_security_events

### 13.2 Tables économie / ledger
- wallets
- wallet_ledger
- ledger_transaction_groups
- wallet_reservations

### 13.3 Tables gameplay
- games
- game_variants
- game_rulesets
- game_runs
- game_results
- game_run_events

### 13.4 Tables saison
- seasons
- season_rulesets
- season_progress
- missions
- mission_progress
- leaderboard_snapshots

### 13.5 Tables rewards
- reward_campaigns
- reward_rulesets
- reward_catalog_items
- reward_credit_events
- reward_redemption_requests
- reward_settlements

### 13.6 Tables paiements
- payment_products
- payment_orders
- payment_transactions
- payment_webhook_events
- refund_events

### 13.7 Tables conformité / audit
- audit_logs
- admin_actions
- risk_flags
- fraud_reviews
- policy_versions
- probability_versions
- ruleset_versions
- consent_events

### 13.8 Tables notifications
- notifications
- notification_preferences
- notification_delivery_logs

---

## 14. Wallet / ledger model

### 14.1 Principe impératif
Aucune variation de valeur ne doit modifier un solde sans écriture append-only dans `wallet_ledger`.

### 14.2 Wallets logiques attendus
- coins_wallet
- tickets_wallet ou séparation ticket_free / ticket_premium selon implémentation retenue
- season_xp_account
- gems_wallet
- reward_credit_wallet

### 14.3 Recommandation de modélisation Tickets
Le CDC recommande **deux classes explicites au minimum dans le ledger** :
- `ticket_class = FREE`
- `ticket_class = PREMIUM`

Deux approches possibles :
1. un seul asset `TICKET` avec colonnes `ticket_class`, `source_type`, `mode_scope`
2. deux assets distincts `TICKET_FREE` et `TICKET_PREMIUM`

**Choix recommandé pour le build initial** : deux assets distincts pour réduire l’ambiguïté et simplifier l’audit.

### 14.4 Champs minimaux wallet_ledger
- id
- user_id
- wallet_type
- asset_code
- direction
- amount
- reason_code
- source_type
- source_id
- transaction_group_id
- rule_version_id
- idempotency_key
- metadata_json
- created_at
- created_by_type
- created_by_id

### 14.5 Types de transactions
- grant
- spend
- reserve
- release
- settlement
- refund
- reversal
- adjustment
- expire

### 14.6 Raisons métier minimales
- daily_bonus
- game_entry
- game_result
- mission_reward
- season_reward
- gems_purchase
- premium_ticket_purchase
- reward_redemption
- fraud_hold
- admin_adjustment
- chargeback_reversal

---

## 15. API domaine par domaine

### 15.1 Auth
Responsabilité : inscription, login, session, récupération, MFA éventuelle.

Endpoints minimaux :
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`

### 15.2 Profile
- `GET /profile/me`
- `PATCH /profile/me`
- `GET /profile/limits`
- `PATCH /profile/limits`
- `GET /profile/consents`
- `PATCH /profile/consents`

### 15.3 Wallet
- `GET /wallets`
- `GET /wallets/ledger`
- `GET /wallets/ledger/:id`
- `POST /wallets/export`
- `GET /wallets/reservations`

### 15.4 Games
- `GET /games`
- `GET /games/:slug`
- `GET /games/:slug/variants`
- `GET /games/variants/:id/rules`
- `POST /games/entries`
- `POST /games/runs/:id/complete`
- `GET /games/runs/:id`

### 15.5 Seasons
- `GET /seasons/current`
- `GET /seasons/current/leaderboard`
- `GET /seasons/current/missions`
- `POST /seasons/missions/:id/claim`
- `GET /seasons/history`

### 15.6 Rewards
- `GET /rewards/balance`
- `GET /rewards/catalog`
- `GET /rewards/rules`
- `POST /rewards/redemptions`
- `GET /rewards/redemptions`
- `GET /rewards/redemptions/:id`

### 15.7 Payments
- `GET /payments/products`
- `POST /payments/checkout-session`
- `POST /payments/webhooks/provider`
- `GET /payments/orders`
- `GET /payments/orders/:id`

### 15.8 Withdrawals
- `POST /withdrawals`
- `GET /withdrawals`
- `GET /withdrawals/:id`
- `POST /withdrawals/:id/cancel`

### 15.9 Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notification-preferences`

### 15.10 Compliance
- `GET /compliance/policies`
- `GET /compliance/probabilities`
- `GET /compliance/transparency`
- `POST /compliance/data-export-request`

### 15.11 Admin
- `GET /admin/users`
- `GET /admin/rewards/queue`
- `POST /admin/rewards/:id/approve`
- `POST /admin/rewards/:id/reject`
- `POST /admin/wallets/adjust`
- `POST /admin/rules/publish`
- `GET /admin/audit-logs`
- `GET /admin/anomalies`

---

## 16. Règles métier critiques

1. Tickets Free et Tickets Premium sont distincts et traçables.
2. Un Ticket Premium débloque une variante premium distincte, pas une continuation artificielle d’un run free.
3. Les différences entre variantes free et premium doivent être visibles avant entrée en jeu.
4. Si free et premium partagent une conversion possible ou une sortie patrimoniale possible commune, cette communauté doit être publique, versionnée, journalisée et auditable.
5. Aucun achat ne doit être présenté comme garantie de gain.
6. Aucune amélioration cachée de probabilité n’est autorisée.
7. Toute différence de barème, plafond, reward eligibility ou règle entre variantes doit être explicitée.
8. Toute variation de valeur doit passer par le ledger append-only.
9. Toute opération financière sensible doit être idempotente.
10. Toute attribution de reward doit être reliée à une règle versionnée.
11. Toute action admin impactant soldes, rewards ou accès doit être justifiée et auditée.
12. L’utilisateur doit pouvoir consulter un historique suffisamment clair pour comprendre l’origine de chaque valeur obtenue ou consommée.

---

## 17. Rewards model d’implémentation

### 17.1 Catégories
- rewards digitales internes
- rewards externes
- cash ou équivalent uniquement si autorisé juridiquement

### 17.2 Flux de demande
1. l’utilisateur consulte le catalogue
2. le système vérifie seuil, disponibilité, région et conditions
3. création de la demande
4. réserve des Reward Credits
5. contrôles anti-abus / conformité
6. approbation ou rejet
7. settlement ou release

### 17.3 Statuts minimaux
- submitted
- pending_review
- reserved
- approved
- rejected
- processing
- settled
- cancelled
- reversed

---

## 18. Competition model d’implémentation

### 18.1 Saison
- durée fixe recommandée : 28 jours
- reset annoncé à l’avance
- archive consultable
- règles et récompenses publiées avant activation

### 18.2 Classements
- XP global
- classement par jeu ou variante si nécessaire
- classement missions / participation

### 18.3 Standard / Premium
Le système ne doit pas opposer artificiellement standard = gratuit et premium = non reward.

Il doit supporter :
- variantes free avec règles propres
- variantes premium avec règles propres
- reward eligibility potentiellement commune selon publication explicite

---

## 19. Conformité, risques et garde-fous

### 19.1 Axes minimaux à couvrir
- consommation / transparence
- gains / probabilités
- récompenses / retraits
- paiements
- consentement cookies
- antifraude
- anti-abus
- design responsable

### 19.2 Garde-fous imposés
- publication des probabilités quand mécanisme aléatoire
- publication des barèmes et conditions par mode
- historique exportable
- consentement versionné et prouvable
- plafonds, cooldowns, caps si nécessaire
- review antifraude pour rewards / withdrawals
- audit périodique des distributions free vs premium

---

## 20. Sécurité, observabilité et auditabilité

### 20.1 Sécurité
- RBAC strict
- moindre privilège
- séparation contextes user / admin / job system
- validation stricte des entrées
- rate limiting
- protection webhooks
- journalisation des actions sensibles

### 20.2 Observabilité
- logs structurés corrélés par user_id, run_id, transaction_group_id, payment_id
- dashboard anomalies paiements / rewards / ledger
- alerting sur échecs de settlement, incohérences ledger, replays webhooks

### 20.3 Auditabilité
- versioning des règles métier
- versioning des probabilités
- trail inviolable des actions admin
- export user-visible de l’historique

---

## 21. Console admin minimale

### Fonctions attendues
- recherche utilisateur
- vue consolidée wallets / ledger
- file de review rewards
- gestion des flags antifraude
- publication de règles / probabilités
- ajustements admin journalisés
- lecture des anomalies

### Permissions
- support read-only
- ops finance
- fraud reviewer
- compliance reviewer
- super admin

---

## 22. Plan de build 90 jours

### MVP — 0 à 30 jours
- setup repo et architecture
- auth + profile
- wallet + ledger append-only
- Tickets Free / Premium
- 1 jeu avec 2 variantes distinctes
- dashboard Jouer
- résultat de partie
- saison MVP
- centre de confiance minimal
- consentements
- logs structurés

### Consolidation — 31 à 60 jours
- payments + Gems
- boutique premium
- wallet center complet
- rewards catalog MVP
- redemption requests
- exports utilisateur
- admin review queue
- antifraude v1
- règles versionnées visibles

### V2 initiale — 61 à 90 jours
- withdrawals / settlements complets
- compliance dashboards
- leaderboards avancés
- policies & probability center complet
- audit comparatif free vs premium
- notifications ciblées
- monitoring et alerting renforcés

---

## 23. Validation attendue avant lancement du build Codex

### Validation produit
- chaque ressource est explicable en une phrase
- chaque mode de jeu expose clairement sa nature free ou premium
- toute communauté de reward entre free et premium est explicitée

### Validation technique
- schéma de données validé
- conventions API validées
- idempotence des flux sensibles définie
- modèle ledger gelé

### Validation conformité
- publications des probabilités prévues
- preuve de consentement prévue
- historique exportable prévu
- actions admin auditables

---

## 24. Résultat attendu du prochain prompt Codex

Le prochain prompt devra demander à Codex de générer :
- structure du repo frontend/backend
- schéma SQL initial
- migrations initiales
- contrats TypeScript
- modules API principaux
- pages front MVP
- règles de validation et middlewares de sécurité
- jeu MVP avec variantes free/premium distinctes
- wallet ledger et flux de paiement / reward de base

---

## 25. Ambiguïtés levées explicitement

- Free et Premium ne sont pas une même boucle avec paywall intermédiaire.
- Tickets Premium servent à accéder à une variante premium distincte.
- Premium peut coexister avec une reward eligibility commune à certains modes free, mais seulement avec publication, traçabilité et audit.
- Gems ne se convertissent pas en Reward Credits.
- Reward Credits restent séparés des monnaies de jeu et premium.
- Toute variation de valeur passe par un ledger append-only.
- Les règles de probabilités, barèmes et rewards doivent être versionnées et consultables.
- Le build doit commencer sur une architecture moderne prête pour modularité, audit et conformité.

