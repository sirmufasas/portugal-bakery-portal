import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowModal(true);
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
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-cream dark:bg-espresso p-6 rounded-2xl shadow-glow max-w-sm w-full text-center">
        <h2 className="text-2xl font-heading mb-4 text-amber">Install Portugal Bakery</h2>
        <p className="mb-6 text-foreground dark:text-foreground">
          Add our bakery app to your home screen for the full experience!
        </p>
        <button
          className="px-6 py-3 bg-amber text-espresso font-bold rounded-xl hover:bg-amber-light transition"
          onClick={handleInstall}
        >
          Install
        </button>
        <button
          className="mt-3 text-sm text-muted hover:text-foreground transition"
          onClick={() => setShowModal(false)}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
