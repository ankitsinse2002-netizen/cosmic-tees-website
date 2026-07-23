"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export type CollectionSelectionCard = {
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  slug: string;
};

type CollectionSelectionCardsProps = {
  title: string;
  eyebrow: string;
  description: string;
  cards: CollectionSelectionCard[];
  basePath: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function CollectionSelectionCards({
  title,
  eyebrow,
  description,
  cards,
  basePath,
  imageSrc,
  imageAlt,
}: CollectionSelectionCardsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
          <div className="relative min-h-[220px]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt || title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
            <div className="relative flex min-h-[220px] flex-col justify-end gap-4 p-6 sm:p-8 lg:p-10">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
              >
                <Link href="/" className="transition hover:text-foreground">
                  Home
                </Link>
                <ArrowUpRight className="h-3.5 w-3.5 rotate-45" />
                <Link href="/collections" className="transition hover:text-foreground">
                  Collections
                </Link>
                <ArrowUpRight className="h-3.5 w-3.5 rotate-45" />
                <span className="text-foreground">{title}</span>
              </nav>

              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  {eyebrow}
                </p>
                <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
                  {title}
                </h1>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <Reveal key={card.slug} delay={index * 0.08}>
              <Link
                href={`${basePath}/${card.slug}`}
                className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 sm:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 24%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06), transparent 18%)",
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="max-w-[18rem] space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/90">
                      {card.subtitle}
                    </p>
                    <h2 className="font-display text-3xl font-black uppercase tracking-tight">
                      {card.title}
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="relative mt-10 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {card.slug}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition group-hover:border-primary group-hover:text-primary">
                    {card.buttonLabel}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
