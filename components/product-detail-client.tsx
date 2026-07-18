"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format-currency";
import type { Product } from "@/lib/products";

type ProductDetailClientProps = {
  product: Product;
};

function formatStockStatus(value?: string) {
  if (!value) {
    return "In stock";
  }

  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, cartCount } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const hasSale = Boolean(product.compareAt && product.compareAt > product.price);
  const description = product.description?.trim() || product.blurb || "";
  const galleryImages = product.gallery ?? [];

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, quantity);
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader cartCount={cartCount} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <ProductGallery images={galleryImages} fallback={product.image} />
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                {hasSale ? (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                    Sale
                  </span>
                ) : null}
                {product.tag ? (
                  <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {product.tag}
                  </span>
                ) : null}
                <span className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {product.category}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
                  {product.name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAt && product.compareAt > product.price ? (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">SKU</p>
                  <p className="mt-1 font-medium text-foreground">
                    {product.sku || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="mt-1 font-medium text-foreground">
                    {formatStockStatus(product.stockStatus)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                    Choose size
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/80 bg-background text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="flex-1 sm:flex-none" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 sm:flex-none" onClick={handleBuyNow}>
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                <h3 className="text-lg font-semibold">Product Features</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>• Premium heavyweight cotton for a refined streetwear feel</li>
                  <li>• Durable print finish built for daily wear</li>
                  <li>• Relaxed silhouette with effortless all-day comfort</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                <h3 className="text-lg font-semibold">Shipping</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>• Ships within 24–48 hours</li>
                  <li>• Free shipping on orders over ₹999</li>
                  <li>• Easy exchanges and returns for a stress-free fit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 rounded-3xl border border-border/70 bg-card/50 p-8">
          <h2 className="text-2xl font-semibold">Related Products</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            More drops and matching pieces will appear here as the catalog grows.
          </p>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
