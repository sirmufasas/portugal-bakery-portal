import { Bike } from "lucide-react";
import { cn } from "@/lib/utils";

import ownDeliveryLogo from "@/assets/couriers/own_delivery.png";
import uberLogo from "@/assets/couriers/uber.png";
import boltLogo from "@/assets/couriers/bolt.png";
import indriveLogo from "@/assets/couriers/indrive.png";
import yassirLogo from "@/assets/couriers/yassir.png";
import mrDLogo from "@/assets/couriers/mr_d.png";
import droppaLogo from "@/assets/couriers/droppa.png";
import courierGuyLogo from "@/assets/couriers/courier_guy.png";
import ramLogo from "@/assets/couriers/ram.png";
import fastwayLogo from "@/assets/couriers/fastway.png";
import aramexLogo from "@/assets/couriers/aramex.png";
import pudoLogo from "@/assets/couriers/pudo.png";
import pargoLogo from "@/assets/couriers/pargo.png";

const PROVIDER_LOGO_MAP: Record<string, string> = {
  own_delivery: ownDeliveryLogo,
  uber_direct: uberLogo,
  bolt: boltLogo,
  indrive: indriveLogo,
  yassir: yassirLogo,
  mr_d: mrDLogo,
  droppa: droppaLogo,
  courier_guy: courierGuyLogo,
  ram: ramLogo,
  fastway: fastwayLogo,
  aramex: aramexLogo,
  pudo: pudoLogo,
  pargo: pargoLogo,
};

export function getProviderLogoSrc(providerId?: string | null): string | null {
  if (!providerId) return ownDeliveryLogo;
  return PROVIDER_LOGO_MAP[providerId] || null;
}

export function getBakeryLogoSrc(): string {
  return ownDeliveryLogo;
}

const SIZE_CLASSES = {
  xs: "h-5 w-5 rounded-md",
  sm: "h-8 w-8 rounded-lg",
  md: "h-11 w-11 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
  xl: "h-16 w-16 rounded-2xl",
} as const;

export interface DeliveryProviderLogoProps {
  providerId?: string | null;
  alt?: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function DeliveryProviderLogo({
  providerId,
  alt,
  size = "md",
  className,
}: DeliveryProviderLogoProps) {
  const src = getProviderLogoSrc(providerId);

  if (!src) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0 bg-stone-800 text-white ring-1 ring-black/10 dark:ring-white/15 shadow-sm",
          SIZE_CLASSES[size],
          className
        )}
        title={alt || "Local Courier"}
      >
        <Bike className={size === "xs" ? "h-3 w-3" : size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 overflow-hidden bg-white ring-1 ring-black/10 dark:ring-white/15 shadow-sm",
        SIZE_CLASSES[size],
        className
      )}
    >
      <img
        src={src}
        alt={alt || `${providerId || "Portugal Bakery"} logo`}
        className="h-full w-full object-cover select-none"
        loading="lazy"
      />
    </span>
  );
}
