import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },

  plugins: [tsconfigPaths(), react(), tagger()],

  // ✅ FIX for: Uncaught ReferenceError: global is not defined
  define: {
    global: "globalThis",
  },

  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      '/api': { target: 'http://localhost:9000', changeOrigin: true }
    }
  }
});