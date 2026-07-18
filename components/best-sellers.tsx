"use client"

import { Check, Plus, TrendingUp } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

export function BestSellers({
  products,
  addedIds,
  onAdd,
}: {
  products: Product[]
  addedIds: string[]
  onAdd: (id: string) => void
}) {
  const bestSellers = products.slice(0, 4)
  const [hero, ...rest] = bestSellers

  const discountOf = (compareAt: number | undefined, price: number) =>
    compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0

  return (
    <section
      id="best-sellers"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              ベストセラー // Most Wanted
            </span>

            <h2 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-balance md:text-5xl">
              Best Sellers
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            The graphics the culture keeps reaching for. Restocked, rewashed and
            still uncracked.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {hero && (
            <Reveal className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:border-primary/60">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary lg:aspect-auto lg:h-full">
                <img
                  src={hero.image || "/placeholder.svg"}
                  alt={hero.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                <span className="absolute left-4 top-4 flex items-center gap-1.5 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  <TrendingUp className="h-3 w-3" />
                  #1 Best Seller
                </span>

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {hero.category}
                    </span>

                    <h3 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight md:text-3xl">
                      {hero.name}
                    </h3>

                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                      {hero.blurb}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold">
                        ₹{hero.price}
                      </span>

                      {hero.compareAt && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{hero.compareAt}
                          </span>

                          <span className="border border-border bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                            -{discountOf(hero.compareAt, hero.price)}%
                          </span>
                        </>
                      )}
                    </div>

                    <Button
                      onClick={() => onAdd(hero.id)}
                      variant={
                        addedIds.includes(hero.id) ? "outline" : "default"
                      }
                      className="gap-2 uppercase tracking-widest"
                    >
                      {addedIds.includes(hero.id) ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          <div className="flex flex-col gap-4">
            {rest.map((p, i) => {
              const added = addedIds.includes(p.id)

              return (
                <Reveal
                  key={p.id}
                  delay={i * 0.08}
                  as="article"
                  className="group flex items-center gap-4 rounded-sm border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 sm:p-4"
                >
                  <span className="hidden shrink-0 font-display text-2xl font-extrabold text-muted-foreground/40 sm:block">
                    0{i + 2}
                  </span>

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-secondary sm:h-24 sm:w-24">
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {p.category}
                    </span>

                    <h3 className="truncate font-display text-base font-bold uppercase tracking-tight">
                      {p.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-lg font-extrabold">
                        ₹{p.price}
                      </span>

                      {p.compareAt && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{p.compareAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => onAdd(p.id)}
                    size="icon"
                    variant={added ? "outline" : "default"}
                    className={cn("h-10 w-10 shrink-0")}
                  >
                    {added ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}