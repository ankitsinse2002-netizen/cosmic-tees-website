"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/reveal"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section id="newsletter" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="relative overflow-hidden rounded-sm border border-border bg-card px-6 py-14 md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Join The Void
            </span>
            <h2 className="max-w-2xl font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance md:text-5xl">
              Get Early Access To Every Drop
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Drops sell out fast. Subscribe for 10% off your first order, restock
              alerts, and members-only releases before anyone else.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 border border-primary/60 bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-widest">
                <Check className="h-4 w-4 text-primary" />
                You&apos;re on the list — check your inbox
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="h-12 flex-1 bg-secondary text-sm uppercase tracking-wide"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="group h-12 gap-2 px-6 text-sm uppercase tracking-widest"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            )}
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
