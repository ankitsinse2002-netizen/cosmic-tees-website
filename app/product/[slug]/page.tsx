import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product-detail-client";
import { getProductBySlug } from "@/lib/get-products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
