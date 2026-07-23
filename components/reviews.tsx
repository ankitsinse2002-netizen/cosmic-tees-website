import { Star } from "lucide-react"
import { Reveal } from "@/components/reveal"

const reviews = [
  {
    name: "Arjun M.",
    handle: "@arjun.exe",
    rating: 5,
    body: "The Anime Overdrive tee is insane. Fabric is genuinely heavyweight and the print looks even better in person. Copping the whole drop.",
    product: "Anime Overdrive",
  },
  {
    name: "Sneha R.",
    handle: "@sneharr",
    rating: 5,
    body: "Been searching for boxy tees that actually fit right in India. Cosmic nailed it. Shipping was stupid fast too.",
    product: "Void Essential",
  },
  {
    name: "Kabir S.",
    handle: "@kbr.jdm",
    rating: 4,
    body: "Acid wash finish is unreal, feels premium. Went one size down for a cleaner fit. Would recommend sizing advice on product page.",
    product: "Acid Wash Limited",
  },
  {
    name: "Ishita P.",
    handle: "@ishitaaa",
    rating: 5,
    body: "Ordered two, wore them non-stop, washed a dozen times — no cracking, no fading. This is how a tee should be built.",
    product: "Void Essential",
  },
  {
    name: "Devansh T.",
    handle: "@dev.void",
    rating: 5,
    body: "Packaging alone made me a fan. The eclipse branding is clean. Feels like a real brand, not a dropshipped store.",
    product: "Anime Overdrive",
  },
  {
    name: "Meera K.",
    handle: "@meerakay",
    rating: 5,
    body: "Finally streetwear that doesn't cost a fortune but doesn't feel cheap. The crimson-on-black colorway is my favorite thing I own.",
    product: "Acid Wash Limited",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-12 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            The Culture Speaks
          </span>
          <h2 className="max-w-2xl font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance md:text-5xl">
            4.9/5 From 2,400+ Cosmic Heads
          </h2>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal
              as="article"
              key={r.name}
              delay={(i % 3) * 0.08}
              className="flex h-full flex-col gap-4 rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center gap-1" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < r.rating
                        ? "h-4 w-4 fill-primary text-primary"
                        : "h-4 w-4 text-muted-foreground/40"
                    }
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                {`"${r.body}"`}
              </blockquote>
              <footer className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <span className="text-xs text-muted-foreground">{r.handle}</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {r.product}
                </span>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
