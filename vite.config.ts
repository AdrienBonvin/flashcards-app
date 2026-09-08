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
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        globIgnores: ['**/logo*.png', '**/logo.png'],
      },
    }),
  ],
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
