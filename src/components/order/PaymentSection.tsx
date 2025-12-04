import { YocoPayment } from "./YocoPayment";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  total: number; // in EUR
  onPaymentComplete: (paymentId: string) => void;
  isProcessing: boolean;
}

const EUR_TO_ZAR = 20; // adjust to current exchange rate

export const PaymentSection = ({ total, onPaymentComplete, isProcessing }: PaymentSectionProps) => {
  const amountZAR = total * EUR_TO_ZAR;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h3 className="font-heading font-bold text-foreground mb-4">Payment Details</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Total: <strong>R{total.toFixed(2)}</strong> (~R{amountZAR.toFixed(0)})
      </p>

      {isProcessing ? (
        <Button
          disabled
          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold opacity-70 cursor-not-allowed"
        >
          Processing Payment...
        </Button>
      ) : (
        <YocoPayment
          amountZAR={amountZAR}
          onSuccess={(paymentId) => onPaymentComplete(paymentId)}
          onError={(err) => alert("Payment failed: " + err.message)}
        />
      )}

      <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
        Secure payment powered by Yoco
      </p>
    </div>
  );
};
