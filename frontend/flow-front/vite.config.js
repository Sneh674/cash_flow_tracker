import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for both Vercel and Render
  },
  server: {
    historyApiFallback: true, // SPA routing during development
  },
})
