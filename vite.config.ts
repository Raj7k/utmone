import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Plugin to inject build timestamp into service worker
function injectServiceWorkerVersion(): Plugin {
  return {
    name: 'inject-sw-version',
    closeBundle() {
      const distSwPath = path.resolve(__dirname, 'dist/sw.js');
      
      // Check if sw.js exists in dist (Vite copies public/ to dist/)
      if (fs.existsSync(distSwPath)) {
        let content = fs.readFileSync(distSwPath, 'utf8');
        const buildTimestamp = Date.now().toString();
        content = content.replace(/__BUILD_TIMESTAMP__/g, buildTimestamp);
        fs.writeFileSync(distSwPath, content);
        console.log(`[vite] Injected SW version: ${buildTimestamp}`);
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    injectServiceWorkerVersion()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React ecosystem
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Data fetching and state
          'vendor-query': ['@tanstack/react-query'],
          // Backend client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Visualization libraries
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
          'vendor-maps': ['react-simple-maps', 'd3-geo'],
          'vendor-flow': ['@xyflow/react', 'reactflow'],
          'vendor-nivo': ['@nivo/sankey'],
          // Heavy utilities (lazy loaded)
          'vendor-xlsx': ['xlsx'],
          'vendor-qr': ['qrcode', 'react-qr-code', 'html5-qrcode'],
          // Confetti libraries (lazy loaded)
          'vendor-confetti': ['canvas-confetti', 'react-confetti'],
          // UI primitives
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  }
}));
