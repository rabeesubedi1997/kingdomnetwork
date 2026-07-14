import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/livewire': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/css': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/js': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/fonts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/filament': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourceMap: true,
  },
})