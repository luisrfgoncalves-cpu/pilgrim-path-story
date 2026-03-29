import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startSession } from "./lib/analytics";

// Start analytics session
startSession();

createRoot(document.getElementById("root")!).render(<App />);
