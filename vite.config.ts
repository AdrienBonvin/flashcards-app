import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
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
