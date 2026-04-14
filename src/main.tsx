import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// IMPORTANT: Do NOT hide skeleton here - let components signal when ready
// This prevents black screen if JS fails to load/execute

// Defer non-critical initialization to after first paint
const scheduleIdle = (cb: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 1);
  }
};

scheduleIdle(() => {
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
  import("./lib/serviceWorker").then(({ registerServiceWorker }) => registerServiceWorker());
});

createRoot(document.getElementById("root")!).render(<App />);
