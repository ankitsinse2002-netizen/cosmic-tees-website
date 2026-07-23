import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-sm border border-border bg-card">
      <div className="aspect-square bg-secondary" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-secondary" />
        <div className="h-4 w-2/3 rounded bg-secondary" />
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-3 w-4/5 rounded bg-secondary" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-16 rounded bg-secondary" />
        </div>
        <div className="h-9 w-full rounded bg-secondary" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8">
          <div className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
            <div className="relative min-h-[220px] animate-pulse bg-secondary/60" />
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-secondary animate-pulse" />
              <div className="h-4 w-28 rounded bg-secondary animate-pulse" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:items-center">
              <div className="h-11 w-52 rounded-md bg-secondary animate-pulse" />
              <div className="h-11 w-44 rounded-md bg-secondary animate-pulse" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>

          <div className="flex justify-center">
            <div className="h-9 w-72 rounded bg-secondary animate-pulse" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}