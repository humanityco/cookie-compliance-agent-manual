import { qwikVite } from '@builder.io/qwik/optimizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    qwikVite({
      csr: true,
    }),
  ],
  server: {
    host: 'localhost',
    port: 8105,
    strictPort: true,
  },
})
