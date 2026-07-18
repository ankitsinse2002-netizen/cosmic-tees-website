import { CategoryGrid } from "@/components/category-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { WooCollectionCategory } from "@/lib/collections";
import { getCuratedCollectionCategories } from "@/lib/collections";

const curatedFallback: WooCollectionCategory[] = [
  {
    id: -1,
    slug: "cosmic",
    name: "Cosmic",
    description: "Explore collection",
    count: 0,
    image: { src: "/category-cosmic.png", alt: "Cosmic collection" },
  },
  {
    id: -2,
    slug: "anime",
    name: "Anime",
    description: "Explore collection",
    count: 0,
    image: { src: "/category-anime.png", alt: "Anime collection" },
  },
  {
    id: -3,
    slug: "quotes",
    name: "Quotes",
    description: "Explore collection",
    count: 0,
    image: { src: "/category-quotes.png", alt: "Quotes collection" },
  },
  {
    id: -4,
    slug: "trending",
    name: "Trending",
    description: "Explore collection",
    count: 0,
    image: { src: "/category-trending.png", alt: "Trending collection" },
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
