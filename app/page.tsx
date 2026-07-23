import HomepageClient from "@/components/homepage-client";
import type { WooCollectionCategory } from "@/lib/collections";
import { getCuratedCollectionCategories } from "@/lib/collections";
import { getProducts } from "@/lib/get-products";

export const dynamic = 'force-dynamic';

const homepageCollectionsFallback: WooCollectionCategory[] = [
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

export default async function Page() {
  const products = await getProducts();
  const categories = await getCuratedCollectionCategories();
  const finalCategories =
    categories.length === 3 ? categories : homepageCollectionsFallback;

  return <HomepageClient products={products} categories={finalCategories} />;
}
