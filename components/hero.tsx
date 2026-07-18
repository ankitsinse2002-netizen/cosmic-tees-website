"use client"

import { ArrowRight, Star } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  const reduceMotion = useReducedMotion()

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } satisfies Variants

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
    },
  } satisfies Variants

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 40%, oklch(0.62 0.24 25 / 0.18), transparent 55%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr_1fr] md:gap-10 md:px-6 md:py-24 lg:py-28">
        <motion.div
          className="flex flex-col gap-7"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            コズミック // Drop 001 Live
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(1.75rem,9vw,4.25rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.02em] text-balance"
          >
            Overdrive
            <br />
            <span className="text-primary">The Void</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty md:text-lg"
          >
            240 GSM heavyweight streetwear engineered for the underground. Boxy
            dropped-shoulder fits, deep-ink washable prints, zero compromise.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/collections/cosmic"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-13 gap-2 px-7 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5",
              )}
            >
              Shop The Drop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 gap-2 px-7 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5",
              )}
            >
              Explore Catalog
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </span>
              4.9 // 2,400+ Reviews
            </span>
            <span className="h-4 w-px bg-border" />
            <span>Free Shipping ₹999+</span>
            <span className="h-4 w-px bg-border" />
            <span>Ships Worldwide</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative md:scale-[1.13] md:origin-center"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
        >
          <div className="pointer-events-none absolute -inset-2 bg-primary/10 blur-3xl" />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-6 h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(99, 102, 241, 0.24), rgba(15, 15, 15, 0) 72%)",
            }}
          />
          <div className="group relative flex items-center justify-center overflow-hidden rounded-sm border border-border/70 bg-card p-6 shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_0_28px_rgba(99,102,241,0.12)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 28%), radial-gradient(circle at 74% 62%, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0) 34%), radial-gradient(circle at 22% 72%, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0) 36%), linear-gradient(135deg, rgba(15,15,15,0.04), rgba(15,15,15,0.42))",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 24%, rgba(255,255,255,0.32) 0 1px, transparent 2px), radial-gradient(circle at 82% 28%, rgba(255,255,255,0.24) 0 1px, transparent 2px), radial-gradient(circle at 64% 76%, rgba(255,255,255,0.22) 0 1px, transparent 2px)",
              }}
            />
            <img
              src="/hero-reference.png"
              alt="Premium oversized black Cosmic Tees t-shirt with galaxy lighting"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="m-0 block h-auto w-[92%] object-contain object-center p-0 transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-safe:animate-[heroFloat_6.5s_ease-in-out_infinite]"
            />
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-background/80 px-3.5 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              240 GSM // Heavyweight
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
