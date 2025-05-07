import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 3002
  // },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@adapters': path.resolve(import.meta.dirname, './src/adapters'),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@context': path.resolve(import.meta.dirname, './src/context'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
      '@models': path.resolve(import.meta.dirname, './src/models'),
      '@modules': path.resolve(import.meta.dirname, './src/modules'),
      '@redux': path.resolve(import.meta.dirname, './src/redux'),
      '@routes': path.resolve(import.meta.dirname, './src/routes'),
      '@styles': path.resolve(import.meta.dirname, './src/styles'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
    }
  },
})
