import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from './src/config.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
            target: `http://${config.server_host}:${config.server_port}`, // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
