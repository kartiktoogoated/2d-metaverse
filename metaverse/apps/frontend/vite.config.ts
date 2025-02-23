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
    host: "0.0.0.0",  // Allow external connections
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443,  // Needed for Cloudflare
    },
    cors: true,
  },
});
