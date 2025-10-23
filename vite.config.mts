import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'
  const isAnalyze = mode === 'analyze'

  return {
    // ✅ REQUIRED FOR GITHUB PAGES DEPLOYMENT
    // change this if you rename your repo later
    base: '/react-tw-template/',

    server: {
      sourcemapIgnoreList: false,
    },

    plugins: [
      react(),

      // Markdown loader (keeps .md imports working)
      {
        name: 'markdown-loader',
        transform(code, id) {
          if (id.slice(-3) === '.md') {
            return `export default ${JSON.stringify(code)};`
          }
        },
      },

      tsconfigPaths(),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: '[name]',
      }),

      ...(isDevelopment
        ? [
            checker({
              overlay: {
                initialIsOpen: false,
              },
              typescript: true,
              eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint "{src,config}/**/*.{js,ts,jsx,tsx}"',
              },
            }),
          ]
        : []),

      ...(isAnalyze
        ? [
            visualizer({
              open: true,
            }),
          ]
        : []),

      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['react', 'lodash'],
    },

    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },

    build: {
      target: 'esnext',
      sourcemap: true,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
            if (id.includes('@web3modal/siwe')) return 'web3modal-siwe'
            if (id.includes('@walletconnect/modal')) return 'walletconnect-modal'
            if (id.includes('@metamask/sdk')) return 'metamask-sdk'
            if (id.includes('@coinbase/wallet-sdk')) return 'coinbase-wallet-sdk'
          },
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
          nodePolyfills({
            globals: {
              Buffer: true,
              global: true,
              process: true,
            },
          }),
        ],
      },
    },
  }
})
