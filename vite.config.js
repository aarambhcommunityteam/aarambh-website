import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { productTestingDev } from './scripts/product-testing-dev.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), productTestingDev(loadEnv(mode, '.', ''))],
}))
