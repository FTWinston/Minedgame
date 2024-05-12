import { defineConfig } from 'vite'
import preload from 'vite-plugin-preload';
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src')
    },
  },
  plugins: [react(), preload({
    mode: 'preload'
  })],
})
