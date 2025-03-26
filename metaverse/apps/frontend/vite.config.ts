import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const API_BASE_URL = process.env.VITE_API_BASE_URL!;

export default defineConfig({
  // Point to the directory that contains your .env file
  envDir: path.resolve(__dirname, "../../packages/ui"),
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 443 },
    cors: true,
    proxy: {
      "/api": {
        target: `${API_BASE_URL}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
