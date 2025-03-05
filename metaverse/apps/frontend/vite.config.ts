import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    host: "0.0.0.0", // Allow external connections
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Needed for Cloudflare
    },
    cors: true,
    proxy: {
      "/api": {
        target: "http://18.215.159.145:3002", // ✅ Forward API calls to backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // ✅ Remove "/api" prefix before forwarding
      },
    },
  },
});
