import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate heavy multiplayer code into its own chunk
          'multiplayer': [
            './src/pages/PresentialMultiplayer.tsx',
            './src/pages/MultiplayerPage.tsx',
            './src/components/multiplayer/ImmersiveBoard.tsx',
            './src/components/multiplayer/ContinuousTrail.tsx',
            './src/components/multiplayer/ImmersiveBoardTypes.ts',
            './src/components/multiplayer/MedievalTileIcons.tsx',
            './src/components/multiplayer/BoardMiniGame.tsx',
            './src/components/multiplayer/EpicVictoryScreen.tsx',
            './src/components/multiplayer/PhaseTransition.tsx',
            './src/components/multiplayer/RiverOfDeath.tsx',
            './src/components/multiplayer/TileEventPopup.tsx',
            './src/components/multiplayer/BoardSounds.ts',
            './src/components/multiplayer/BoardStats.tsx',
            './src/components/multiplayer/EventReveal.tsx',
          ],
          // Separate scene/story data
          'story-data': [
            './src/data/story.ts',
            './src/data/storyPart2.ts',
            './src/data/eventPools.ts',
            './src/data/eventPoolsPart2.ts',
            './src/data/sceneVariations.ts',
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
      manifest: {
        id: "/?source=pwa",
        name: "O Peregrino - Jornada Interativa",
        short_name: "O Peregrino",
        description: "Viva a jornada do Peregrino em uma experiência interativa e imersiva baseada na obra clássica de John Bunyan.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        background_color: "#000000",
        theme_color: "#000000",
        orientation: "portrait",
        prefer_related_applications: false,
        icons: [
          {
            src: "/icons/icon-192-v3.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512-v3.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable-192-v3.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-maskable-512-v3.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["games", "entertainment", "education"],
        lang: "pt-BR",
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/~oauth/, /^\/landing/, /^\/vendas/, /^\/obrigado/],
        // Only precache critical files — NOT heavy images
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
        // Runtime cache for images — loaded on demand, not upfront
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
