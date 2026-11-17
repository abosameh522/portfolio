import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — static-site friendly. For GitHub Pages project sites set
// `base` to '/<repo-name>/' (see README). Vercel works with the default '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    // The project now lives in its own folder, so Vite's default recursive
    // watch is safe. Keep generated/installed folders out of it anyway.
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
  },
  build: {
    target: 'es2020',
    // three.js is intentionally large but lazy-loaded; silence the size hint.
    chunkSizeWarningLimit: 1200,
    // Keep chunks reasonable; the 3D scene is loaded lazily via React.lazy.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'gsap', 'lenis'],
        },
      },
    },
  },
})
