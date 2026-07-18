import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PaymentFailedPageContent } from "@/components/payment-failed-page";
import { serializeCheckoutSnapshot, getCheckoutSnapshot } from "@/lib/payment";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function toSearchParams(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.trim()) {
      searchParams.set(key, value);
    }
  }

  return searchParams;
}

export default async function PaymentFailedPage({ searchParams }: PageProps) {
  const params = toSearchParams(await searchParams);
  const snapshot = getCheckoutSnapshot(params);
  const checkoutQuery = serializeCheckoutSnapshot(snapshot);
  const reason = params.get("reason") || "gateway_unavailable";
  const message = params.get("message") || "Payment could not be completed. Please try again.";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <PaymentFailedPageContent
        reason={reason}
        message={message}
        retryHref={`/payment?${checkoutQuery.toString()}`}
        checkoutHref={`/checkout?${checkoutQuery.toString()}`}
        continueHref="/shop"
      />
      <SiteFooter />
    </main>
  );
}