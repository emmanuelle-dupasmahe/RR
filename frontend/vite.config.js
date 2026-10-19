import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const basePath = (env.VITE_BASE_PATH || "/").replace(/^\/+|\/+$/g, "");
  const base = basePath ? `/${basePath}/` : "/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/apple-touch-icon.png", "images/rr_trans.png"],
        manifest: {
          name: "Reservoir Rock",
          short_name: "Resrock",
          description:
            "Reservoir Rock: concerts, repetitions, videos et actualites du groupe.",
          start_url: base,
          scope: base,
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: `${base}icons/icon-192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: `${base}icons/icon-512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff2,mp3}",
          ],
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        [`${base}api`]: {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
          rewrite: (path) => path.slice(base.length - 1),
        },
        [`${base}uploads`]: {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
          rewrite: (path) => path.slice(base.length - 1),
        },
      },
    },
  };
});
