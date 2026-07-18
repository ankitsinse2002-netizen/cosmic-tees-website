import { Suspense } from "react";

import { OrderSuccessPageShell } from "@/components/order-success-shell";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessPageShell />
    </Suspense>
  );
}
