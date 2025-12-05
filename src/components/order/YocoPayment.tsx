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

  // ✅ NUCLEAR OPTION: Most aggressive cleanup possible
  const forceCloseYoco = () => {
    // 1. Remove ALL iframes (don't just check src)
    document.querySelectorAll("iframe").forEach((iframe) => {
      iframe.remove();
    });

    // 2. Remove ALL elements with very high z-index
    document.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex);
      if (zIndex > 99999) {
        el.remove();
      }
    });

    // 3. Remove any element containing "yoco" or "checkout" in any attribute
    document.querySelectorAll("*").forEach((el) => {
      const attributes = Array.from(el.attributes);
      const hasYoco = attributes.some(
        (attr) =>
          attr.value.toLowerCase().includes("yoco") ||
          attr.value.toLowerCase().includes("checkout") ||
          attr.value.toLowerCase().includes("payment")
      );
      if (hasYoco && el.tagName !== "BUTTON") {
        el.remove();
      }
    });

    // 4. Reset ALL body and html styles
    document.body.style.cssText = "";
    document.documentElement.style.cssText = "";
    
    // 5. Remove any position:fixed or position:absolute divs that might be overlays
    document.querySelectorAll("div").forEach((div) => {
      const style = window.getComputedStyle(div);
      if (
        (style.position === "fixed" || style.position === "absolute") &&
        parseInt(style.zIndex) > 1000 &&
        !div.closest("[data-radix-portal]") // Don't remove radix UI elements
      ) {
        div.remove();
      }
    });
  };

  // ✅ Run cleanup on route change
  useEffect(() => {
    forceCloseYoco();
    
    // Start aggressive polling to catch any late-appearing elements
    cleanupInterval.current = setInterval(() => {
      forceCloseYoco();
    }, 100);

    // Stop polling after 2 seconds
    setTimeout(() => {
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
    }, 2000);

    return () => {
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
    };
  }, [location.pathname]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      forceCloseYoco();
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
    };
  }, []);

  const handleCardPayment = () => {
    if (!isReady) return;

    // Clear any existing popups before opening a new one
    forceCloseYoco();

    const config: any = {
      currency: "ZAR",
      amountInCents: Math.round(amountZAR * 100),
      callback: (result: any) => {
        // Immediately close popup after callback
        forceCloseYoco();
        
        if (result.status === "success") {
          onSuccess(result);
        } else {
          if (onError) onError(result);
        }
      },
    };

    showPopup(config);
  };

  const handleQRPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-yoco-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountZAR }),
      });

      const data = await res.json();

      if (data.paymentLink) {
        window.open(data.paymentLink, "_blank");
      } else {
        throw new Error("Payment link not generated");
      }
    } catch (err) {
      console.error("QR payment failed", err);
      if (onError) onError(err);
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