import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide instant skeleton immediately when React starts hydrating
// This is faster than waiting for useEffect in components
if (typeof window !== 'undefined' && (window as any).__hideInstantSkeleton) {
  (window as any).__hideInstantSkeleton();
}

// Defer non-critical initialization to after first paint
requestIdleCallback?.(() => {
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
  import("./lib/serviceWorker").then(({ registerServiceWorker }) => registerServiceWorker());
}) ?? setTimeout(() => {
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
  import("./lib/serviceWorker").then(({ registerServiceWorker }) => registerServiceWorker());
}, 0);

createRoot(document.getElementById("root")!).render(<App />);
