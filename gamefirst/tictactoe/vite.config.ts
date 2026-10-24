import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // This tells the engine to cache all your built assets automatically
      includeAssets: ['favicon.ico', 'robots.txt'], 
      manifest: {
        name: 'My Game Studio Dashboard',
        short_name: 'GameStudio',
        description: 'Futuristic arcade and indie game development hub.',
        theme_color: '#0f172a',      /* Matches your dark slate look */
        background_color: '#0f172a', /* Color shown while app is loading up */
        display: 'standalone',       /* Crucial: Hides browser UI bars when installed */
        icons: [
          {
            src: 'https://unsplash.com',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'https://unsplash.com',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ]
});