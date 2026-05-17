import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(rootDir, '.env.test') })

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    fileParallelism: false,
    maxConcurrency: 1,
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})
