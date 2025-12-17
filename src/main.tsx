import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// IMPORTANT: Do NOT hide skeleton here - let components signal when ready
// This prevents black screen if JS fails to load/execute

// Defer non-critical initialization to after first paint
requestIdleCallback?.(() => {
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
  import("./lib/serviceWorker").then(({ registerServiceWorker }) => registerServiceWorker());
}) ?? setTimeout(() => {
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
  import("./lib/serviceWorker").then(({ registerServiceWorker }) => registerServiceWorker());
}, 0);

createRoot(document.getElementById("root")!).render(<App />);
