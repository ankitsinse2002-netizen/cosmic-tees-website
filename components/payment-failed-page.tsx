import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

type PaymentFailedPageContentProps = {
  reason: string;
  message: string;
  retryHref: string;
  checkoutHref: string;
  continueHref: string;
};

function ReasonPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </span>
  );
}

export function PaymentFailedPageContent({
  reason,
  message,
  retryHref,
  checkoutHref,
  continueHref,
}: PaymentFailedPageContentProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_45%)] bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Reveal className="rounded-[2.25rem] border border-border/70 bg-card/70 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 sm:h-36 sm:w-36">
              <AlertTriangle className="h-14 w-14 text-destructive sm:h-20 sm:w-20" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-destructive">
              Payment Failed
            </span>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Payment Failed
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {message}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <ReasonPill>{reason.replace(/_/g, " ")}</ReasonPill>
              <ReasonPill>Network issue</ReasonPill>
              <ReasonPill>Payment cancelled</ReasonPill>
              <ReasonPill>Gateway unavailable</ReasonPill>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7" delay={0.05}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">What happened?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your payment could not be completed at this time. You can retry the same checkout, go back to the payment page, or continue browsing the catalog.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                Network issue or timeout while reaching the payment gateway.
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                Payment was cancelled before the gateway could confirm it.
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                Gateway unavailable or temporarily failing upstream.
              </div>
            </div>
          </Reveal>

          <Reveal className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-7" delay={0.1}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Next Steps</h2>
            <div className="mt-6 grid gap-3">
              <Link href={retryHref} className="inline-flex">
                <Button className="h-12 w-full justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry Payment
                </Button>
              </Link>
              <Link href={checkoutHref} className="inline-flex">
                <Button variant="outline" className="h-12 w-full justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Checkout
                </Button>
              </Link>
              <Link href={continueHref} className="inline-flex">
                <Button variant="outline" className="h-12 w-full justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}