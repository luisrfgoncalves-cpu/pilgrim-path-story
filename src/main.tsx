import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startSession } from "./lib/analytics";
import { scheduleReminder } from "./lib/notifications";

startSession();
scheduleReminder();

// Guard: never keep service worker active on Lovable preview hosts
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost) {
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

createRoot(document.getElementById("root")!).render(<App />);
