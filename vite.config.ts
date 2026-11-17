import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// This project lives in the home directory, which contains hundreds of
// thousands of unrelated files. Restricting the watcher prevents Vite's
// chokidar instance from ballooning in memory (it previously OOM'd).
const root = resolve(fileURLToPath(new URL('.', import.meta.url))).replace(/\\/g, '/')
const allowedFiles = new Set([
  'index.html',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'postcss.config.js',
  'README.md',
  '.gitignore',
])

// Vite config — static-site friendly. For GitHub Pages project sites set
// `base` to '/<repo-name>/' (see README). Vercel works with the default '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    watch: {
      ignored: (path: string) => {
        const normalized = path.replace(/\\/g, '/')
        // Paths outside the project (parents, /tmp, ...) must stay visible to
        // chokidar, and so must the project root itself — otherwise chokidar
        // treats the root as ignored and never descends into src/.
        if (!normalized.startsWith(root)) return false
        const rel = normalized.slice(root.length).replace(/^\/+/, '')
        if (!rel) return false
        if (rel === 'src' || rel.startsWith('src/')) return false
        if (rel === 'public' || rel.startsWith('public/')) return false
        if (rel === 'node_modules' || rel.startsWith('node_modules/')) return true
        return !allowedFiles.has(rel)
      },
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
