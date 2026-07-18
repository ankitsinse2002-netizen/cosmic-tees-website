"use client";

import { PaymentPageContent } from "@/components/payment-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-context";

function PaymentPageShell() {
  const { cartCount } = useCart();

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <PaymentPageContent />
      <SiteFooter />
    </>
  );
}

export default function PaymentPage() {
  return <PaymentPageShell />;
}
