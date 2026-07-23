import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal-page-template";

export const metadata: Metadata = {
  title: "Cancellation Policy | Cosmic Tees",
  description:
    "Review the cancellation policy for Cosmic Tees orders, including before and after dispatch scenarios and refund processing timelines.",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

const sections = [
  {
    id: "cancellation-before-dispatch",
    title: "Cancellation Before Dispatch",
    paragraphs: [
      "Orders may be cancelled before dispatch by contacting support with your order number and registered contact details.",
      "If cancellation is accepted before handover to courier, eligible refunds are initiated to the original payment method or as per policy.",
    ],
  },
  {
    id: "cancellation-after-dispatch",
    title: "Cancellation After Dispatch",
    paragraphs: [
      "Once an order has been dispatched, cancellation requests may not be processed as standard cancellation.",
      "Customers may refuse delivery where allowed, or request return after delivery subject to the Return & Refund Policy.",
    ],
  },
  {
    id: "refund-processing",
    title: "Refund Processing",
    paragraphs: [
      "For eligible cancelled orders, refunds are generally initiated within 5 to 7 business days from cancellation confirmation.",
      "Actual credit timelines depend on banking networks, UPI channels, card issuers, and payment service providers.",
    ],
  },
  {
    id: "contact-support",
    title: "Contact Support",
    paragraphs: [
      "For cancellation and refund assistance, write to support@cosmictees.co.in with your order number and reason for cancellation.",
      "Our support team will review your request and respond with next steps based on order status and policy eligibility.",
    ],
  },
] as const;

export default function CancellationPolicyPage() {
  return (
    <LegalPageTemplate
      eyebrow="Legal"
      title="Cancellation Policy"
      description="This policy explains how order cancellations are handled at Cosmic Tees before and after dispatch."
      effectiveDate="23 July 2026"
      sections={sections.map((section) => ({ ...section }))}
    />
  );
}
