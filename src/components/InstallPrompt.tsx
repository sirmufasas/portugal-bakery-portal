import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user previously dismissed and if 10 minutes have passed
      const lastDismissed = localStorage.getItem("pwa-prompt-dismissed");
      const now = Date.now();
      
      if (lastDismissed) {
        const timeSinceDismissed = now - parseInt(lastDismissed);
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (timeSinceDismissed >= fiveMinutes) {
          // 5 minutes have passed, show the modal again
          setShowModal(true);
          localStorage.removeItem("pwa-prompt-dismissed");
        }
      } else {
        // First time, show the modal
        setShowModal(true);
      }
      
      console.log("📥 PWA install prompt ready");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("User choice:", choice.outcome);
    setShowModal(false);
    setDeferredPrompt(null);
    // Clear the dismissed timestamp since they installed
    localStorage.removeItem("pwa-prompt-dismissed");
  };

  const handleMaybeLater = () => {
    setShowModal(false);
    // Store the current timestamp when user dismisses
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-amber-200 dark:border-amber-800">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 text-amber-900 dark:text-amber-100 text-center">
          Install Portugal Bakery
        </h2>

        {/* Description */}
        <p className="mb-8 text-amber-800 dark:text-amber-200 text-center leading-relaxed">
          Add our bakery app to your home screen for quick access and the full experience!
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleInstall}
          >
            Install Now
          </button>
          <button
            className="w-full px-6 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all duration-200 font-medium rounded-xl border border-amber-300 dark:border-amber-700"
            onClick={handleMaybeLater}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;