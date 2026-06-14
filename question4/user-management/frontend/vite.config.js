import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, forward any request starting with /api to the
// backend running on port 3001. This keeps the frontend code clean
// (it can just call "/api/user") and avoids CORS issues.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
