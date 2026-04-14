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
  plugins: [
    react(),
    mode === "development" && componentTagger(),
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

          // Admin-only pages — almost nobody loads these; keep separate so the
          // ~316KB of admin code never bloats regular dashboard users' initial payload.
          if (id.includes('pages/admin/')) return 'admin-pages';

          // Dashboard pages — split by area so users only download what they need.
          // Previously this was ONE 1.8MB chunk; now it's per-area chunks that
          // load on demand and can be prefetched via routePreloader on hover.
          if (id.includes('pages/dashboard/DashboardHome')) return 'dashboard-home';
          if (id.includes('pages/dashboard/Links') ||
              id.includes('pages/dashboard/LinkPages') ||
              id.includes('pages/dashboard/LinkPageBuilder') ||
              id.includes('pages/dashboard/LinkPageCreate') ||
              id.includes('pages/dashboard/LinkHealth') ||
              id.includes('pages/dashboard/BulkCreate') ||
              id.includes('pages/dashboard/OneLinkValidator') ||
              id.includes('pages/dashboard/URLShortenerPro') ||
              id.includes('pages/dashboard/AIURLShortener')) return 'dashboard-links';
          if (id.includes('pages/dashboard/Analytics') ||
              id.includes('pages/dashboard/AnalyticsPerformance') ||
              id.includes('pages/dashboard/Intelligence') ||
              id.includes('pages/dashboard/Attribution') ||
              id.includes('pages/dashboard/CacheMonitoring')) return 'dashboard-analytics';
          if (id.includes('pages/dashboard/Campaigns') ||
              id.includes('pages/dashboard/CampaignDetails')) return 'dashboard-campaigns';
          if (id.includes('pages/dashboard/Events') ||
              id.includes('pages/dashboard/Experiments') ||
              id.includes('pages/dashboard/Targeting') ||
              id.includes('pages/dashboard/Sales') ||
              id.includes('pages/dashboard/BrickMatrix')) return 'dashboard-growth';
          if (id.includes('pages/dashboard/QRCodes')) return 'dashboard-qr';
          // Catchall for any remaining dashboard pages (new files added later)
          if (id.includes('pages/dashboard/')) return 'dashboard-misc';

          // Settings pages — loaded only from /settings/*, keep separate
          if (id.includes('pages/Settings')) return 'settings-pages';

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
