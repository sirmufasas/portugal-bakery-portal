import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

export interface InitializeCheckoutPayload {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerLat?: number | null;
  customerLng?: number | null;
  shippingAddress: string;
  specialInstructions: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryFee: number;
  deliveryZone: string;
  deliveryProvider: string | null;
  deliveryService: string | null;
  deliveryQuoteId: string | null;
  pickupLocation: {
    id: string;
    name: string;
    address: string;
    lat?: number;
    lng?: number;
  } | null;
}

interface YocoGatewayConfig {
  configured: boolean;
  gateway: "yoco";
  name: string;
  mode: "live" | "test";
  publicKey?: string | null;
  methods?: string[];
}

interface YocoCheckoutCardProps {
  total: number;
  subtotal: number;
  deliveryFee: number;
  deliveryMethod: "delivery" | "pickup";
  token: string | null;
  checkoutPayload: InitializeCheckoutPayload;
  onBeforeRedirect?: () => void;
  onPaymentError: (message: string) => void;
}

export function YocoCheckoutCard({
  total,
  subtotal,
  deliveryFee,
  deliveryMethod,
  token,
  checkoutPayload,
  onBeforeRedirect,
  onPaymentError,
}: YocoCheckoutCardProps) {
  const [config, setConfig] = useState<YocoGatewayConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingConfig(true);
        const res = await fetch(`${API_URL}/api/payments/config`);
        if (!res.ok) throw new Error("Unable to reach Yoco payment service.");
        const data: YocoGatewayConfig = await res.json();
        if (active) setConfig(data);
      } catch {
        if (active) {
          setConfig({
            configured: false,
            gateway: "yoco",
            name: "Yoco Secure Online Checkout",
            mode: "live",
          });
        }
      } finally {
        if (active) setLoadingConfig(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleProceedToYoco = async () => {
    setLocalError(null);

    if (!token) {
      const msg = "Please sign in to complete your payment.";
      setLocalError(msg);
      onPaymentError(msg);
      return;
    }

    if (!config?.configured) {
      const msg =
        "Yoco online gateway is awaiting YOCO_SECRET_KEY in Render environment variables.";
      setLocalError(msg);
      onPaymentError(msg);
      return;
    }

    try {
      setRedirecting(true);
      onBeforeRedirect?.();

      const res = await fetch(`${API_URL}/api/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...checkoutPayload,
          returnOrigin: window.location.origin,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.redirectUrl) {
        throw new Error(
          data?.error || "Could not start Yoco secure checkout session."
        );
      }

      sessionStorage.setItem("pb_pending_payment_ref", data.reference);
      window.location.href = data.redirectUrl;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to connect to Yoco payment gateway.";
      setLocalError(msg);
      onPaymentError(msg);
      setRedirecting(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border flex items-center justify-center gap-3 py-10">
        <Loader2 className="h-5 w-5 animate-spin text-[#00A9E0]" />
        <span className="text-sm font-medium text-muted-foreground">
          Connecting to Yoco Secure Checkout...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-primary/20 space-y-5">
      {/* Yoco Branded Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A9E0]/10 border border-[#00A9E0]/25 text-[#0077A3] text-xs font-bold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5 text-[#00A9E0]" />
            YOCO SECURE ONLINE CHECKOUT
          </div>
          <h3 className="font-heading font-bold text-xl text-foreground pt-1">
            Pay Securely with Yoco
          </h3>
          <p className="text-sm text-muted-foreground">
            PCI-DSS Level 1 encrypted ZAR checkout — verified automatically on
            completion.
          </p>
        </div>

        <div className="text-right bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5">
          <span className="text-xs text-muted-foreground block">
            Total Payable
          </span>
          <span className="text-2xl font-heading font-bold text-primary">
            R{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order Summary Breakdown */}
      <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Bakery Items Subtotal</span>
          <span>R{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            {deliveryMethod === "delivery" ? "Courier Delivery" : "Store Pickup"}
          </span>
          <span>
            {deliveryMethod === "delivery"
              ? `R${deliveryFee.toFixed(2)}`
              : "FREE"}
          </span>
        </div>
        <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
          <span>Total Charged (ZAR)</span>
          <span className="text-primary">R{total.toFixed(2)}</span>
        </div>
      </div>

      {config?.configured ? (
        <>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Accepted Payment Methods on Yoco
              </span>
              {config.mode === "test" && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Yoco Sandbox Key Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                <CreditCard className="h-4 w-4 text-[#00A9E0] shrink-0" />
                <span>All SA Bank Cards</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                <Building2 className="h-4 w-4 text-[#00A9E0] shrink-0" />
                <span>Instant EFT</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                <Smartphone className="h-4 w-4 text-[#00A9E0] shrink-0" />
                <span>Apple / Google Pay</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                <QrCode className="h-4 w-4 text-[#00A9E0] shrink-0" />
                <span>Scan to Pay QR</span>
              </div>
            </div>
          </div>

          {localError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            onClick={handleProceedToYoco}
            disabled={redirecting}
            className="w-full h-12 text-base font-semibold bg-[#00A9E0] hover:bg-[#008CBA] text-white shadow-md"
          >
            {redirecting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Opening Yoco Secure Checkout...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay R{total.toFixed(2)} with Yoco
                <ExternalLink className="h-4 w-4 ml-2 opacity-85" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            3D Secure 2.0 &amp; 256-bit TLS encrypted · Card details never touch
            our servers.
          </p>
        </>
      ) : (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-amber-950">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Yoco Live API Key Required on Server</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">
            Online checkout is wired directly to <strong>Yoco</strong> (zero
            dummy/mock payments). Link your <strong>Capitec bank account</strong>{" "}
            for payouts in your Yoco Business Portal, then add{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-[11px]">
              YOCO_SECRET_KEY=sk_live_...
            </code>{" "}
            in your Render backend environment variables to accept live online
            payments immediately.
          </p>
        </div>
      )}
    </div>
  );
}
