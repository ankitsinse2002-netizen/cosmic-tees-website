const values = [
  "240 GSM Super-Combed Cotton",
  "Deep-Ink Washable Prints",
  "Boxy Dropped-Shoulder Fits",
  "Small-Batch Limited Drops",
  "Engineered For The Underground",
]

export function ValuesMarquee() {
  const items = [...values, ...values]
  return (
    <section
      aria-label="Brand values"
      className="group overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground"
    >
      <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap [animation-play-state:running] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        {items.map((value, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="font-display text-sm font-bold uppercase tracking-[0.2em]">
              {value}
            </span>
            <span className="text-lg leading-none">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}
