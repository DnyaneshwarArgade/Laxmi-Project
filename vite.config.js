import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Laxmi Project',
        short_name: 'Laxmi',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
          icons: [
            {
              src: 'Logo.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'Logo.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
      }
    })
  ]
});