import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

function injectCssPlugin(): Plugin {
  return {
    name: 'dyvo-inject-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssAssets = Object.entries(bundle).filter(([, chunk]) => chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
      const css = cssAssets.map(([, chunk]) => chunk.type === 'asset' ? String(chunk.source) : '').join('\n')

      if (!css) {
        return
      }

      const injection = [
        'const DYVO_VUE_UI_STYLE_ID = "dyvo-vue-ui-style";',
        `const DYVO_VUE_UI_CSS = ${JSON.stringify(css)};`,
        'if (typeof document !== "undefined" && !document.getElementById(DYVO_VUE_UI_STYLE_ID)) {',
        '  const style = document.createElement("style");',
        '  style.id = DYVO_VUE_UI_STYLE_ID;',
        '  style.textContent = DYVO_VUE_UI_CSS;',
        '  document.head.appendChild(style);',
        '}',
        ''
      ].join('\n')

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && (chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.cjs'))) {
          chunk.code = `${injection}${chunk.code}`
        }
      }

      for (const [fileName] of cssAssets) {
        delete bundle[fileName]
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), injectCssPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DyvoVueUi',
      fileName: 'dyvo-vue-ui'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
