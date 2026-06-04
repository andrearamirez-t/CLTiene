import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'charts':        ['recharts'],
          'firebase':      ['firebase/app', 'firebase/auth'],
          'pdf':           ['jspdf'],
          'html2canvas':   ['html2canvas'],
        },
      },
    },
  },
})
