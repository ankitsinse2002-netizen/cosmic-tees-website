import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Our Story | Cosmic Tees",
  description: "Learn about the story, mission and vision behind Cosmic Tees.",
  alternates: {
    canonical: "/our-story",
  },
};

const timeline = [
  {
    title: "The Spark",
    text: "Cosmic Tees began as a late-night design experiment between creators who loved anime art direction, JDM energy, and heavyweight streetwear that actually lasts.",
  },
  {
    title: "Built For Everyday Wear",
    text: "We focused on durable 240 GSM construction, clean silhouettes, and prints engineered to survive real use, frequent washing, and repeat styling.",
  },
  {
    title: "Community First",
    text: "Every collection is shaped by direct customer feedback on fit, fabric, and artwork. We build small, improve fast, and ship better each drop.",
  },
];

const values = [
  {
    heading: "Mission",
    body: "To make premium, expressive streetwear for people who live online and offline with the same intensity.",
  },
  {
    heading: "Vision",
    body: "To build India’s most trusted independent graphic streetwear label rooted in design quality, product honesty, and long-term community.",
  },
  {
    heading: "Promise",
    body: "No shortcut fabrics, no weak print quality, no inflated claims. We prioritize craftsmanship, transparency, and consistency in every order.",
  },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Reveal className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About Cosmic Tees</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Our Story
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Cosmic Tees exists for people who want statement streetwear with substance. We combine underground visual culture with premium construction so each tee feels bold, wearable, and built to stay in rotation.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8" delay={0.05}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">How We Started</h2>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8" delay={0.1}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Mission & Vision</h2>
            <div className="mt-6 space-y-3">
              {values.map((item) => (
                <article key={item.heading} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
