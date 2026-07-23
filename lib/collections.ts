import { unstable_cache } from "next/cache";

import getApi from "./woocommerce";
import { mapWooProduct } from "./mapper";
import {
  getMockCollectionCategories,
  getMockCollectionProducts,
} from "./mock-products";
import type { Product } from "./products";

export const COLLECTION_PER_PAGE = 12;
const REQUEST_TIMEOUT_MS = 10000;

export type WooCollectionCategory = {
  id: number;
  name: string;
  slug: string;
  parent?: number;
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

type MainCollectionKey = "men" | "women" | "quotes";
type MainCollectionChildKey = "premium-drop" | "essential-series";

const curatedCollectionAliases: Record<MainCollectionKey, string[]> = {
  men: ["men", "mens", "men-s", "men-collection", "men-collections"],
  women: [
    "women",
    "womens",
    "women-s",
    "ladies",
    "lady",
    "women-collection",
    "women-collections",
  ],
  quotes: ["quotes", "quote", "quotes-unisex", "unisex-quotes", "quote-collection"],
};

const collectionDisplay: Record<MainCollectionKey, { name: string; description: string }> = {
  men: {
    name: "Men",
    description: "Premium Drop and Essential Series",
  },
  women: {
    name: "Women",
    description: "Premium Drop and Essential Series",
  },
  quotes: {
    name: "Quotes (Unisex)",
    description: "All quote designs in one collection",
  },
};

const collectionChildAliases: Record<MainCollectionChildKey, string[]> = {
  "premium-drop": ["premium-drop", "premium", "premium drop"],
  "essential-series": ["essential-series", "essential", "essential series"],
};

const collectionChildDisplay: Record<
  MainCollectionChildKey,
  {
    name: string;
    subtitle: string;
    description: string;
    buttonLabel: string;
  }
> = {
  "premium-drop": {
    name: "Premium Drop",
    subtitle: "240 GSM Terry Cotton",
    description:
      "Premium oversized collection crafted for maximum comfort and quality.",
    buttonLabel: "Explore Premium",
  },
  "essential-series": {
    name: "Essential Series",
    subtitle: "Everyday Collection",
    description:
      "Comfortable everyday oversized essentials at an affordable price.",
    buttonLabel: "Explore Essentials",
  },
};

const collectionRootChildren: Record<MainCollectionKey, MainCollectionChildKey[]> = {
  men: ["premium-drop", "essential-series"],
  women: ["premium-drop", "essential-series"],
  quotes: [],
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

function normalizeCollectionToken(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-");
}

function matchesAlias(value: string, aliases: string[]) {
  const normalized = normalizeCollectionToken(value);
  return aliases.some((alias) => normalized === normalizeCollectionToken(alias));
}

function resolveMainCollectionKey(slug: string): MainCollectionKey | null {
  const normalizedSlug = normalizeCollectionToken(slug);
  const key = (Object.keys(curatedCollectionAliases) as MainCollectionKey[]).find((candidate) =>
    curatedCollectionAliases[candidate].some(
      (alias) => normalizeCollectionToken(alias) === normalizedSlug,
    ),
  );

  return key ?? null;
}

function resolveCollectionChildKey(slug: string): MainCollectionChildKey | null {
  const normalizedSlug = normalizeCollectionToken(slug);
  const key = (Object.keys(collectionChildAliases) as MainCollectionChildKey[]).find(
    (candidate) =>
      collectionChildAliases[candidate].some(
        (alias) => normalizeCollectionToken(alias) === normalizedSlug,
      ),
  );

  return key ?? null;
}

export function getCollectionChildKeyForCategory(
  category: WooCollectionCategory,
): MainCollectionChildKey | null {
  return (
    resolveCollectionChildKey(category.slug) ??
    resolveCollectionChildKey(category.name) ??
    null
  );
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
    parent: Number(category.parent ?? 0),
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

function toMainCategoryShape(
  key: MainCollectionKey,
  category: WooCollectionCategory,
): WooCollectionCategory {
  const display = collectionDisplay[key];

  return {
    ...category,
    slug: key,
    name: display.name,
    description: category.description || display.description,
  };
}

const getWooCategoriesCached = unstable_cache(
  async (): Promise<WooCollectionCategory[]> => {
    const api = getApi();
    if (!api) {
      return getMockCollectionCategories();
    }

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
    categoryIds: number[],
    page: number,
    sort: CollectionSort,
  ): Promise<CollectionProductsResult> => {
    const api = getApi();
    if (!api) {
      return getMockCollectionProducts({
        categoryIds,
        page,
        perPage: COLLECTION_PER_PAGE,
        sort,
      });
    }

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
        category: categoryIds.join(","),
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
  try {
    return await getWooCategoriesCached();
  } catch (error) {
    console.error("[collections] categories fallback:", error);
    return getMockCollectionCategories();
  }
}

export async function getCategoryBySlug(
  slug: string,
  categories?: WooCollectionCategory[],
) {
  const resolvedCategories = categories ?? (await getCollectionCategories());
  const key = resolveMainCollectionKey(slug);

  if (!key) {
    return null;
  }

  const aliases = curatedCollectionAliases[key];
  const matched =
    resolvedCategories.find((category) => matchesAlias(category.slug, aliases)) ??
    resolvedCategories.find((category) => matchesAlias(category.name, aliases)) ??
    null;

  if (matched) {
    return toMainCategoryShape(key, matched);
  }

  return null;
}

export async function getCuratedCollectionCategories() {
  const categories = await getCollectionCategories();
  const keys: MainCollectionKey[] = ["men", "women", "quotes"];

  const resolved = keys
    .map((key) => {
      const aliases = curatedCollectionAliases[key];
      const matched =
        categories.find((category) => matchesAlias(category.slug, aliases)) ??
        categories.find((category) => matchesAlias(category.name, aliases)) ??
        null;

      return matched ? toMainCategoryShape(key, matched) : null;
    })
    .filter((category): category is WooCollectionCategory => Boolean(category));

  return resolved;
}

export function getCollectionRootChildren(rootSlug: string) {
  const key = resolveMainCollectionKey(rootSlug);
  if (!key) {
    return [];
  }

  return collectionRootChildren[key].map((childKey) => ({
    slug: childKey,
    title: collectionChildDisplay[childKey].name,
    subtitle: collectionChildDisplay[childKey].subtitle,
    description: collectionChildDisplay[childKey].description,
    buttonLabel: collectionChildDisplay[childKey].buttonLabel,
  }));
}

function getFallbackChildCategoryId(
  rootKey: MainCollectionKey,
  childKey: MainCollectionChildKey,
) {
  if (rootKey === "men") {
    return childKey === "premium-drop" ? 111 : 112;
  }

  if (rootKey === "women") {
    return childKey === "premium-drop" ? 121 : 122;
  }

  return 0;
}

export async function getCollectionBranchContext(
  rootSlug: string,
  childSlug?: string,
) {
  const categories = await getCollectionCategories();
  const rootKey = resolveMainCollectionKey(rootSlug);

  if (!rootKey) {
    return {
      categories,
      rootCategory: null,
      childCategory: null,
      childCards: [],
      useMockProducts: false,
    };
  }

  const rootCategory = await getCategoryBySlug(rootSlug, categories);
  const childCards = getCollectionRootChildren(rootKey);

  if (!rootCategory) {
    return {
      categories,
      rootCategory: null,
      childCategory: null,
      childCards,
      useMockProducts: false,
    };
  }

  if (!childSlug) {
    return {
      categories,
      rootCategory,
      childCategory: null,
      childCards,
      useMockProducts: false,
    };
  }

  const childKey = resolveCollectionChildKey(childSlug);
  if (!childKey || !collectionRootChildren[rootKey].includes(childKey)) {
    return {
      categories,
      rootCategory,
      childCategory: null,
      childCards,
    };
  }

  const rootChildren = categories.filter(
    (category) => Number(category.parent ?? 0) === rootCategory.id,
  );
  const matchedCategory =
    rootChildren.find((category) => matchesAlias(category.slug, collectionChildAliases[childKey])) ??
    rootChildren.find((category) => matchesAlias(category.name, collectionChildAliases[childKey])) ??
    null;

  if (matchedCategory) {
    const childCategory = {
      ...matchedCategory,
      slug: childKey,
      name: collectionChildDisplay[childKey].name,
      description: matchedCategory.description || collectionChildDisplay[childKey].description,
    };

    return {
      categories,
      rootCategory,
      childCategory,
      childCards,
      useMockProducts: false,
    };
  }

  const mockCategories = getMockCollectionCategories();
  const childCategory = {
    id: getFallbackChildCategoryId(rootKey, childKey),
    name: collectionChildDisplay[childKey].name,
    slug: childKey,
    parent: rootCategory.id,
    description: collectionChildDisplay[childKey].description,
    count: 0,
  } satisfies WooCollectionCategory;

  return {
    categories,
    rootCategory,
    childCategory,
    childCards,
    useMockProducts: Boolean(childCategory),
  };
}

export function getCollectionProductsForCategory(
  currentCategory: WooCollectionCategory,
  allCategories: WooCollectionCategory[],
) {
  const directChildren = allCategories.filter(
    (category) => Number(category.parent ?? 0) === currentCategory.id,
  );

  const ids = [
    currentCategory.id,
    ...directChildren.map((category) => category.id),
  ];

  return Array.from(new Set(ids));
}

export function getCollectionCategoryIdsForSlug(
  slug: string,
  currentCategory: WooCollectionCategory,
  allCategories: WooCollectionCategory[],
) {
  const key = resolveMainCollectionKey(slug);
  if (!key) {
    return [currentCategory.id];
  }

  const directChildren = allCategories.filter(
    (category) => Number(category.parent ?? 0) === currentCategory.id,
  );

  if (key === "quotes") {
    const queue = [currentCategory.id];
    const ids = new Set<number>([currentCategory.id]);

    while (queue.length > 0) {
      const parentId = queue.shift();
      if (!parentId) {
        continue;
      }

      for (const category of allCategories) {
        if (Number(category.parent ?? 0) === parentId && !ids.has(category.id)) {
          ids.add(category.id);
          queue.push(category.id);
        }
      }
    }

    return Array.from(ids);
  }

  const matchedSubcategories = directChildren.filter(
    (category) =>
      matchesAlias(category.slug, menWomenSubcategoryAliases) ||
      matchesAlias(category.name, menWomenSubcategoryAliases),
  );

  const ids = [
    currentCategory.id,
    ...(matchedSubcategories.length > 0 ? matchedSubcategories : directChildren).map(
      (category) => category.id,
    ),
  ];

  return Array.from(new Set(ids));
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
  categoryIds: number | number[],
  page: number,
  sort: CollectionSort,
) {
  const normalizedCategoryIds = Array.isArray(categoryIds)
    ? categoryIds
    : [categoryIds];

  try {
    return await getCollectionProductsCached(normalizedCategoryIds, page, sort);
  } catch (error) {
    console.error("[collections] products fallback:", error);
    return getMockCollectionProducts({
      categoryIds: normalizedCategoryIds,
      page,
      perPage: COLLECTION_PER_PAGE,
      sort,
    });
  }
}
