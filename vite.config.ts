import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

// mode "singlefile" = 1ファイルのプレビュー用ビルド（PWAなし）
export default defineConfig(({ mode }) => ({
  // GitHub Pages（/slot-pro/ 配下）でも動くよう相対パスで出力
  base: './',
  plugins: [
    react(),
    mode === 'singlefile'
      ? viteSingleFile()
      : VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icons/icon.svg'],
          manifest: {
            name: 'SLOT PRO',
            short_name: 'SLOT PRO',
            description: '狙い目・天井・有利区間を3秒で確認',
            lang: 'ja',
            theme_color: '#0c0d11',
            background_color: '#0c0d11',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '.',
            icons: [
              { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
              { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
          },
          workbox: {
            // 機種データはJSに同梱されるのでオフラインで表示可能
            globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
                handler: 'StaleWhileRevalidate',
                options: { cacheName: 'google-fonts' },
              },
            ],
          },
        }),
  ],
  build: {
    outDir: mode === 'singlefile' ? 'dist-preview' : 'dist',
    // プレビュー用は1ファイルにするのでフォントも埋め込む
    assetsInlineLimit: mode === 'singlefile' ? 100_000_000 : 4096,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
  },
}));
