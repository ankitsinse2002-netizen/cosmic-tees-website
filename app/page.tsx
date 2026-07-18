import HomepageClient from "@/components/homepage-client";
import { getCollectionCategories } from "@/lib/collections";
import { getProducts } from "@/lib/get-products";

export default async function Page() {
  const products = await getProducts();
  const categories = await getCollectionCategories();

  return <HomepageClient products={products} categories={categories} />;
}