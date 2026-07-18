import { ShopClient } from "@/components/shop-client";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <ShopClient
      initialSearch={params.search ?? ""}
      initialCategory={params.category ?? ""}
      initialSort={params.sort ?? "latest"}
      initialPage={Math.max(1, parseInt(params.page ?? "1", 10))}
    />
  );
}
