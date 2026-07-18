import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { clearSessionCookie } from "@/lib/auth/session";
import { getCurrentUser } from "@/lib/auth/session";

async function logout() {
  "use server";

  await clearSessionCookie();

  redirect("/login");
}

export default async function MyAccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">My Account</p>
          <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-tight">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/my-account/profile" className="inline-flex">
              <Button variant="outline" className="h-11 w-full">Profile</Button>
            </Link>
            <Link href="/my-account/orders" className="inline-flex">
              <Button variant="outline" className="h-11 w-full">Order History</Button>
            </Link>
          </div>

          <form action={logout} className="mt-6">
            <Button type="submit" className="h-11 w-full">Logout</Button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
