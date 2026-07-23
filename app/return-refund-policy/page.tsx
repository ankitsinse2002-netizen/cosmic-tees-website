import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal-page-template";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Cosmic Tees",
  description:
    "Read Cosmic Tees return and refund terms including eligibility, damaged or wrong item process, exchange rules, and timelines.",
  alternates: {
    canonical: "/return-refund-policy",
  },
};

const sections = [
  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "Return requests must be raised within 7 days of delivery unless stated otherwise for specific product categories.",
      "Items must be unused, unwashed, and returned with original tags, packaging, and proof of purchase.",
    ],
  },
  {
    id: "damaged-products",
    title: "Damaged Products",
    paragraphs: [
      "If your item is received damaged, raise a complaint within 48 hours of delivery with clear unpacking images and product photos.",
      "Validated damage claims may be resolved through replacement, exchange, or refund at Cosmic Tees' discretion.",
    ],
  },
  {
    id: "wrong-item",
    title: "Wrong Item",
    paragraphs: [
      "If an incorrect product, color, or size variant is delivered against your confirmed order, report it promptly with order details and images.",
      "Once verified, we will arrange reverse pickup where serviceable and ship the correct item or process refund as applicable.",
    ],
  },
  {
    id: "refund-timeline",
    title: "Refund Timeline",
    paragraphs: [
      "Approved refunds are usually initiated within 5 to 7 business days after successful quality check of returned products, or after claim approval in non-return scenarios.",
      "Banking and payment partner settlement timelines may vary and are outside direct control of Cosmic Tees.",
    ],
  },
  {
    id: "exchange-rules",
    title: "Exchange Rules",
    paragraphs: [
      "Exchanges are subject to stock availability of requested size or design at the time of processing.",
      "Where exchange stock is unavailable, store credit or refund may be offered in line with operational policy.",
    ],
  },
  {
    id: "non-returnable-items",
    title: "Non-returnable Items",
    bullets: [
      "Products marked as final sale, clearance, or non-returnable on product pages.",
      "Items returned without original tags, signs of use, washing, or physical alteration.",
      "Requests raised outside the eligible return window without valid exception grounds.",
      "Gift cards, promotional merchandise, and items excluded by hygiene or compliance conditions.",
    ],
  },
] as const;

export default function ReturnRefundPolicyPage() {
  return (
    <LegalPageTemplate
      eyebrow="Legal"
      title="Return & Refund Policy"
      description="This policy outlines return, refund, and exchange rules for purchases made on Cosmic Tees."
      effectiveDate="23 July 2026"
      sections={sections.map((section) => ({ ...section }))}
    />
  );
}
