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
  // Force instant activation of new service worker versions
  // This makes updates appear immediately when the user reopens the app
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // New SW took control — reload to show latest version
    window.location.reload();
  });

  // Check for updates every time the app regains focus (user switches back)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update();
      });
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
