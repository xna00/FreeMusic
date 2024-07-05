import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svgDts } from "./svg";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
    }),
    svgDts(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
      },
    },
  },
});
