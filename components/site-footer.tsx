"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import type { WooCollectionCategory } from "@/lib/collections"

const columns = [
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/my-account/orders" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/" },
      { label: "Privacy", href: "/" },
      { label: "Terms", href: "/" },
    ],
  },
]

export function SiteFooter() {
  const [categories, setCategories] = useState<WooCollectionCategory[]>([])

  useEffect(() => {
    fetch("/api/shop/categories")
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <img
              src="/cosmic-tees-logo.jpeg"
              alt="Cosmic Tees"
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
            />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
              コズミック — Premium heavyweight streetwear for anime heads, JDM
              culture and the terminally online.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="group inline-flex items-center text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    <span className="mr-0 h-px w-0 bg-primary transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      <span className="mr-0 h-px w-0 bg-primary transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Cosmic Tees. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
          </div>
          <p className="text-[10px] tracking-[0.2em]">
            Established In The Void // Powered By WooCommerce
          </p>
        </div>
      </div>
    </footer>
  )
}
