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
        // CONSERVATIVE, LEAF-ONLY vendor splitting.
        //
        // Background: an earlier version of this file aggressively split
        // pages/* AND vendor libs (react, react-query, recharts, radix,
        // motion, …). Rollup created back-edges — vendor-react ended up
        // importing from dashboard-links in one build, and from vendor-
        // charts in another. That produced the classic
        //   "Cannot read properties of undefined (reading 'createContext')"
        // on every page load.
        //
        // Rules we now enforce, in order of importance:
        //   1. NEVER split application source into a manual chunk. React.lazy
        //      at route boundaries handles that automatically.
        //   2. NEVER split a library that imports from React (recharts,
        //      radix, react-query, motion, nivo, xyflow, html5-qrcode).
        //      Rollup will hoist shared React helpers into the vendor chunk,
        //      and vendor-react imports them back → cycle.
        //   3. ONLY split pure-JS leaf libraries that do NOT import React
        //      and are imported ONLY from lazy() route chunks.
        //
        // Current safe-to-split leaves:
        //   * xlsx (pure JS, ~284 kB raw, only used for export features)
        //   * qrcode (pure JS, only used in QR/BrickMatrix pages)
        //
        // Verified with `head -c 400 dist/assets/<chunk>.js` that neither
        // of these chunks ends up back-imported by vendor code.
        manualChunks(id) {
          // Only touch node_modules; app source gets default treatment.
          if (!id.includes('node_modules')) return undefined;

          // Pure-JS leaves. Do NOT add react-using libraries here without
          // verifying the chunk graph has no back-edges from other vendors.
          if (id.includes('/xlsx/')) return 'vendor-xlsx';
          if (id.includes('/qrcode/') && !id.includes('html5-qrcode')) return 'vendor-qrcode';

          return undefined;
        },
      },
    },
    // Warn at 1.5MB instead of 1MB — the main bundle is close to 1MB even
    // after splitting and that's acceptable for a full product dashboard.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  }
}));
