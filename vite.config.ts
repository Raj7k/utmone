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
    // No manualChunks. We previously had an elaborate config that split
    // vendor-react / vendor-query / vendor-charts / etc. and also grouped
    // dashboard pages into per-area chunks (dashboard-links, dashboard-
    // analytics, etc). That config produced circular chunks in production:
    // vendor-react ended up importing from dashboard-links, or from
    // vendor-charts, depending on which combo we tried. Result: React's
    // exports weren't ready by the time downstream chunks tried to call
    // React.createContext, and the app crashed on every page load with
    //   Uncaught TypeError: Cannot read properties of undefined
    //     (reading 'createContext')
    // Vite's default chunker is dep-graph-aware and doesn't create these
    // cycles. We keep per-route code-splitting via React.lazy() in App.tsx /
    // PrivateRoutes.tsx, which Vite honors automatically — each lazy()
    // import produces its own chunk. If we need to revisit vendor splitting
    // for bundle-size reasons later, use rollup-plugin-visualizer FIRST to
    // see the graph, and only split leaves (never shared vendor libs like
    // react or recharts).
    chunkSizeWarningLimit: 1500,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  }
}));
