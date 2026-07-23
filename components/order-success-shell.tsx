"use client";

import { Newsletter } from "@/components/newsletter";
import { OrderSuccessPageContent } from "@/components/order-success-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-context";

export function OrderSuccessPageShell() {
  const { cartCount } = useCart();

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <OrderSuccessPageContent />
      <Newsletter />
      <SiteFooter />
    </>
  );
}