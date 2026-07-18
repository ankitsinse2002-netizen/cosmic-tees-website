"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CheckoutPageContent } from "@/components/checkout-page";
import { useCart } from "@/lib/cart-context";

function CheckoutPageShell() {
  const { cartCount } = useCart();

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <CheckoutPageContent />
      <SiteFooter />
    </>
  );
}

export default function CheckoutPage() {
  return <CheckoutPageShell />;
}
