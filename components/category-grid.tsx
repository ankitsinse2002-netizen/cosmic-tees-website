"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import type { WooCollectionCategory } from "@/lib/collections"

type CategoryGridProps = {
  categories: WooCollectionCategory[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section id="categories" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              カテゴリー // Collections
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl md:text-5xl">
              Shop By Category
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            Find your frequency. Four worlds of heavyweight graphics engineered
            for the underground.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.08}>
              <Link
                href={`/collections/${cat.slug}`}
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10"
              >
                <img
                  src={cat.image?.src || "/placeholder.svg"}
                  alt={`${cat.name} collection`}
                  width={500}
                  height={666}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <span className="absolute right-3 top-3 font-display text-xs uppercase tracking-widest text-foreground/70">
                  {cat.slug}
                </span>

                <div className="relative flex items-end justify-between gap-2 p-4 md:p-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight md:text-xl">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {cat.description || `${cat.count} products`}
                    </span>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
