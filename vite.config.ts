import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, isPreview }) => ({
  plugins: [
    react(),
    // Certificat HTTPS local uniquement pour `vite dev` : le plugin télécharge mkcert
    // depuis GitHub, inutile (et bloquant hors ligne) pour build et preview
    command === 'serve' && !isPreview && mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // use existing public/manifest.json
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        // Précache le shell de l'app + le logo (29 Ko, affiché sur chaque écran).
        // Les jeux d'icônes windows11/ios/android restent en cache à la demande (voir sw.ts)
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}', 'icons/logo-512.png', 'assets/*.png'],
      },
    }),
  ],
  build: {
    // Le chunk Firebase (auth + firestore) pèse ~550 Ko minifié / 130 Ko gzip : connu, accepté
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vendors dans des chunks séparés : une mise à jour de l'app ne fait
        // retélécharger (et re-précacher) que ~50 Ko au lieu de ~830 Ko
        // Firebase reste en un seul chunk : le séparer par service (auth,
        // firestore, core) crée des imports circulaires entre chunks et plante
        // au démarrage (« Cannot access X before initialization »)
        manualChunks(id) {
          if (id.includes('node_modules/@firebase/') || id.includes('node_modules/firebase/'))
            return 'firebase'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
  server: {
    proxy: {
      '/__/auth': {
        target: 'https://flashcards-app-7a630.firebaseapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
}))
