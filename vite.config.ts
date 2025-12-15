import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
