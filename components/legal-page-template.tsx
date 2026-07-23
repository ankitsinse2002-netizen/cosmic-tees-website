import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export function LegalPageTemplate({
  eyebrow,
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageTemplateProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Effective Date: {effectiveDate}
          </p>

          <nav
            aria-label="Policy sections"
            className="mt-8 rounded-2xl border border-border/70 bg-background/70 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">On this page</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-4">
            {sections.map((section) => (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-24 rounded-2xl border border-border/70 bg-background/70 p-5 sm:p-6"
              >
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight">{section.title}</h2>
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="mt-3 text-sm leading-6 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
