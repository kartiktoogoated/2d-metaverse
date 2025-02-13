import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [react(),compression()],
  resolve: {
    alias: {
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/dist/index.js"), // ✅ Ensure it points to built `dist/`
    },
  },
});
