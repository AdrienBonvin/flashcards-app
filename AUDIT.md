# Audit Spira — septembre 2026

État des lieux du code (React 19 / Vite / Firebase / PWA) et suivi des corrections.
Chaque point coché correspond à un commit sur la branche `claude/spira-audit-improvements-t7o0fj`.

## 1. Bugs bloquants

- [x] **Page blanche à vie en rafraîchissant `/deck/:id`** : les decks n'étaient chargés que par le montage de la page d'accueil. Le contexte charge maintenant les données dès que l'utilisateur est connu ; un deck introuvable redirige vers `/`.
- [x] **Flash de l'écran de connexion à chaque rechargement** : l'app affichait le login avant que Firebase ait restauré la session. Ajout d'un état `isAuthReady`.
- [x] **Loader bloqué à l'infini si le chargement échoue** (`setIsLoading(false)` jamais appelé en cas d'erreur) et loader rendu dans le flux au lieu d'un overlay.
- [x] **Fin de révision : `navigate(-1)` sortait du site** si on était arrivé par URL directe.
- [x] **Découpage en chunks Firebase** (introduit puis corrigé pendant l'audit) : plantage au démarrage par import circulaire.

## 2. Bugs fonctionnels

- [x] Suppression d'une carte sans confirmation (un tap = perte définitive).
- [x] Compteur « cartes ajoutées » incrémenté même si la carte était vide ou si l'écriture échouait.
- [x] `decks.sort()` mutait l'état du contexte pendant le rendu.
- [x] Renommer un deck depuis sa page écrivait Firestore en direct sans mettre à jour le contexte.
- [x] `onTouchStart={preventDefault}` : sans effet (listener passif) mais génère un warning console.
- [x] Refetch N+1 (1 requête Firestore par deck) à **chaque** retour sur la liste des decks.
- [x] Données de l'utilisateur précédent conservées après déconnexion.
- [x] Messages d'erreur d'authentification bruts en anglais (`auth/invalid-credential`).
- [x] Pas de soumission des formulaires avec Entrée (login, deck, carte).
- [x] Pas de « mot de passe oublié ».
- [x] Erreurs réseau / Firestore silencieuses (console uniquement) → toast.
- [x] Cartes acquises (dorées) invisibles en tant que telles dans l'éditeur, impossibles à réactiver.

## 3. CSS / rendu

- [x] `rgb(0, 156, 202 / 0.3)` : syntaxe invalide, ignorée par les navigateurs (sélection, ombres glow).
- [x] Un `}` littéral se retrouvait dans l'attribut `class` de la FlipCard.
- [x] `100vh` → `100dvh` (barres d'outils mobiles).
- [x] Logo 214 Ko affiché sur chaque écran → 29 Ko (palette 256 couleurs, rendu identique).
- [x] 3,8 Mo d'images jamais importées dans `src/assets`.

## 4. PWA / hors ligne

- [x] Service worker sans `skipWaiting`/`clientsClaim` : la mise à jour n'était appliquée qu'après fermeture de tous les onglets.
- [x] Pas de fallback de navigation : `/deck/xyz` hors ligne échouait.
- [x] Logo exclu du précache ; Google Fonts non mises en cache.
- [x] Firestore sans cache local : l'app « installable » était inutilisable sans réseau. Cache IndexedDB persistant multi-onglets activé.
- [x] `manifest.json` : typo « fibbonaci », `theme_color` différent du fond réel, screenshot déclaré JPEG avec extension `.png`, pas de `lang`/`id`/`scope`/`purpose maskable`.
- [x] `index.html` : `lang="en"` sur une app française, pas de meta description, theme-color, apple-touch-icon.
- [x] Plugin mkcert exécuté au build/preview (téléchargement GitHub, plantait hors ligne) → limité à `vite dev`.

## 5. Accessibilité

- [x] Aucun `aria-label` sur les boutons icône (retour, ajout, menus, pouces, déconnexion…).
- [x] Popin : pas de fermeture par Échap, id de titre fixe (doublons possibles), focus non géré.
- [x] FlipCard : Espace ne retournait pas la carte, pas d'état `aria-pressed`.
- [x] Barre de progression sans `role="progressbar"`.
- [x] Raccourcis clavier en révision (Espace, ←, →, E).

## 6. Sécurité

- [x] Règles Firestore sans validation : n'importe quel champ pouvait être écrit, `userId` transférable. Whitelist des champs, types et tailles bornés.
- [x] Suppression de deck en N `deleteDoc` → `writeBatch` par lots de 500.
- La clé API Firebase dans le code est normale (restriction par domaine côté console Google Cloud).

## 7. Qualité de code / outillage

- [x] Fichiers morts : `public/index.html` (boilerplate Firebase), `App.css` vide, `LinkButton`, `TextCounter`, `Icon` non importés, `postcss.config.js` dupliqué.
- [x] Dépendances inutilisées : `@tailwindcss/vite` (v4 jamais utilisé), `@types/react-router-dom` (v5). MUI + Emotion remplacés par 27 SVG locaux (46 paquets en moins).
- [x] Cache de déploiement `.firebase/` commité (commits « Mise à jour du cache… ») → ignoré.
- [x] `console.log` de debug, libellé « Save » en anglais.
- [x] 3 warnings ESLint (dépendances de hooks manquantes) → 0.
- [x] Aucun test → 11 tests Vitest sur la logique métier (Fibonacci, dates, filtre de révision, erreurs auth).
- [x] Pas de CI → GitHub Actions (lint, typecheck, tests, build).
- [x] Fibonacci récursif exponentiel → itératif ; `spacedRepetition.tsx` → `.ts`.
- [x] Chunks vendors séparés (react, firebase) : une mise à jour ne retélécharge que ~50 Ko d'app.
- [x] README : boilerplate Vite retiré, scripts et structure documentés.

## Non traité (à décider)

- **Poids Firebase** : 550 Ko minifiés / 130 Ko gzip pour auth + firestore, incompressible sans changer de backend ou renoncer au hors ligne (`firestore/lite`).
- **Lecture vocale** : uniquement en français (`fr-FR`). À paramétrer par deck si des cartes sont dans une autre langue.
- **Tests d'intégration** : le parcours connecté (login → révision) n'est pas testé automatiquement ; nécessite l'émulateur Firebase.
- **Règles Firestore** : non exécutées contre l'émulateur ici. À vérifier avec `firebase emulators:exec` avant déploiement.
- **Statistiques** : aucune vue d'historique (cartes acquises par semaine, streak). Fonctionnalité, pas un défaut.
