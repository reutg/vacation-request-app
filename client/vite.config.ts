import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const clientRoot = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // pnpm symlink layout: point at the published ESM entry so `import dayjs from 'dayjs'` always resolves.
      dayjs: path.join(clientRoot, 'node_modules/dayjs/esm/index.js'),
    },
  },
  optimizeDeps: {
    include: ['dayjs'],
  },
})
