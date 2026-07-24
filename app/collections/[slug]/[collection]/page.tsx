import { notFound } from "next/navigation";

import { CollectionClient } from "@/components/collection-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  type WooCollectionCategory,
  getCollectionBranchContext,
  getCollectionProducts,
  parseCollectionPage,
  parseCollectionSort,
} from "@/lib/collections";

type PageProps = {
  params: Promise<{ slug: string; collection: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    { slug: "men", collection: "premium-drop" },
    { slug: "men", collection: "essential-series" },
    { slug: "women", collection: "premium-drop" },
    { slug: "women", collection: "essential-series" },
  ];
}

export default async function CollectionChildPage({ params, searchParams }: PageProps) {
  const { slug, collection } = await params;
  const query = await searchParams;
  const page = parseCollectionPage(query.page);
  const sort = parseCollectionSort(query.sort);

  const { rootCategory, childCategory, childCards } = await getCollectionBranchContext(
    slug,
    collection,
  );

  if (!rootCategory || !childCategory) {
    notFound();
  }

  const collectionProducts = await getCollectionProducts([childCategory.id], page, sort);
  const siblingCollectionOptions: WooCollectionCategory[] = childCards.map((card, index) => ({
    id: index + 1,
    slug: card.slug,
    name: card.title,
    description: card.subtitle,
    count: 0,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CollectionClient
        categories={siblingCollectionOptions}
        currentCategory={childCategory}
        products={collectionProducts.products.map((product) => ({
          ...product,
          category: childCategory.name,
        }))}
        total={collectionProducts.total}
        totalPages={collectionProducts.totalPages}
        page={collectionProducts.page}
        sort={sort}
        collectionBasePath={`/collections/${slug}`}
      />
      <SiteFooter />
    </main>
  );
}
