import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: 'G-98S0G8DHZ7',
      },
    }),
    VueDevTools(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
    VitePWA({
      // 自動更新 PWA 程式
      // "prompt" 會在瀏覽器中顯示要不要更新的提示
      // "autoUpdate" 會自動更新 PWA 程式
      registerType: 'autoUpdate',
      //
      workbox: {
        // 這個設定會在 PWA 程式更新時自動清除舊的快取
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*'],
        // ignoreURLParametersMatching 忽略 URL 後綴的參數，視為同一個檔案
        // a.jpg = a.jpg?utm_source=google&utm_medium=cpc
        // a.jpg = a.jpg?fbclid=1234567890
        ignoreURLParametersMatching: [/.*/, /^utm_/, /^fbclid$/],
      },
      devOptions: {
        // 在開發模式下啟用 PWA 支援
        enabled: true,
        type: 'module',
      },
      // 網站設定
      manifest: {
        name: 'MyWebSite',
        short_name: 'MySite',
        icons: [
          {
            src: '/web-app-manifest-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: '#e8c251',
        background_color: '#e8c251',
        display: 'standalone',
        // 開始網址
        start_url: './',
        // PWA 程式的作用域
        scope: './',
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
