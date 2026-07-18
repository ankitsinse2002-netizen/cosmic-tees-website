"use client"

import { Reveal } from "@/components/reveal"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

export function NewArrivals({
  products,
  addedIds,
  onAdd,
}: {
  products: Product[]
  addedIds: string[]
  onAdd: (id: string) => void
}) {
  const newArrivals = products.slice(4, 8)

  return (
    <section
      id="new-arrivals"
      className="border-t border-border bg-secondary/30"
    >
      <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              ニューアライバル // Fresh Ink
            </span>

            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl md:text-5xl">
              New Arrivals
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            Just dropped into the void. The freshest graphics off the press,
            printed on 240 GSM heavyweight cotton.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={addedIds.includes(product.id)}
              onAdd={onAdd}
              badge="NEW"
            />
          ))}
        </div>
      </div>
    </section>
  )
}