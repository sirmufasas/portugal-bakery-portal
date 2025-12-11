import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // Only use proxy in development, NEVER in production
    proxy:
      mode === "development"
        ? {
          "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
            secure: false,
          },
        }
        : undefined,

    historyApiFallback: true,
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
