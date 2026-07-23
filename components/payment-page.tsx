"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredCartRequestHeaders, useCart } from "@/lib/cart-context";
import {
  formatCurrency,
  getCheckoutSnapshot,
  getCustomerName,
  getPaymentTotals,
  serializeCheckoutSnapshot,
  type ReadonlyAddress,
} from "@/lib/payment";

type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    address?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpaySuccessPayload) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

type InfoCardProps = {
  title: string;
  badge?: string;
  children: React.ReactNode;
};

function InfoCard({ title, badge, children }: InfoCardProps) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">{title}</h2>
        {badge ? (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function AddressView({ address }: { address: ReadonlyAddress }) {
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className="text-foreground">
        <span className="font-semibold">{address.firstName} {address.lastName}</span>
        {address.company ? <span className="text-muted-foreground">, {address.company}</span> : null}
      </p>
      <p>{address.address1}</p>
      {address.address2 ? <p>{address.address2}</p> : null}
      <p>{address.city}, {address.state} {address.postcode}</p>
      <p>{address.country}</p>
    </div>
  );
}

function PaymentMethodOption({
  icon,
  title,
  description,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
        primary
          ? "border-primary/40 bg-primary/10"
          : "border-border/70 bg-background/60",
      ].join(" ")}
    >
      <span className={primary ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function PaymentPageContent() {
  const router = useRouter();
  const { items, clearCart, isLoading: cartIsLoading } = useCart();
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<"cod" | "razorpay">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSnapshot, setCheckoutSnapshot] = useState(() => getCheckoutSnapshot(new URLSearchParams()));
  const submitKeyRef = useRef("");

  useEffect(() => {
    setCheckoutSnapshot(getCheckoutSnapshot(new URLSearchParams(window.location.search)));
  }, []);

  useEffect(() => {
    if (!submitKeyRef.current) {
      submitKeyRef.current = crypto.randomUUID();
    }
  }, []);

  const totals = useMemo(
    () => getPaymentTotals(items),
    [items],
  );

  const canPlaceOrder = items.length > 0 && !cartIsLoading && !isSubmitting;
  const checkoutParams = serializeCheckoutSnapshot(checkoutSnapshot);
  const customerName = getCustomerName(checkoutSnapshot);

  const loadRazorpayScript = async () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (window.Razorpay) {
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      const existing = document.querySelector('script[data-razorpay-checkout="true"]') as HTMLScriptElement | null;

      const handleLoad = () => resolve(Boolean(window.Razorpay));
      const handleError = () => resolve(false);

      if (existing) {
        existing.addEventListener("load", handleLoad, { once: true });
        existing.addEventListener("error", handleError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.dataset.razorpayCheckout = "true";
      script.onload = handleLoad;
      script.onerror = handleError;
      document.body.appendChild(script);
    });
  };

  const placeOrder = async ({
    paymentMethod,
    paymentMethodLabel,
    paymentStatus,
    skipSubmittingCheck = false,
  }: {
    paymentMethod: "cod" | "razorpay";
    paymentMethodLabel: string;
    paymentStatus: string;
    skipSubmittingCheck?: boolean;
  }) => {
    setMessage("");
    setError("");

    if (!items.length) {
      setError("Your cart is empty or invalid.");
      return;
    }

    if (!skipSubmittingCheck && isSubmitting) {
      return;
    }

    if (!skipSubmittingCheck) {
      setIsSubmitting(true);
    }

    try {
      const response = await fetch("/api/payment/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getStoredCartRequestHeaders(),
        },
        body: JSON.stringify({
          checkout: checkoutSnapshot,
          paymentMethod,
          idempotencyKey: submitKeyRef.current,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        orderId?: number;
        orderNumber?: string;
        orderKey?: string;
        total?: number;
        duplicate?: boolean;
      };

      if (!response.ok) {
        setError(data.message || "Unable to create the order. Please try again.");
        return;
      }

      try {
        await clearCart();
      } catch {
        // Best-effort cleanup only. The server route already attempted to clear the Woo cart.
      }

      const query = new URLSearchParams(checkoutParams);
      query.set("customer_name", customerName);
      query.set("order_id", String(data.orderId || ""));
      query.set("order_number", String(data.orderNumber || data.orderId || ""));
      query.set("order_key", String(data.orderKey || ""));
      query.set("payment_method", paymentMethodLabel);
      query.set("payment_status", data.duplicate ? "already-processed" : paymentStatus);
      query.set("estimated_delivery", "3-5 business days");
      query.set("total", String(data.total || totals.total));
      query.set("subtotal", String(totals.subtotal));
      query.set("shipping", String(totals.shipping));
      query.set("discount", String(totals.discount));
      query.set(
        "items",
        JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.product.name,
            image: item.product.image,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price,
          })),
        ),
      );

      router.replace(`/order-success?${query.toString()}`);
    } catch (submitError) {
      console.error("[PaymentPage] order submit failed:", submitError);
      setError(
        paymentMethod === "cod"
          ? "Unable to place COD order right now. Please retry."
          : "Unable to place Razorpay order right now. Please retry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodSubmit = async () => {
    await placeOrder({
      paymentMethod: "cod",
      paymentMethodLabel: "Cash on Delivery",
      paymentStatus: "processing",
    });
  };

  const handleRazorpaySubmit = async () => {
    setMessage("");
    setError("");

    if (!razorpayKeyId) {
      setError("Razorpay is not configured yet. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID.");
      return;
    }

    if (!items.length) {
      setError("Your cart is empty or invalid.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setError("Unable to load Razorpay checkout. Please check your connection and retry.");
        setIsSubmitting(false);
        return;
      }

      const options: RazorpayCheckoutOptions = {
        key: razorpayKeyId,
        amount: Math.max(1, Math.round(totals.total * 100)),
        currency: "INR",
        name: "Cosmic Tees",
        description: "Secure payment for your Cosmic Tees order",
        prefill: {
          name: customerName,
          email: checkoutSnapshot.contact.email,
          contact: checkoutSnapshot.contact.phone,
        },
        notes: {
          address: `${checkoutSnapshot.shipping.address1}, ${checkoutSnapshot.shipping.city}`,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setMessage("Razorpay checkout was closed before payment completion.");
          },
        },
        handler: (response) => {
          if (!response.razorpay_payment_id) {
            setIsSubmitting(false);
            setError("Payment was not captured. Please try again.");
            return;
          }

          void placeOrder({
            paymentMethod: "razorpay",
            paymentMethodLabel: "Razorpay",
            paymentStatus: "paid",
            skipSubmittingCheck: true,
          });
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (razorpayError) {
      console.error("[PaymentPage] Razorpay checkout failed:", razorpayError);
      setError("Unable to initialize Razorpay checkout right now. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_50%)] bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Payment</p>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Complete Payment
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review your order and complete payment to place your order.
            </p>
          </div>
          <span className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground">
            {items.length} line item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <InfoCard title="Billing Information" badge="Read-only">
              <AddressView address={checkoutSnapshot.billing} />
            </InfoCard>

            <InfoCard title="Shipping Address" badge="Read-only">
              <AddressView address={checkoutSnapshot.shipping} />
            </InfoCard>

            <InfoCard title="Contact Information" badge="Read-only">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Phone: </span>
                  {checkoutSnapshot.contact.phone}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email: </span>
                  {checkoutSnapshot.contact.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">Order Notes: </span>
                  {checkoutSnapshot.contact.orderNotes || "No notes provided"}
                </p>
              </div>
            </InfoCard>
          </div>

          <div className="space-y-6">
            <InfoCard title="Order Summary">
              <div className="space-y-3">
                {cartIsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="h-28 animate-pulse rounded-2xl border border-border/70 bg-background/70" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <p className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                    No cart items found. Add products in cart before payment testing.
                  </p>
                ) : (
                  items.map((item) => (
                    <article key={item.id} className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="flex-1 space-y-1.5">
                        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(item.product.price * item.quantity)}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-border/70 pt-4 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>{totals.discount === 0 ? "-" : `-${formatCurrency(totals.discount)}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="text-base font-semibold text-foreground">Total Amount</span>
                  <span className="font-display text-2xl font-bold text-foreground">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Payment Method">
              <div className="space-y-3">
                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={selectedMethod === "cod"}
                    onChange={() => setSelectedMethod("cod")}
                    className="sr-only"
                  />
                  <PaymentMethodOption
                    icon={<CreditCard className="h-5 w-5" />}
                    title="Cash on Delivery"
                    description="Pay when your order is delivered. This is fully functional right now."
                    primary={selectedMethod === "cod"}
                  />
                </label>

                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="razorpay"
                    checked={selectedMethod === "razorpay"}
                    onChange={() => setSelectedMethod("razorpay")}
                    className="sr-only"
                  />
                  <PaymentMethodOption
                    icon={<Sparkles className="h-5 w-5" />}
                    title="Razorpay"
                    description="Pay securely using Razorpay."
                    primary={selectedMethod === "razorpay"}
                  />
                </label>
              </div>

              <Button
                size="lg"
                className="mt-6 h-12 w-full text-base font-semibold"
                onClick={() => {
                  if (selectedMethod === "razorpay") {
                    void handleRazorpaySubmit();
                    return;
                  }

                  void handleCodSubmit();
                }}
                disabled={!canPlaceOrder}
              >
                {isSubmitting ? "Processing..." : selectedMethod === "razorpay" ? "Pay with Razorpay" : "Place Order"}
              </Button>

              {error ? (
                <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {cartIsLoading ? (
                <p className="mt-3 rounded-xl border border-border/70 bg-background/60 p-3 text-sm text-muted-foreground">
                  Loading your current WooCommerce cart...
                </p>
              ) : null}

              {message ? (
                <p className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                  {message}
                </p>
              ) : null}
            </InfoCard>
          </div>
        </div>
      </section>
    </main>
  );
}
