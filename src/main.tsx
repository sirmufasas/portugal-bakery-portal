import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";

const Root = () => {
  const [appKey, setAppKey] = useState(0);

  // Expose global reset function
  (window as any).resetApp = () => setAppKey(prev => prev + 1);

  return (
    <AuthProvider>
      <App key={appKey} />
    </AuthProvider>
  );
};

// ✅ Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("✅ Service Worker registered:", registration);
      })
      .catch(err => {
        console.error("❌ Service Worker registration failed:", err);
      });
  });
}

// NOTE: Floating button removed
// PWA install prompt will now be handled via a React modal component

// Render React app
createRoot(document.getElementById("root")!).render(<Root />);
