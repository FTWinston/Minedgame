import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/features/generator/utils/function.ts'),
      output: {
        entryFileNames: `generate.js`,
      }
    },
    outDir: path.resolve(__dirname, 'functions'),
    ssr: true,
  }
})
