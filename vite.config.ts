import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "https://store-production-3fb2.up.railway.app",
        changeOrigin: true,
      },
      "/assets": {
        target: "https://store-production-3fb2.up.railway.app",
        changeOrigin: true,
      },
    },
  },
});
