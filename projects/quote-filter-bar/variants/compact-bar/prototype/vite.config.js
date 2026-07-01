import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite' // <-- added: loadEnv
import loadVersion from 'vite-plugin-package-version'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const getRootAlias = (name) => path.resolve(__dirname, `src/${name}`)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.VITE_API_URL

  return {
    // node_modules is a symlink to the shared proto-base, so Vite's default
    // cacheDir (node_modules/.vite) is shared across all worktrees and races
    // on the deps_temp -> deps rename (ENOENT). Use a worktree-local cache dir
    // (this file's real, non-symlinked directory) to isolate optimization.
    cacheDir: path.resolve(__dirname, '.vite-cache'),
    optimizeDeps: {
      include: ['@gravitate-js/excalibrr'],
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      // sourcemap: true,
      minify: false,
      commonjsOptions: {
        include: [/@gravitate-js\/excalibrr/, /node_modules/],
      },
    },
    resolve: {
      alias: [
        { find: '@assets', replacement: getRootAlias('assets') },
        { find: '@hooks', replacement: getRootAlias('hooks') },
        { find: '@components', replacement: getRootAlias('components') },
        { find: '@pages', replacement: getRootAlias('pages') },
        { find: '@constants', replacement: getRootAlias('constants') },
        { find: '@contexts', replacement: getRootAlias('contexts') },
        { find: '@utils', replacement: getRootAlias('utils') },
        { find: '@api', replacement: getRootAlias('api') },
        { find: '@tests', replacement: getRootAlias('tests') },
        { find: '@modules', replacement: getRootAlias('modules') },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      port: parseInt(process.env.VITE_PORT ?? '5173', 10),
      strictPort: true,
      host: true,
    },
    test: {
      setupFiles: ['./vitest.setup.js', 'jest-canvas-mock'],
      environment: 'jsdom',
      globals: true,
    },
    plugins: [
      react(),
      loadVersion(),
      tsconfigPaths(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
      {
        name: 'print-vite-api-url',
        configureServer() {
          console.log(`\n[dev] Pointed to VITE_API_URL = ${API_URL}\n`)
        },
        handleHotUpdate() {
          console.log(`[HMR] Pointed to VITE_API_URL = ${API_URL}`)
        },
      },
    ],
  }
})
