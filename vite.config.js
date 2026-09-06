import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // VITE_BASE lets one codebase build for more than one target:
  //   unset          -> /anishmohanphotography/   (GitHub Pages, production)
  //   /…/preview/    -> the side-by-side preview deploy
  //   /              -> Netlify / Vercel / Cloudflare, which serve from root
  base: command === 'build'
    ? (process.env.VITE_BASE || '/anishmohanphotography/')
    : '/',
  server: {
    port: 5173,
    strictPort: true,
  },
}))
