# Spira (Flashcards App)

Application de flashcards (PWA) avec répétition espacée basée sur la suite de Fibonacci.
Stack : React 19, TypeScript, Vite, Tailwind CSS, Firebase (Auth + Firestore), Workbox.

## Scripts

```bash
npm run dev       # serveur de dev en HTTPS (https://localhost:5173)
npm run build     # typecheck + build de production dans dist/
npm run preview   # sert le build de production
npm run lint      # ESLint
npm test          # tests unitaires (Vitest)
npm run deploy    # build + firebase deploy
```

## Google Sign-In on localhost

Chrome blocks Firebase auth when the app runs on `http://localhost` (Local Network Access policy). The fix:

1. **Use HTTPS** – Dev server runs on `https://localhost:5173` (not `http`)
2. **Trusted certificate (no "not secure" warning)** – Run once:
   ```bash
   brew install mkcert && mkcert -install
   ```
   This installs a local CA so Chrome trusts the dev server's certificate.
3. **Configure Google Cloud** – In [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), edit your OAuth Client ID and add:
   - **Authorized redirect URI:** `https://localhost:5173/__/auth/handler`
   - **Authorized JavaScript origin:** `https://localhost:5173` (optional)

## Deploy to Firebase

1. **Install Firebase CLI** (if needed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login** (if not already):
   ```bash
   firebase login
   ```

3. **Build and deploy**:
   ```bash
   npm run deploy
   ```

Your app will be live at:
- `https://flashcards-app-7a630.web.app`
- `https://flashcards-app-7a630.firebaseapp.com`

## Structure

```
src/
  components/      composants UI (FlipCard, FlashcardReviewer, Popin…)
  components/login écran de connexion (email + Google)
  contexts/        UserDataContext : auth, decks, cartes (source de vérité)
  pages/           DeckPage (liste des decks), FlashcardPage (un deck)
  utils/           spacedRepetition (Fibonacci), speechReader (lecture vocale)
  sw.ts            service worker Workbox (injectManifest)
firestore.rules    règles de sécurité Firestore
```
