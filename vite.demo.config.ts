import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  base: process.env.GITHUB_REPOSITORY ? '/dyvo-vue-ui/' : '/',
  root: 'demo',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true
  }
})
