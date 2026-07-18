import { Shirt, Truck, ShieldCheck, Sparkles } from "lucide-react"
import { Reveal } from "@/components/reveal"

const features = [
  {
    icon: Shirt,
    title: "240 GSM Premium Cotton",
    body: "Thick, boxy, structured super-combed cotton that holds its shape drop after drop. No see-through fast-fashion tees here.",
  },
  {
    icon: Sparkles,
    title: "Premium Print Quality",
    body: "High-density deep-ink prints baked into the fabric. Wash it, wear it, abuse it — the graphic stays loud and never cracks.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    body: "Dispatched within 48 hours with live tracking. Free shipping on every order above ₹999, pan-India and worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "Easy Returns",
    body: "Fit not right? Send it back within 7 days for a hassle-free size swap or a full refund. Zero drama.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="why" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-12 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Why Cosmic
          </span>
          <h2 className="max-w-2xl font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance md:text-5xl">
            Built Different, Worn Louder
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 0.08}
              className="group flex h-full flex-col gap-5 rounded-sm border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-sm border border-border bg-secondary text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:bg-primary/10">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {f.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
