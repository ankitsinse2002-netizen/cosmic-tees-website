import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contact Support</p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight">We Can Help</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Questions about orders, sizing, delivery, or returns? Send us a message.
            </p>

            <form className="mt-6 space-y-4" action="#" method="post">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm">
                  <span className="font-medium">First Name</span>
                  <Input name="first_name" required />
                </label>
                <label className="block space-y-2 text-sm">
                  <span className="font-medium">Last Name</span>
                  <Input name="last_name" required />
                </label>
              </div>
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Email</span>
                <Input type="email" name="email" required />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm outline-none"
                />
              </label>
              <Button type="submit" className="h-11 w-full">Send Message</Button>
            </form>
          </div>

          <aside className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Support Channels</h2>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p>
                Email: <a href="mailto:support@cosmictees.co.in" className="text-foreground hover:text-primary">support@cosmictees.co.in</a>
              </p>
              <p>
                Instagram: <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">@cosmictees</a>
              </p>
              <p>
                X: <a href="https://x.com" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">@cosmictees</a>
              </p>
              <p>
                Discord: <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">Cosmic Community</a>
              </p>
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
