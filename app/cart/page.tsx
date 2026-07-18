"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format-currency";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartCount } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader cartCount={cartCount} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Cart
          </p>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Your bag
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-sm border border-border bg-card p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Build your next fit with premium streetwear staples from the Cosmic Tees catalog.
            </p>
            <Link href="/shop" className="mt-6 inline-flex">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => {
                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-sm border border-border bg-card p-4 sm:flex-row sm:items-center"
                  >
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="h-24 w-full rounded-sm object-cover sm:h-24 sm:w-24"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                          {item.product.category}
                        </p>
                        <h2 className="font-display text-lg font-bold uppercase tracking-tight">
                          {item.product.name}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <span>SKU: {item.product.sku || "—"}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-9 w-9 items-center justify-center"
                          aria-label={`Decrease quantity for ${item.product.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-9 w-9 items-center justify-center"
                          aria-label={`Increase quantity for ${item.product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold text-foreground">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[90px] text-right">
                    <p className="text-sm text-muted-foreground">Line total</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                  </article>
                );
              })}
            </div>

            <aside className="rounded-sm border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                Order summary
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-sm border border-border bg-background p-4">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Promo code
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none"
                    placeholder="Enter code"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-base font-semibold">Total</span>
                <span className="font-display text-2xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>

              <Link href="/checkout" className="mt-6 inline-flex w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </aside>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
