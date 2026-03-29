import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startSession } from "./lib/analytics";
import { scheduleReminder } from "./lib/notifications";

startSession();
scheduleReminder();

createRoot(document.getElementById("root")!).render(<App />);
