// YocoPayment.tsx
import React, { useState, useEffect, useRef } from "react";
import { usePopup } from "@lekkercommerce/yoco-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface YocoPaymentProps {
  amountZAR: number;
  onSuccess: (paymentData: any) => void;
  onError?: (error: any) => void;
  useQR?: boolean;
}

export const YocoPayment = ({
  amountZAR,
  onSuccess,
  onError,
  useQR = false,
}: YocoPaymentProps) => {
  const publicKey = import.meta.env.VITE_YOCO_PUBLIC_KEY!;
  const [showPopup, isReady] = usePopup(publicKey, `order_${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const cleanupInterval = useRef<NodeJS.Timeout | null>(null);

  // 💥 Safe cleanup (no UI destruction)
  const forceCloseYoco = () => {
    // Remove iframes made by Yoco
    document.querySelectorAll("iframe[src*='yoco']").forEach((iframe) => {
      iframe.remove();
    });

    // Remove Yoco overlays
    document.querySelectorAll("div[id*='yoco'], div[class*='yoco']").forEach((el) => {
      el.remove();
    });

    // Reset body scroll lock applied by Yoco
    document.body.style.removeProperty("overflow");
  };

  // 🚀 Cleanup on route change
  useEffect(() => {
    forceCloseYoco();

    cleanupInterval.current = setInterval(() => {
      forceCloseYoco();
    }, 150);

    setTimeout(() => {
      if (cleanupInterval.current) clearInterval(cleanupInterval.current);
    }, 2000);

    return () => {
      if (cleanupInterval.current) clearInterval(cleanupInterval.current);
    };
  }, [location.pathname]);

  // 🚀 Cleanup on unmount
  useEffect(() => {
    return () => {
      forceCloseYoco();
      if (cleanupInterval.current) clearInterval(cleanupInterval.current);
    };
  }, []);

  // 💳 CARD PAYMENT
  const handleCardPayment = () => {
    if (!isReady) return;

    forceCloseYoco();

    const config: any = {
      currency: "ZAR",
      amountInCents: Math.round(amountZAR * 100),
      callback: (result: any) => {
        forceCloseYoco();

        if (result.status === "success") {
          onSuccess(result);
        } else {
          onError?.(result);
        }
      },
    };

    showPopup(config);
  };

  // 📱 QR PAYMENT
  const handleQRPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-yoco-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: Math.round(amountZAR * 100),
        }),
      });

      const data = await res.json();

      if (data.paymentLink) {
        window.open(data.paymentLink, "_blank");
      } else {
        throw new Error("Payment link not generated");
      }
    } catch (err) {
      console.error("QR payment failed", err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {useQR ? (
        <Button onClick={handleQRPayment} disabled={loading}>
          {loading ? "Generating QR..." : `Pay R${amountZAR.toFixed(2)} via QR`}
        </Button>
      ) : (
        <Button onClick={handleCardPayment} disabled={!isReady}>
          Pay R{amountZAR.toFixed(2)} with Card
        </Button>
      )}
    </div>
  );
};
