// YocoPayment.tsx
import React, { useState } from "react";
import { usePopup } from "@lekkercommerce/yoco-react";
import { Button } from "@/components/ui/button";

interface YocoPaymentProps {
  amountZAR: number;
  onSuccess: (paymentData: any) => void;
  onError?: (error: any) => void;
  useQR?: boolean; // if true, use QR code instead of popup
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

  const handleCardPayment = () => {
    if (!isReady) return;

    const config: any = {
      currency: "ZAR",
      amountInCents: Math.round(amountZAR * 100),
      callback: (result: any) => {
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
      // Call your backend endpoint to create a Yoco payment link
      const res = await fetch("/api/create-yoco-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountZAR }),
      });

      const data = await res.json();

      if (data.paymentLink) {
        // Open the payment link in a new tab or show as QR code
        window.open(data.paymentLink, "_blank");
        // Optionally, you can generate a QR code from data.paymentLink using a QR library
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
    <div className="flex flex-col gap-2">
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
