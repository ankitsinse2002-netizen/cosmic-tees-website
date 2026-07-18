"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/payment";

type AccountOrder = {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
  dateCreated: string;
};

export default function MyAccountOrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/account/orders", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = (await response.json()) as { orders: AccountOrder[] };
      setOrders(data.orders || []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-black uppercase tracking-tight">Order History</h1>
            <Link href="/my-account" className="text-sm text-primary hover:underline">Back to account</Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found for your account yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">Order #{order.number}</p>
                    <span className="rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <p>{order.dateCreated ? new Date(order.dateCreated).toLocaleString() : "-"}</p>
                    <p>{formatCurrency(Number(order.total || 0))}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
