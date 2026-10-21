import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    host: 'localhost',
    port: 8104,
    strictPort: true,
  },
})
