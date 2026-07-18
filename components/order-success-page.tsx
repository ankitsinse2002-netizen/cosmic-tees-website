"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleHelp, Mail, PackageSearch, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { formatCurrency, getCheckoutSnapshot, getCustomerName } from "@/lib/payment";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border/40 py-3 sm:grid-cols-[160px_1fr] sm:gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SuccessCheckAnimation() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-primary/30 bg-primary/10 sm:h-36 sm:w-36">
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/30"
        animate={{ scale: [1, 1.08, 1], opacity: [0.9, 0.35, 0.9] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24" initial="hidden" animate="visible">
        <motion.circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="currentColor"
          className="text-primary/35"
          strokeWidth="8"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M40 63 L54 77 L81 49"
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}

function readOrderItems(encodedItems: string): OrderItem[] {
  if (!encodedItems) return [];

  try {
    const parsed = JSON.parse(encodedItems) as OrderItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Boolean(item.id && item.name));
  } catch {
    return [];
  }
}

export function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const snapshot = getCheckoutSnapshot(new URLSearchParams(searchParams.toString()));

  const orderNumber = searchParams.get("order_number") || searchParams.get("order_id") || "Pending WooCommerce order";
  const customerName = searchParams.get("customer_name") || getCustomerName(snapshot);
  const paymentMethod = searchParams.get("payment_method") || "Cash on Delivery";
  const estimatedDelivery = searchParams.get("estimated_delivery") || "3-5 business days";
  const total = Number(searchParams.get("total") || 0);
  const subtotal = Number(searchParams.get("subtotal") || 0);
  const shipping = Number(searchParams.get("shipping") || 0);
  const discount = Number(searchParams.get("discount") || 0);
  const orderUrl = searchParams.get("order_url") || "";
  const items = readOrderItems(searchParams.get("items") || "");
  const hasRealOrder = orderNumber !== "Pending WooCommerce order";

  const billingAddress = [
    snapshot.billing.firstName,
    snapshot.billing.lastName,
    snapshot.billing.address1,
    snapshot.billing.address2,
    snapshot.billing.city,
    snapshot.billing.state,
    snapshot.billing.postcode,
    snapshot.billing.country,
  ]
    .filter(Boolean)
    .join(", ");

  const shippingAddress = [
    snapshot.shipping.firstName,
    snapshot.shipping.lastName,
    snapshot.shipping.address1,
    snapshot.shipping.address2,
    snapshot.shipping.city,
    snapshot.shipping.state,
    snapshot.shipping.postcode,
    snapshot.shipping.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_45%)] bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Reveal className="rounded-[2.25rem] border border-border/70 bg-card/70 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <SuccessCheckAnimation />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Cosmic Confirmation
            </span>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Order Placed Successfully
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {hasRealOrder
                ? "Your WooCommerce order has been created successfully."
                : "This page is ready to receive real WooCommerce order data."}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-6" delay={0.05}>
            <section id="order-details" className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Order Details</h2>
              </div>

              <div>
                <DetailRow label="Order Number" value={orderNumber} />
                <DetailRow label="Customer Name" value={customerName} />
                <DetailRow label="Payment Method" value={paymentMethod} />
                <DetailRow label="Estimated Delivery" value={estimatedDelivery} />
                <DetailRow label="Billing Address" value={billingAddress} />
                <DetailRow label="Shipping Address" value={shippingAddress} />
                <DetailRow label="Email" value={snapshot.contact.email} />
                <DetailRow label="Phone" value={snapshot.contact.phone} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-2">
                <CircleHelp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Need Help?</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a href="/contact" className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                  Contact Support
                </a>
                <a href="mailto:support@cosmictees.co.in" className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                  Email Support
                </a>
                <a href="/faq" className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary">
                  FAQ
                </a>
              </div>
            </section>
          </Reveal>

          <Reveal className="space-y-6" delay={0.1}>
            <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-2">
                <PackageSearch className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Order Summary</h2>
              </div>

              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((item) => (
                    <article key={item.id} className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex-1 space-y-1.5">
                        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    Ordered products will appear here once WooCommerce order data is available.
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-border/70 pt-4">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal || total)} />
                <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
                <SummaryRow label="Discount" value={discount === 0 ? "-" : `-${formatCurrency(discount)}`} />
                <div className="flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="font-display text-2xl font-bold text-foreground">{formatCurrency(total || subtotal)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/shop" className="inline-flex sm:col-span-2">
                  <Button size="lg" className="h-12 w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href={orderUrl || "#order-details"} className="inline-flex">
                  <Button variant="outline" size="lg" className="h-12 w-full">
                    View Order
                  </Button>
                </Link>
                <Link href="/" className="inline-flex">
                  <Button variant="outline" size="lg" className="h-12 w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>

              <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                Confirmation email sent to your inbox
              </p>
            </section>
          </Reveal>
        </div>
      </section>
    </main>
  );
}