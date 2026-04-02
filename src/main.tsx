import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startSession } from "./lib/analytics";
import { scheduleReminder } from "./lib/notifications";

startSession();
scheduleReminder();

// Guard: never keep service worker active on Lovable preview hosts
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
} else if ("serviceWorker" in navigator) {
  // On first load after update: purge ALL old caches to prevent brown screen
  const CACHE_VERSION = 'v2026-04-02';
  caches.keys().then((keys) => {
    const versionKey = `peregrino-cache-version`;
    const storedVersion = localStorage.getItem(versionKey);
    if (storedVersion !== CACHE_VERSION) {
      // New version detected — nuke all caches
      Promise.all(keys.map((k) => caches.delete(k))).then(() => {
        localStorage.setItem(versionKey, CACHE_VERSION);
        // Also force SW update
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update();
        });
      });
    }
  });

  // Force instant activation of new service worker versions
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });

  // Check for updates every time the app regains focus
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update();
      });
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
