import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { checker } from 'vite-plugin-checker'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'
  const isAnalyze = mode === 'analyze'

  // const buildVersion = env.VITE_APP_BUILD_VERSION

  return {
    server: {
      ...(env.VITE_PORT && { port: Number(env.VITE_PORT) }),
      sourcemapIgnoreList: false,
    },
    plugins: [
      react(),
      // Custom plugin to load markdown files
      {
        name: 'markdown-loader',
        transform(code, id) {
          if (id.slice(-3) === '.md') {
            // For .md files, get the raw content
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

      // Enable rollup polyfills plugin
      // used during production bundling
      nodePolyfills({
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
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
      // Enable esbuild polyfill plugins
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
            // Handle specific web3 libraries as separate chunks
            if (id.includes('@web3modal/siwe')) {
              return 'web3modal-siwe'
            }
            if (id.includes('@walletconnect/modal')) {
              return 'walletconnect-modal'
            }
            if (id.includes('@metamask/sdk')) {
              return 'metamask-sdk'
            }
            if (id.includes('@coinbase/wallet-sdk')) {
              return 'coinbase-wallet-sdk'
            }
          },
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
          // Enable rollup polyfills plugin
          // used during production bundling
          nodePolyfills({
            globals: {
              Buffer: true, // can also be 'build', 'dev', or false
              global: true,
              process: true,
            },
          }),
        ],
      },
    },
  }
})
