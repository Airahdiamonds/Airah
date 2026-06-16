import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    {
      name: 'react-refresh-preamble',
      apply: 'serve',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module' },
            children: `import RefreshRuntime from "/@react-refresh";
                        RefreshRuntime.injectIntoGlobalHook(window);
                        window.$RefreshReg$ = () => {};
                        window.$RefreshSig$ = () => (type) => type;
                        window.__vite_plugin_react_preamble_installed__ = true;`,
          },
        ]
      },
    },
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithOxc(code, id, { loader: 'jsx' })
      },
    },
    {
      // In tests, static image/SVG imports return the filename string instead
      // of trying to resolve a URL (there's no browser in the test environment).
      name: 'mock-static-assets-in-tests',
      transform(_code, id) {
        if (process.env.VITEST && /\.(png|jpe?g|gif|svg|webp)$/.test(id)) {
          const filename = id.split('/').pop()
          return `export default '${filename}'`
        }
      },
    },
    react(),
  ],
  server: {
    port: 3006,
  },
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
