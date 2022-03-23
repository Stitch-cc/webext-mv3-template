import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// vue 自动化插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// UI 框架插件
import WindiCSS from 'vite-plugin-windicss'

import manifest from './src/manifest.json'
import { crx } from 'rollup-plugin-chrome-extension'

// BUG 插件打包异常
const isProd = process.env.NODE_ENV === 'production'
if (isProd) {
  manifest.action.default_popup = '/' + manifest.action.default_popup;
}

// 处理 manifest.json
import config from './src/config'
Object.assign(manifest, config);


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        // dashboard: 'dashboard/index.html',
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      }
    }
  },
  plugins: [
    vue(),
    crx({ manifest }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core'
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
        IconsResolver({
          prefix: false,
        })
      ]
    }),
    Icons(),
    WindiCSS()
  ]
})