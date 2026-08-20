import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "favicon.svg", "favicon-180.png"],
      manifest: {
        name: "모여락 | 모임 일정·장소 조율",
        short_name: "모여락",
        description: "모임 일정과 장소를 쉽고 빠르게 정하는 모여락",
        lang: "ko",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#fefefe",
        theme_color: "#4181ff",
        icons: [
          {
            src: "/favicon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // 설치 조건을 채우는 앱 셸만 precache 한다. 폰트(3MB)와 OG 공유 이미지는
        // 첫 방문 트래픽만 키우고 앱 구동에 필수는 아니라 HTTP 캐시에 맡긴다.
        globPatterns: ["**/*.{css,html,js}"],
        globIgnores: ["**/node_modules/**/*", "static/images/**", "vite.svg"],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: [
        "**/.direnv/**",
        "**/.git/**",
        "**/.storybook/**",
        "**/dist/**",
        "**/node_modules/**",
      ],
    },
  },
});
