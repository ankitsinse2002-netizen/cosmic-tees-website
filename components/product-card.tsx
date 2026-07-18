"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Plus, Heart, Eye } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

export function ProductCard({
  product,
  added,
  onAdd,
  badge,
}: {
  product: Product
  added: boolean
  onAdd: (id: string) => void
  /** Optional badge that overrides the product tag (e.g. "NEW") */
  badge?: string
}) {
  const [wishlisted, setWishlisted] = useState(false)
  const reduceMotion = useReducedMotion()

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {(badge ?? product.tag) && (
            <span className="w-fit bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              {badge ?? product.tag}
            </span>
          )}

          {discount > 0 && (
            <span className="w-fit border border-border bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground backdrop-blur">
              -{discount}%
            </span>
          )}
        </div>

        <span className="absolute right-3 top-3 font-display text-xs uppercase tracking-widest text-muted-foreground">
          {product.katakana}
        </span>

        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground opacity-100 backdrop-blur transition-all duration-300 hover:border-primary/60 hover:text-primary focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              wishlisted && "fill-primary text-primary"
            )}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link href={`/product/${product.slug}`} className="block">
            <Button
              variant="outline"
              className="w-full gap-2 border-border/70 bg-background/80 text-xs uppercase tracking-widest backdrop-blur"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {product.category}
          </span>

          <Link
            href={`/product/${product.slug}`}
            className="font-display text-lg font-bold uppercase leading-tight tracking-tight transition-colors hover:text-primary"
          >
            {product.name}
          </Link>

          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {product.blurb}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold">
              ₹{product.price}
            </span>

            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.compareAt}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={() => onAdd(product.id)}
          className="w-full gap-2 uppercase tracking-widest transition-transform hover:-translate-y-0.5"
          variant={added ? "outline" : "default"}
          aria-label={
            added
              ? `${product.name} added to cart`
              : `Add ${product.name} to cart`
          }
        >
          {added ? (
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
    </motion.article>
  )
}