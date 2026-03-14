"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/ShinyButton";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface CheckoutButtonProps {
  priceId?: string;
  highlighted: boolean;
  disabled: boolean;
  children: React.ReactNode;
  useShiny?: boolean;
}

export function CheckoutButton({
  priceId,
  highlighted,
  disabled,
  children,
  useShiny = false,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (!priceId || !scriptLoaded) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "unSent",
        description: data.planName,
        order_id: data.orderId,
        handler: async (paymentResponse: RazorpayResponse) => {
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              tier: data.tier,
            }),
          });

          if (verifyResponse.ok) {
            router.push("/dashboard?success=true");
            router.refresh();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: data.userEmail,
        },
        theme: {
          color: "#C56F8C", // paleviolet
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      const message =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to initiate payment: ${message}`);
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || isLoading || !scriptLoaded;

  if (useShiny) {
    return (
      <ShinyButton
        onClick={handleCheckout}
        disabled={isDisabled}
        className="w-full"
        size="md"
      >
        {isLoading ? "Processing..." : children}
      </ShinyButton>
    );
  }

  return (
    <Button
      variant={highlighted ? "glow" : "secondary"}
      className="w-full"
      disabled={isDisabled}
      onClick={handleCheckout}
    >
      {isLoading ? "Processing..." : children}
    </Button>
  );
}
