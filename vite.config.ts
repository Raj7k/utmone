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
        manualChunks: (id) => {
          // PHASE 20: Split marketing vs dashboard bundles
          
          // Core vendor chunks (shared)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/@remix-run/')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          
          // Heavy visualization (lazy loaded)
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-simple-maps/') || id.includes('node_modules/d3-geo/')) {
            return 'vendor-maps';
          }
          if (id.includes('node_modules/@xyflow/') || id.includes('node_modules/reactflow/')) {
            return 'vendor-flow';
          }
          if (id.includes('node_modules/@nivo/')) {
            return 'vendor-nivo';
          }
          
          // Heavy utilities (lazy loaded)
          if (id.includes('node_modules/xlsx/')) {
            return 'vendor-xlsx';
          }
          if (id.includes('node_modules/qrcode/') || id.includes('node_modules/react-qr-code/') || id.includes('node_modules/html5-qrcode/')) {
            return 'vendor-qr';
          }
          if (id.includes('node_modules/canvas-confetti/') || id.includes('node_modules/react-confetti/')) {
            return 'vendor-confetti';
          }
          
          // UI primitives
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          
          // PHASE 20: Route-based splitting
          // Dashboard pages
          if (id.includes('/src/pages/Dashboard') || 
              id.includes('/src/pages/Sales') || 
              id.includes('/src/pages/Intelligence') ||
              id.includes('/src/pages/Events') ||
              id.includes('/src/pages/Analytics') ||
              id.includes('/src/pages/Links') ||
              id.includes('/src/pages/Settings') ||
              id.includes('/src/components/dashboard/')) {
            return 'app-dashboard';
          }
          
          // Marketing pages
          if (id.includes('/src/pages/Index') || 
              id.includes('/src/pages/marketing/') ||
              id.includes('/src/pages/features/') ||
              id.includes('/src/pages/solutions/') ||
              id.includes('/src/pages/resources/') ||
              id.includes('/src/pages/legal/') ||
              id.includes('/src/components/marketing/') ||
              id.includes('/src/components/landing/')) {
            return 'app-marketing';
          }
          
          // Admin pages
          if (id.includes('/src/pages/admin/') || id.includes('/src/components/admin/')) {
            return 'app-admin';
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
}));
