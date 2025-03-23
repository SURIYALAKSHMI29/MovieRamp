import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['movieramp.onrender.com'], 
  },
  plugins: [react()],
})
