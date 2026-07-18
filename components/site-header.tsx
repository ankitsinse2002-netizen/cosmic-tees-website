"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Menu, X, Search, User } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/#categories" },
]

export function SiteHeader({ cartCount: cartCountProp }: { cartCount?: number }) {
  const { cartCount: cartCountFromContext } = useCart()
  const cartCount = cartCountFromContext ?? cartCountProp ?? 0
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/60 bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 md:px-6",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <a href="/" className="group flex items-center gap-2.5" aria-label="Cosmic Tees home">
          <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/70 bg-black transition-transform duration-300 group-hover:scale-105">
            <img
              src="/cosmic-tees-logo.jpeg"
              alt="Cosmic Tees logo"
              className="absolute max-w-none"
              style={{ width: "128px", left: "-46px", top: "-8px" }}
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-extrabold uppercase italic tracking-tight text-foreground">
              Cosmic Tees
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-primary">
              コズミック
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-10 w-10 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-[18px] w-[18px]" />
          </Button>
          <a
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </a>
          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/60 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
