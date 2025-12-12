import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/webVitals";
import { registerServiceWorker } from "./lib/serviceWorker";

// Initialize Core Web Vitals tracking
initWebVitals();

// Register Service Worker for PWA support (production only)
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
