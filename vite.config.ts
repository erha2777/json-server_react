import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // 跨域代理
      '/api': {
        // target: 'http://' + env.VUE_APP_BASE_API,
        // target: loadEnv(mode, process.cwd()).VITE_BASE_URL,
        target: 'http://localhost:3000', //
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 代理 WebSocket 或 socket
      // '/socket.io': {
      //   target: 'ws://localhost:3000',
      //   ws: true
      //  }
    },
  },
})
