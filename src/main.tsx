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

// ✅ PWA Install Prompt
let deferredPrompt: any;

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("📥 PWA install prompt ready");

  // Optional: show custom install button
  const installBtn = document.createElement("button");
  installBtn.innerText = "Install App";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "20px";
  installBtn.style.right = "20px";
  installBtn.style.padding = "12px 20px";
  installBtn.style.background = "#d97706";
  installBtn.style.color = "#fff";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "8px";
  installBtn.style.cursor = "pointer";
  document.body.appendChild(installBtn);

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    console.log("User choice:", choiceResult.outcome);
    deferredPrompt = null;
    installBtn.remove();
  });
});

// Render React app
createRoot(document.getElementById("root")!).render(<Root />);
