import { CategoryGrid } from "@/components/category-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { WooCollectionCategory } from "@/lib/collections";
import { getCuratedCollectionCategories } from "@/lib/collections";

export const dynamic = 'force-dynamic';

const curatedFallback: WooCollectionCategory[] = [
  {
    id: -1,
    slug: "men",
    name: "Men",
    description: "Premium Drop and Essential Series",
    count: 0,
    image: { src: "/category-cosmic.png", alt: "Men collection" },
  },
  {
    id: -2,
    slug: "women",
    name: "Women",
    description: "Premium Drop and Essential Series",
    count: 0,
    image: { src: "/category-anime.png", alt: "Women collection" },
  },
  {
    id: -3,
    slug: "quotes",
    name: "Quotes (Unisex)",
    description: "All quote designs in one collection",
    count: 0,
    image: { src: "/category-quotes.png", alt: "Quotes (Unisex) collection" },
  },
];

export default async function CollectionsPage() {
  const categories = await getCuratedCollectionCategories();
  const finalCategories = categories.length > 0 ? categories : curatedFallback;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CategoryGrid categories={finalCategories} />
      <SiteFooter />
    </main>
  );
}
