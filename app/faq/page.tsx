import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const faqItems = [
  {
    title: "Shipping",
    answer: "Orders are dispatched within 1-2 business days. Shipping timelines vary by destination and courier partner.",
  },
  {
    title: "Returns",
    answer: "Returns are accepted for eligible products in unused condition. Contact support within the return window to initiate.",
  },
  {
    title: "Payments",
    answer: "We support Cash on Delivery and online payment options as available at checkout.",
  },
  {
    title: "Order Tracking",
    answer: "Once your order ships, tracking details are shared through email and can be requested from support.",
  },
  {
    title: "Delivery Time",
    answer: "Domestic deliveries usually arrive in 3-7 business days depending on serviceability and courier performance.",
  },
  {
    title: "Size Guide",
    answer: "Use our size guide before ordering to select the right fit for our oversized streetwear silhouettes.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">FAQ</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight">Frequently Asked Questions</h1>

          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
