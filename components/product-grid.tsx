"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { ProductCard } from "@/components/product-card"
import { buttonVariants } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

export function ProductGrid({
  products,
  addedIds,
  onAdd,
}: {
  products: Product[]
  addedIds: string[]
  onAdd: (id: string) => void
}) {
  const featuredProducts = products.slice(0, 4)

  return (
    <section
      id="featured"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-6 md:py-24"
    >
      <Reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            コレクション // Featured Collection
          </span>

          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl md:text-5xl">
            The Featured Drop
          </h2>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
          Four hand-picked heavyweight staples. Small-batch runs — once the void
          closes, it's gone.
        </p>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            added={addedIds.includes(product.id)}
            onAdd={onAdd}
          />
        ))}
      </div>

      <Reveal className="mt-12 flex justify-center">
        <a
          href="/shop"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "group h-13 gap-2 px-8 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5",
          )}
        >
          View All Products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  )
}