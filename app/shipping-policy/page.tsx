import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal-page-template";

export const metadata: Metadata = {
  title: "Shipping Policy | Cosmic Tees",
  description:
    "Understand Cosmic Tees order processing, shipping timelines, delivery partners, delays, address accuracy, and tracking process.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

const sections = [
  {
    id: "order-processing",
    title: "Order Processing",
    paragraphs: [
      "Orders are typically processed within 1 to 2 business days after successful confirmation. Processing may extend during high-volume drops, national holidays, or promotional events.",
      "Orders placed on Sundays or public holidays are processed on the next working day.",
    ],
  },
  {
    id: "shipping-timeline",
    title: "Shipping Timeline",
    paragraphs: [
      "Standard delivery timelines within India are generally 3 to 7 business days from dispatch, subject to destination serviceability.",
      "Timelines are indicative and not guaranteed delivery commitments.",
    ],
  },
  {
    id: "delivery-partners",
    title: "Delivery Partners",
    paragraphs: [
      "Cosmic Tees works with reputed logistics partners and courier aggregators for nationwide delivery.",
      "Carrier allocation is determined based on destination pin code, serviceability, and operational efficiency.",
    ],
  },
  {
    id: "delays",
    title: "Delays",
    paragraphs: [
      "Delays can occur due to weather disruptions, transport strikes, route restrictions, incomplete addresses, verification checks, or unforeseen courier constraints.",
      "Where possible, we will share updates through registered email, mobile communication, or account support channels.",
    ],
  },
  {
    id: "address-accuracy",
    title: "Address Accuracy",
    paragraphs: [
      "Customers are responsible for providing complete and accurate shipping details, including name, address, landmark, city, state, and PIN code.",
      "Cosmic Tees is not liable for failed delivery due to incorrect or incomplete details submitted at checkout.",
    ],
  },
  {
    id: "tracking-orders",
    title: "Tracking Orders",
    paragraphs: [
      "Tracking details are shared once the order is dispatched and can be viewed through communication sent to your registered contact information.",
      "If tracking updates are delayed or unavailable, contact support@cosmictees.co.in with your order number for assistance.",
    ],
  },
] as const;

export default function ShippingPolicyPage() {
  return (
    <LegalPageTemplate
      eyebrow="Legal"
      title="Shipping Policy"
      description="This Shipping Policy explains how Cosmic Tees processes, dispatches, and delivers orders across India."
      effectiveDate="23 July 2026"
      sections={sections.map((section) => ({ ...section }))}
    />
  );
}
