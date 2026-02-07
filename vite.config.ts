import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
