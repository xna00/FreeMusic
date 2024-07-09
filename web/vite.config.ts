import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svgDts } from "./svg";
import svgr from "vite-plugin-svgr";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
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
    port: 9999,
    proxy: {
      "/api": {
        target: "https://localhost:8888",
        secure: false,
      },
    },
  },
});
