"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Truck } from "lucide-react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, type CartItem } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format-currency";

type CheckoutFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  optional?: boolean;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

function CheckoutField({
  label,
  name,
  placeholder,
  optional = false,
  type = "text",
  required = true,
  value,
  onChange,
}: CheckoutFieldProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="flex items-center gap-2 font-medium text-foreground">
        {label}
        {optional ? <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Optional</span> : null}
      </span>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 rounded-xl border-border/70 bg-background px-3 text-sm"
      />
    </label>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  muted?: boolean;
};

function SummaryRow({ label, value, muted = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function CheckoutItem({ item }: { item: CartItem }) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
      <img
        src={item.product.image || "/placeholder.svg"}
        alt={item.product.name}
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">{item.product.category}</p>
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">{item.product.name}</h3>
          </div>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(lineTotal)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Size: {item.size}</span>
          <span>Qty: {item.quantity}</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Unit price: <span className="font-medium text-foreground">{formatCurrency(item.product.price)}</span>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, cartCount } = useCart();
  const formRef = useRef<HTMLFormElement | null>(null);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 120;
  const total = subtotal + shipping;

  function handleSubmit(event?: React.SyntheticEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!formRef.current) {
      return;
    }

    const readValue = (name: string) => {
      const field = formRef.current?.elements.namedItem(name);

      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
        return "";
      }

      return field.value;
    };

    const params = new URLSearchParams();

    [
      "billing_first_name",
      "billing_last_name",
      "billing_company",
      "billing_country",
      "billing_phone",
      "billing_address_1",
      "billing_address_2",
      "billing_city",
      "billing_state",
      "billing_postcode",
      "billing_email",
      "order_comments",
    ].forEach((key) => {
      const value = readValue(key).trim();
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/payment?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_50%)] bg-background text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Checkout</p>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Secure your order
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Complete your order securely. Your details are encrypted and never stored on our servers.
            </p>
          </div>
          <div className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground">
            {cartCount} item{cartCount === 1 ? "" : "s"} ready
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 text-center shadow-sm">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Add a few premium pieces to your cart and return here to complete checkout.
            </p>
            <Link href="/shop" className="mt-6 inline-flex">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <form ref={formRef} action="/payment" method="get" className="space-y-6 rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Billing details
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your shipping details to complete your order.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutField label="First Name" name="billing_first_name" placeholder="Aarav" />
                <CheckoutField label="Last Name" name="billing_last_name" placeholder="Patel" />
              </div>

              <CheckoutField label="Company" name="billing_company" placeholder="Cosmic Tees" optional />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-foreground">Country</span>
                  <select
                    name="billing_country"
                    defaultValue="India"
                    className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm outline-none"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                </label>
                <CheckoutField label="Phone" name="billing_phone" type="tel" placeholder="+91 98765 43210" />
              </div>

              <CheckoutField label="Street Address" name="billing_address_1" placeholder="123, Street Name" />
              <CheckoutField label="Apartment / Suite" name="billing_address_2" placeholder="Apartment, suite, unit, etc." optional />

              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutField label="Town / City" name="billing_city" placeholder="Mumbai" />
                <CheckoutField label="State" name="billing_state" placeholder="Maharashtra" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutField label="PIN Code" name="billing_postcode" placeholder="400001" />
                <CheckoutField label="Email" name="billing_email" type="email" placeholder="you@example.com" />
              </div>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-foreground">Order Notes</span>
                <textarea
                  name="order_comments"
                  rows={4}
                  placeholder="Notes about your order, e.g. special delivery instructions."
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border text-primary" required />
                <span>
                  I have read and agree to the <span className="font-medium text-foreground">terms & conditions</span>.
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-6 text-base font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Place Order
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Order Summary</p>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Your order</h2>
                  </div>
                  <div className="rounded-full border border-border/70 px-3 py-1 text-sm text-muted-foreground">
                    {items.length} product{items.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Coupon code</label>
                  <div className="mt-3 flex gap-2">
                    <Input placeholder="Enter code" className="h-10 rounded-xl border-border/70 bg-background" />
                    <Button type="button" variant="outline" className="h-10 rounded-xl">Apply</Button>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
                  <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                  <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} muted />
                  <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                    <span className="text-base font-semibold text-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-foreground">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Secure checkout with encrypted payments.
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Fast dispatch across India and the world.
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Premium support for every order.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
