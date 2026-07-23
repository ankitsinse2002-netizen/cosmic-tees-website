import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal-page-template";

export const metadata: Metadata = {
  title: "Terms & Conditions | Cosmic Tees",
  description:
    "Review the terms governing use of the Cosmic Tees website, ordering, payments, shipping, returns and customer responsibilities.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

const sections = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing, browsing, or placing an order on Cosmic Tees, you agree to be bound by these Terms & Conditions, our Privacy Policy, and all applicable policies referenced on this website.",
      "If you do not agree with any part of these terms, please discontinue use of the website and refrain from placing orders.",
    ],
  },
  {
    id: "products",
    title: "Products",
    paragraphs: [
      "Product images are for representation. Actual color, print placement, and finish may vary slightly due to screen settings and manufacturing tolerances.",
      "Availability of products, sizes, and designs is subject to inventory and may change without prior notice.",
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    paragraphs: [
      "All prices are listed in Indian Rupees (INR) and are inclusive or exclusive of taxes as displayed at checkout.",
      "Cosmic Tees reserves the right to revise prices, offers, and promotions at any time. Pricing errors may be corrected, and impacted orders may be cancelled with refund where applicable.",
    ],
  },
  {
    id: "orders",
    title: "Orders",
    paragraphs: [
      "Order confirmation indicates receipt of your order request and does not constitute final acceptance. We may cancel orders for stock, quality, fraud-check, or operational reasons.",
      "In case of cancellation by Cosmic Tees after payment capture, eligible refunds will be initiated in accordance with our refund timelines.",
    ],
  },
  {
    id: "payments",
    title: "Payments",
    paragraphs: [
      "We may offer multiple payment options including Cash on Delivery and online payment methods enabled at checkout.",
      "You agree to provide accurate payment details and authorize us and our payment partners to process transactions related to your order.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    paragraphs: [
      "Shipping timelines are estimates and may vary based on location, serviceability, weather, and courier network conditions.",
      "Risk of loss generally transfers on delivery to the shipping address provided by the customer.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    paragraphs: [
      "Returns and refunds are governed by the Return & Refund Policy available on this website.",
      "To initiate a request, customers must follow the process and timelines described in the policy.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    paragraphs: [
      "All website content including brand assets, logos, graphics, product designs, copy, and digital media is owned by or licensed to Cosmic Tees and protected under applicable intellectual property laws.",
      "No material may be reproduced, distributed, altered, or commercially used without prior written authorization.",
    ],
  },
  {
    id: "user-conduct",
    title: "User Conduct",
    bullets: [
      "Do not use the platform for unlawful, fraudulent, or abusive purposes.",
      "Do not interfere with platform security, performance, or access controls.",
      "Do not submit false, misleading, or unauthorized personal or payment information.",
      "Do not infringe third-party rights while using website features, reviews, or contact forms.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Cosmic Tees shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the website or purchase of products.",
      "Our aggregate liability for any claim shall not exceed the amount paid by you for the specific order giving rise to such claim.",
    ],
  },
  {
    id: "governing-law-india",
    title: "Governing Law (India)",
    paragraphs: [
      "These Terms are governed by the laws of India. Any disputes shall be subject to the competent courts in India as per applicable jurisdictional rules.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "For legal, compliance, or order-related questions, write to support@cosmictees.co.in.",
    ],
  },
] as const;

export default function TermsAndConditionsPage() {
  return (
    <LegalPageTemplate
      eyebrow="Legal"
      title="Terms & Conditions"
      description="These Terms & Conditions govern your use of the Cosmic Tees website, products, and services. Please read them carefully before placing an order."
      effectiveDate="23 July 2026"
      sections={sections.map((section) => ({ ...section }))}
    />
  );
}
