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
        manualChunks(id) {
          // Core React ecosystem
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          
          // Animation library - isolated to avoid loading on pages that don't use it
          if (id.includes('framer-motion')) return 'vendor-motion';
          
          // Data fetching and state
          if (id.includes('@tanstack/react-query')) return 'vendor-query';
          
          // Backend client
          if (id.includes('@supabase')) return 'vendor-supabase';
          
          // Visualization libraries
          if (id.includes('recharts')) return 'vendor-charts';
          if (id.includes('react-simple-maps') || id.includes('d3-geo')) return 'vendor-maps';
          if (id.includes('@xyflow') || id.includes('reactflow')) return 'vendor-flow';
          if (id.includes('@nivo')) return 'vendor-nivo';
          
          // Heavy utilities
          if (id.includes('xlsx')) return 'vendor-xlsx';
          if (id.includes('qrcode') || id.includes('html5-qrcode')) return 'vendor-qr';
          if (id.includes('canvas-confetti') || id.includes('react-confetti')) return 'vendor-confetti';
          
          // UI primitives
          if (id.includes('@radix-ui')) return 'vendor-radix';
          
          // Resource pages grouped by category
          if (id.includes('pages/resources/guides/')) return 'resources-guides';
          if (id.includes('pages/resources/playbooks/')) return 'resources-playbooks';
          if (id.includes('pages/resources/glossary/')) return 'resources-glossary';
          if (id.includes('pages/resources/templates/')) return 'resources-templates';
          if (id.includes('pages/resources/checklists/')) return 'resources-checklists';
          if (id.includes('pages/resources/frameworks/')) return 'resources-frameworks';
          if (id.includes('pages/resources/examples/')) return 'resources-examples';
          if (id.includes('pages/resources/reports/')) return 'resources-reports';
          if (id.includes('pages/resources/academy/')) return 'resources-academy';
          if (id.includes('pages/help/')) return 'help-articles';
          
          // Feature and solution pages
          if (id.includes('pages/features/')) return 'feature-pages';
          if (id.includes('pages/solutions/')) return 'solution-pages';
          if (id.includes('pages/use-cases/')) return 'usecase-pages';
          
          // Dashboard pages
          if (id.includes('pages/dashboard/')) return 'dashboard-pages';
          
          return undefined;
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
