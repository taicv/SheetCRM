import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import { VitePWA } from 'vite-plugin-pwa'  // uncomment after: pnpm add -D vite-plugin-pwa

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // VitePWA({                          // uncomment after installing vite-plugin-pwa
        //   registerType: 'autoUpdate',
        //   manifest: false,                 // we use our own public/manifest.json
        //   workbox: {
        //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        //     runtimeCaching: [
        //       {
        //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        //         handler: 'CacheFirst',
        //         options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } },
        //       },
        //     ],
        //   },
        // }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
    },
})
