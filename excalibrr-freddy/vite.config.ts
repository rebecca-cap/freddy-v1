import react from '@vitejs/plugin-react'
import path from 'node:path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'react/jsx-runtime': 'react/jsx-runtime.js',
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/Utils'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), dts()],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'index',
      formats: ['es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'index.css' : assetInfo.name!,
      },
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        'ag-grid-react',
        'ag-grid-enterprise',
        '@nivo/core',
        '@nivo/line',
        '@nivo/bar',
        'moment',
        'query-string',
        'google-map-react',
        'react-ga',
        'axios',
        'classnames',
        'react-lottie',
        '@gravitate-js/the-armory',
      ],
    },
  },
})
