import type { Product } from "@/lib/products";

export type MockCatalogProduct = {
  id: number;
  slug: string;
  name: string;
  price: string;
  sale_price: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  featured: boolean;
};

type CategoryMeta = {
  id: number;
  slug: string;
  name: string;
  image: string;
  parent?: number;
};

const categoryMeta: CategoryMeta[] = [
  { id: 101, slug: "men", name: "Men", image: "/category-cosmic.png" },
  {
    id: 111,
    slug: "men-premium-drop",
    name: "Premium Drop",
    image: "/category-cosmic.png",
    parent: 101,
  },
  {
    id: 112,
    slug: "men-essential-series",
    name: "Essential Series",
    image: "/category-cosmic.png",
    parent: 101,
  },
  { id: 102, slug: "women", name: "Women", image: "/category-anime.png" },
  {
    id: 121,
    slug: "women-premium-drop",
    name: "Premium Drop",
    image: "/category-anime.png",
    parent: 102,
  },
  {
    id: 122,
    slug: "women-essential-series",
    name: "Essential Series",
    image: "/category-anime.png",
    parent: 102,
  },
  { id: 103, slug: "quotes", name: "Quotes (Unisex)", image: "/category-quotes.png" },
];

const categoryAliases: Record<string, string> = {
  men: "men",
  mens: "men",
  "men-premium-drop": "men-premium-drop",
  "men-premium": "men-premium-drop",
  "men-essential-series": "men-essential-series",
  "men-essential": "men-essential-series",
  women: "women",
  womens: "women",
  ladies: "women",
  "women-premium-drop": "women-premium-drop",
  "women-premium": "women-premium-drop",
  "women-essential-series": "women-essential-series",
  "women-essential": "women-essential-series",
  quotes: "quotes",
  quote: "quotes",
  "quotes-unisex": "quotes",
};

const fallbackCatalog: MockCatalogProduct[] = [
  {
    id: 1001,
    slug: "cosmic-eclipse-tee",
    name: "Cosmic Eclipse Tee",
    price: "1099",
    sale_price: "749",
    image: "/product-cosmic-eclipse.png",
    category: "Men Premium Drop",
    description: "Oversized crimson eclipse artwork printed on premium heavyweight black cotton.",
    rating: 4.8,
    stock_status: "instock",
    featured: true,
  },
  {
    id: 1002,
    slug: "anime-overdrive-graphic",
    name: "Anime Overdrive Graphic",
    price: "1099",
    sale_price: "699",
    image: "/product-anime-graphic.png",
    category: "Men Essential Series",
    description: "Neon anime panel graphic with soft-touch print made for daily streetwear fits.",
    rating: 4.9,
    stock_status: "instock",
    featured: true,
  },
  {
    id: 1003,
    slug: "manifest-quote-tee",
    name: "Manifest Quote Tee",
    price: "999",
    sale_price: "699",
    image: "/product-quotes-tee.png",
    category: "Quotes",
    description: "Statement typography tee with breathable fabric and crisp durable lettering.",
    rating: 4.7,
    stock_status: "instock",
    featured: true,
  },
  {
    id: 1004,
    slug: "acid-wash-limited",
    name: "Acid Wash Limited",
    price: "1499",
    sale_price: "999",
    image: "/product-acid-wash.png",
    category: "Women Premium Drop",
    description: "Hand-finished acid-wash treatment with a relaxed drop-shoulder silhouette.",
    rating: 4.8,
    stock_status: "instock",
    featured: true,
  },
  {
    id: 1005,
    slug: "neo-tokyo-graphic",
    name: "Neo Tokyo Graphic",
    price: "1199",
    sale_price: "799",
    image: "/product-neo-tokyo.png",
    category: "Women Essential Series",
    description: "Katakana-driven city graphic inspired by late-night neon expressways.",
    rating: 4.6,
    stock_status: "instock",
    featured: false,
  },
  {
    id: 1006,
    slug: "void-rebel-quote-tee",
    name: "Void Rebel Quote Tee",
    price: "949",
    sale_price: "649",
    image: "/product-void-rebel.png",
    category: "Quotes",
    description: "Minimal red statement graphic with a washed texture and modern oversized fit.",
    rating: 4.5,
    stock_status: "instock",
    featured: false,
  },
  {
    id: 1007,
    slug: "shadow-monk-tee",
    name: "Shadow Monk Tee",
    price: "1349",
    sale_price: "899",
    image: "/product-shadow-monk.png",
    category: "Men Premium Drop",
    description: "Mystic lunar art layered with distressed ink on ultra-soft combed cotton.",
    rating: 4.7,
    stock_status: "instock",
    featured: false,
  },
  {
    id: 1008,
    slug: "jdm-drift-tee",
    name: "JDM Drift Tee",
    price: "1199",
    sale_price: "799",
    image: "/product-jdm-drift.png",
    category: "Women Essential Series",
    description: "Street-racing inspired back print with high-contrast lines and comfort stretch.",
    rating: 4.8,
    stock_status: "instock",
    featured: false,
  },
];

function toCategorySlug(value: string) {
  const normalized = value.toLowerCase().trim().replace(/\s+/g, "-");
  return categoryAliases[normalized] ?? normalized;
}

function getDescendantCategorySlugs(parentId: number) {
  const slugs: string[] = [];
  const queue = [parentId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) {
      continue;
    }

    const children = categoryMeta.filter(
      (category) => Number(category.parent ?? 0) === currentId,
    );

    for (const child of children) {
      slugs.push(child.slug);
      queue.push(child.id);
    }
  }

  return slugs;
}

function toProduct(item: MockCatalogProduct): Product {
  const basePrice = Number(item.price) || 0;
  const salePrice = Number(item.sale_price) || 0;
  const finalPrice = salePrice > 0 ? salePrice : basePrice;

  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    sku: `CT-${item.id}`,
    category: item.category,
    katakana: "",
    price: finalPrice,
    compareAt: salePrice > 0 && basePrice > finalPrice ? basePrice : undefined,
    tag: item.featured ? "Featured" : salePrice > 0 ? "Sale" : undefined,
    image: item.image,
    gallery: [{ src: item.image, alt: item.name }],
    blurb: item.description,
    description: item.description,
    stockStatus: item.stock_status,
    featured: item.featured,
    isNew: item.id >= 1005,
    bestseller: item.rating >= 4.8,
  };
}

function sortProducts(items: Product[], sort: "latest" | "price_asc" | "price_desc") {
  if (sort === "price_asc") {
    return [...items].sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    return [...items].sort((a, b) => b.price - a.price);
  }

  return [...items].sort((a, b) => Number(b.id) - Number(a.id));
}

export function getMockApiProducts() {
  return fallbackCatalog.map((item) => ({ ...item }));
}

export function getMockProducts() {
  return fallbackCatalog.map(toProduct);
}

export function getMockFeaturedProducts(limit = 8) {
  return getMockProducts().filter((item) => item.featured).slice(0, limit);
}

export function getMockProductBySlug(slug: string) {
  const bySlug = getMockProducts().find((item) => item.slug === slug) ?? null;
  if (bySlug) {
    return bySlug;
  }

  return getMockProducts().find((item) => item.id === slug) ?? null;
}

export function getMockCollectionCategories() {
  const products = getMockProducts();

  return categoryMeta.map((category) => {
    const collectionSlugs = [category.slug, ...getDescendantCategorySlugs(category.id)];
    const count = products.filter((product) =>
      collectionSlugs.includes(toCategorySlug(product.category)),
    ).length;

    const description =
      category.slug === "men" || category.slug === "women"
        ? "Premium Drop and Essential Series"
        : category.slug === "quotes"
          ? "All quote designs in one collection"
          : `Explore ${category.name} collection`;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      description,
      count,
      image: {
        src: category.image,
        alt: `${category.name} collection`,
      },
    };
  });
}

export function getMockCategoryById(id: number) {
  return getMockCollectionCategories().find((category) => category.id === id) ?? null;
}

export function getMockCategoryBySlug(slug: string) {
  return getMockCollectionCategories().find((category) => category.slug === toCategorySlug(slug)) ?? null;
}

export function getMockCollectionProducts({
  page,
  perPage,
  sort,
  search,
  categoryId,
  categoryIds,
}: {
  page: number;
  perPage: number;
  sort: "latest" | "price_asc" | "price_desc";
  search?: string;
  categoryId?: number;
  categoryIds?: number[];
}) {
  const categories = getMockCollectionCategories();
  const selectedCategoryIds = categoryIds?.length
    ? categoryIds
    : categoryId
      ? [categoryId]
      : [];

  const categorySlugSet = new Set<string>();
  for (const selectedId of selectedCategoryIds) {
    const category = categories.find((item) => item.id === selectedId);
    if (!category) {
      continue;
    }

    categorySlugSet.add(category.slug);
    for (const descendantSlug of getDescendantCategorySlugs(category.id)) {
      categorySlugSet.add(descendantSlug);
    }
  }

  const normalizedSearch = search?.trim().toLowerCase() ?? "";

  let products = getMockProducts();

  if (categorySlugSet.size > 0) {
    products = products.filter((product) =>
      categorySlugSet.has(toCategorySlug(product.category)),
    );
  }

  if (normalizedSearch) {
    products = products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }

  const sorted = sortProducts(products, sort);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * perPage;
  const paged = sorted.slice(start, start + perPage);

  return {
    products: paged,
    total,
    totalPages,
    page: safePage,
    perPage,
  };
}