import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['23fe-2001-e60-cb47-f4a1-48f0-84ce-f5cc-9ab0.ngrok-free.app']
  }
})
