import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'speere': path.resolve(__dirname, '../../src/index.ts'),
      'speere/grammar': path.resolve(__dirname, '../../src/grammar.ts')
    }
  }
})