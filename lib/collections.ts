import { unstable_cache } from "next/cache";

import getApi from "./woocommerce";
import { mapWooProduct } from "./mapper";
import type { Product } from "./products";

export const COLLECTION_PER_PAGE = 12;
const REQUEST_TIMEOUT_MS = 10000;

export type WooCollectionCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image?: {
    id?: number;
    src?: string;
    alt?: string;
  };
};

export type CollectionSort = "latest" | "price_asc" | "price_desc";

export type CollectionProductsResult = {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
};

const curatedCollectionAliases: Record<string, string[]> = {
  cosmic: ["cosmic"],
  anime: ["anime"],
  quotes: ["quotes", "quote"],
  trending: ["trending", "trending-drops", "trending-dropss", "trending drops"],
};

export function parseCollectionSort(value?: string): CollectionSort {
  if (value === "price_asc" || value === "price_desc") {
    return value;
  }

  return "latest";
}

export function parseCollectionPage(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function stripHtml(value?: string) {
  return value?.replace(/<[^>]*>/g, "").trim() ?? "";
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }) as Promise<T>;
}

function readHeader(headers: unknown, key: string) {
  if (!headers || typeof headers !== "object") {
    return undefined;
  }

  const record = headers as Record<string, string | undefined>;

  return record[key] ?? record[key.toLowerCase()] ?? record[key.toUpperCase()];
}

function mapCategory(category: any): WooCollectionCategory {
  return {
    id: Number(category.id),
    name: String(category.name ?? ""),
    slug: String(category.slug ?? ""),
    description: stripHtml(category.description),
    count: Number(category.count ?? 0),
    image: category.image
      ? {
          id: category.image.id,
          src: category.image.src,
          alt: category.image.alt,
        }
      : undefined,
  };
}

const getWooCategoriesCached = unstable_cache(
  async (): Promise<WooCollectionCategory[]> => {
    const api = getApi();
    const response = await withTimeout(
      api.get("products/categories", {
        hide_empty: false,
        per_page: 100,
        orderby: "count",
        order: "desc",
      }),
    );

    return (response.data as any[]).map(mapCategory);
  },
  ["woo-collection-categories"],
  { revalidate: 300 },
);

const getCollectionProductsCached = unstable_cache(
  async (
    categoryId: number,
    page: number,
    sort: CollectionSort,
  ): Promise<CollectionProductsResult> => {
    const api = getApi();
    let orderby = "date";
    let order: "asc" | "desc" = "desc";

    if (sort === "price_asc") {
      orderby = "price";
      order = "asc";
    } else if (sort === "price_desc") {
      orderby = "price";
      order = "desc";
    }

    const response = await withTimeout(
      api.get("products", {
        status: "publish",
        category: categoryId,
        per_page: COLLECTION_PER_PAGE,
        page,
        orderby,
        order,
      }),
    );

    const total = Number(readHeader(response.headers, "x-wp-total") ?? 0);
    const totalPages = Number(
      readHeader(response.headers, "x-wp-totalpages") ?? 1,
    );

    return {
      products: (response.data as any[]).map(mapWooProduct),
      total,
      totalPages,
      page,
      perPage: COLLECTION_PER_PAGE,
    };
  },
  ["woo-collection-products"],
  { revalidate: 60 },
);

export async function getCollectionCategories() {
  return getWooCategoriesCached();
}

export async function getCategoryBySlug(
  slug: string,
  categories?: WooCollectionCategory[],
) {
  const resolvedCategories = categories ?? (await getCollectionCategories());

  const exact = resolvedCategories.find((category) => category.slug === slug) ?? null;
  if (exact) {
    return exact;
  }

  const aliasKey = Object.keys(curatedCollectionAliases).find((key) =>
    curatedCollectionAliases[key].includes(slug.toLowerCase()),
  );

  if (aliasKey) {
    const matched = resolvedCategories.find((category) => {
      const lowered = category.slug.toLowerCase();
      const name = category.name.toLowerCase();
      return (
        curatedCollectionAliases[aliasKey].includes(lowered) ||
        curatedCollectionAliases[aliasKey].some((token) => name.includes(token))
      );
    });

    if (matched) {
      return matched;
    }
  }

  return null;
}

export async function getCuratedCollectionCategories() {
  const categories = await getCollectionCategories();
  const keys = ["cosmic", "anime", "quotes", "trending"] as const;

  const resolved = keys
    .map((key) => {
      const aliases = curatedCollectionAliases[key];
      return (
        categories.find((category) => aliases.includes(category.slug.toLowerCase())) ||
        categories.find((category) => aliases.some((token) => category.name.toLowerCase().includes(token))) ||
        null
      );
    })
    .filter((category): category is WooCollectionCategory => Boolean(category));

  return resolved;
}

export async function getCollectionContext(slug: string) {
  const categories = await getCollectionCategories();
  const currentCategory = await getCategoryBySlug(slug, categories);

  return {
    categories,
    currentCategory,
  };
}

export async function getCollectionProducts(
  categoryId: number,
  page: number,
  sort: CollectionSort,
) {
  return getCollectionProductsCached(categoryId, page, sort);
}
