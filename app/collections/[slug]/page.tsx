import { notFound } from "next/navigation";

import { CollectionClient } from "@/components/collection-client";
import { CollectionSelectionCards } from "@/components/collection-selection-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getCategoryBySlug,
  getCollectionCategories,
  getCollectionProducts,
  getCuratedCollectionCategories,
  getCollectionRootChildren,
  parseCollectionPage,
  parseCollectionSort,
} from "@/lib/collections";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [
    { slug: "men" },
    { slug: "women" },
    { slug: "quotes" },
  ];
}

function CollectionErrorState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-sm border border-border bg-card p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Collection
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {message}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/shop"
              className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary"
            >
              Browse Shop
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary"
            >
              Back Home
            </a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = parseCollectionPage(query.page);
  const sort = parseCollectionSort(query.sort);

  const categories = await getCollectionCategories();
  const curatedCategories = await getCuratedCollectionCategories();
  const currentCategory = await getCategoryBySlug(slug, categories);

  if (!currentCategory) {
    notFound();
  }

  if (slug === "men" || slug === "women") {
    const childCards = getCollectionRootChildren(slug);

    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <CollectionSelectionCards
          title={currentCategory.name}
          eyebrow="Collection"
          description={currentCategory.description}
          cards={childCards}
          basePath={`/collections/${slug}`}
          imageSrc={currentCategory.image?.src}
          imageAlt={currentCategory.image?.alt || currentCategory.name}
        />
        <SiteFooter />
      </main>
    );
  }

  try {
    console.log("[collections] incoming slug:", slug);
    console.log("[collections] resolved category:", currentCategory?.slug ?? null);

    const categoryIds = [currentCategory.id];
    const collection = await getCollectionProducts(categoryIds, page, sort);
    const normalizedProducts = collection.products.map((product) => ({
      ...product,
      category: currentCategory.name,
    }));

    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <CollectionClient
          categories={curatedCategories}
          currentCategory={currentCategory}
          products={normalizedProducts}
          total={collection.total}
          totalPages={collection.totalPages}
          page={collection.page}
          sort={sort}
          collectionBasePath="/collections"
        />
        <SiteFooter />
      </main>
    );
  } catch (error) {
    if ((error as { digest?: string })?.digest?.includes("NEXT_NOT_FOUND")) {
      throw error;
    }

    console.error("[/collections/[slug]] error:", error);

    return (
      <CollectionErrorState
        title="Collection Unavailable"
        message="We could not load this WooCommerce collection right now. Please try again in a moment."
      />
    );
  }
}
