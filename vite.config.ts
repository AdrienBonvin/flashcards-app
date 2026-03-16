import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
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
  css: {
    postcss: {
      plugins: [tailwindcss],
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
})
