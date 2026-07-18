"use client";

import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-context";
import { Hero } from "@/components/hero";
import { ValuesMarquee } from "@/components/values-marquee";
import { ProductGrid } from "@/components/product-grid";
import { CategoryGrid } from "@/components/category-grid";
import { NewArrivals } from "@/components/new-arrivals";
import { BestSellers } from "@/components/best-sellers";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Reviews } from "@/components/reviews";
import { Newsletter } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import type { WooCollectionCategory } from "@/lib/collections";
import type { Product } from "@/lib/products";

export default function HomepageClient({
  products,
  categories,
}: {
  products: Product[];
  categories: WooCollectionCategory[];
}) {
  const { items, addItem, cartCount } = useCart();

  const addToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (product) {
      addItem(product);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader cartCount={cartCount} />

      <Hero />
      <ValuesMarquee />

      <ProductGrid
        products={products}
        addedIds={items.map((item) => item.product.id)}
        onAdd={addToCart}
      />

      <CategoryGrid categories={categories} />

      <NewArrivals
        products={products}
        addedIds={items.map((item) => item.product.id)}
        onAdd={addToCart}
      />

      <BestSellers
        products={products}
        addedIds={items.map((item) => item.product.id)}
        onAdd={addToCart}
      />

      <WhyChooseUs />
      <Reviews />
      <Newsletter />
      <SiteFooter />
    </main>
  );
}