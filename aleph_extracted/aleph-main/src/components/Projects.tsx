import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useLang } from "../i18n/LanguageContext";
import { IMAGES, PROJECT_AUTHORS } from "../data/site";
import { cn } from "../utils/cn";

export function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="relative overflow-hidden bg-ink-900 py-20 text-white lg:py-28">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle={t.projects.subtitle} dark />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {t.projects.items.map((p, i) => (
            <Reveal
              key={p.title}
              variant="scale"
              delay={(i % 4) * 80}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/10",
                i === 0 || i === 5 ? "row-span-2" : "",
              )}
            >
              <img
                src={IMAGES.projects[i]}
                alt={p.title}
                className={cn(
                  "w-full object-cover transition-transform duration-700 group-hover:scale-110",
                  i === 0 || i === 5 ? "h-full min-h-[18rem] sm:min-h-[26rem]" : "aspect-square",
                )}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3.5 transition-transform duration-500 group-hover:translate-y-0 sm:p-5">
                <span className="inline-block rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
                  {p.cat}
                </span>
                <h3 className="mt-2 text-sm font-bold leading-tight sm:text-lg">{p.title}</h3>
                <p className="mt-0.5 text-[11px] text-white/60 sm:text-xs">
                  {t.projects.by} {PROJECT_AUTHORS[i]}
                </p>
              </div>
              <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
