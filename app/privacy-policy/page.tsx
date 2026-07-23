import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal-page-template";

export const metadata: Metadata = {
  title: "Privacy Policy | Cosmic Tees",
  description:
    "Read how Cosmic Tees collects, uses, stores and protects customer information for shopping, support and payment processing.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    paragraphs: [
      "When you place an order, create an account, or contact us, Cosmic Tees may collect your name, mobile number, email address, billing and shipping address, and order details.",
      "We may also collect device and usage data such as browser type, IP address, referral source, and pages visited to improve storefront performance and customer experience.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    bullets: [
      "To process and deliver your orders, including shipment updates and transactional communication.",
      "To verify purchases, prevent fraud, and maintain platform security.",
      "To provide customer support and resolve issues related to orders, returns, and refunds.",
      "To improve product selection, website experience, and service quality.",
      "To send promotional communication only where permitted under applicable law and your communication preferences.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "We use cookies and similar technologies to keep your session active, maintain cart state, remember preferences, and analyze traffic trends.",
      "You can manage cookies through your browser settings. Disabling essential cookies may affect checkout, account access, and site functionality.",
    ],
  },
  {
    id: "payment-information",
    title: "Payment Information",
    paragraphs: [
      "Online payments are processed through authorized payment gateways. Cosmic Tees does not store full card numbers, CVV, UPI PIN, or sensitive authentication credentials on its servers.",
      "Payment metadata required for reconciliation, chargeback defense, and lawful compliance may be retained in accordance with accounting and legal requirements.",
    ],
  },
  {
    id: "third-party-services",
    title: "Third Party Services",
    paragraphs: [
      "We work with third-party providers for payment processing, logistics, analytics, and communication services. These providers process data as independent controllers or processors based on their role.",
      "Their use of data is governed by their own terms and privacy policies. We engage service providers that follow commercially reasonable security practices.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    paragraphs: [
      "We implement appropriate technical and organizational safeguards to protect personal data against unauthorized access, alteration, disclosure, or destruction.",
      "No method of internet transmission or digital storage is completely secure. We therefore cannot guarantee absolute security but continuously review and improve controls.",
    ],
  },
  {
    id: "user-rights",
    title: "User Rights",
    paragraphs: [
      "Subject to applicable law in India, you may request access, correction, or deletion of your personal information, or raise concerns regarding data processing.",
      "To exercise rights, contact us using the details below with sufficient verification details so we can validate and process your request securely.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "For privacy-related requests and grievances, contact: support@cosmictees.co.in.",
      "We aim to acknowledge and address valid privacy requests within a reasonable timeline as required by applicable law.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPageTemplate
      eyebrow="Legal"
      title="Privacy Policy"
      description="This Privacy Policy explains how Cosmic Tees collects, uses, shares and safeguards personal information when you access our website, place an order, or interact with customer support services in India."
      effectiveDate="23 July 2026"
      sections={sections.map((section) => ({ ...section }))}
    />
  );
}
