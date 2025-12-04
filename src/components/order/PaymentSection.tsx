import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentSectionProps {
  total: number;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
  isProcessing: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export const PaymentSection = ({ total, onPaymentComplete, isProcessing }: PaymentSectionProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    
    if (cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Invalid card number";
    }
    
    if (expiryDate.length < 5) {
      newErrors.expiryDate = "Invalid expiry date";
    }
    
    if (cvv.length < 3) {
      newErrors.cvv = "Invalid CVV";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPaymentComplete({
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiryDate,
        cvv,
        cardholderName,
      });
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">Payment Details</h3>
          <p className="text-sm text-muted-foreground">Secure payment processing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className={errors.cardholderName ? "border-destructive" : ""}
          />
          {errors.cardholderName && (
            <p className="text-sm text-destructive mt-1">{errors.cardholderName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            className={errors.cardNumber ? "border-destructive" : ""}
          />
          {errors.cardNumber && (
            <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
              className={errors.expiryDate ? "border-destructive" : ""}
            />
            {errors.expiryDate && (
              <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={4}
              type="password"
              className={errors.cvv ? "border-destructive" : ""}
            />
            {errors.cvv && (
              <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total to Pay</span>
            <span className="text-primary">€{total.toFixed(2)}</span>
          </div>
          
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Pay €{total.toFixed(2)}
              </span>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Your payment information is secure and encrypted
        </p>
      </form>
    </div>
  );
};
