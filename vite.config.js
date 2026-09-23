import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Horison Afrique — maquette navigable (React + Vite)
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // écoute sur 0.0.0.0 (aperçu en ligne)
    port: 5173,
    strictPort: false,
    allowedHosts: true, // accepte le domaine d'aperçu Arena
    cors: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
