import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Libera o acesso para o Docker expor a porta
    port: 5173, 
    watch: {
      usePolling: true,
    }
  }
})