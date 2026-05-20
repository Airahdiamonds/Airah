import { defineConfig, transformWithEsbuild } from 'vite'
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
        return transformWithEsbuild(code, id, { loader: 'jsx' })
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
})
