import { Award, BadgeDollarSign, CalendarClock, FolderKanban, GraduationCap, Rocket, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useLang } from "../i18n/LanguageContext";
import { IMAGES } from "../data/site";

const ICONS: LucideIcon[] = [GraduationCap, FolderKanban, Award, CalendarClock, BadgeDollarSign, Rocket];

export function WhyChooseUs() {
  const { t } = useLang();

  return (
    <section id="why" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.why.eyebrow} title={t.why.title} />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Image column */}
          <Reveal variant="left" className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-[1.75rem] shadow-2xl shadow-brand-900/15">
                <img src={IMAGES.student} alt="Focused student in the Aleph Graphics lab" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-4xl font-black">85%</p>
                  <p className="mt-1 text-sm font-medium text-white/85">{t.hero.stats[2].label}</p>
                </div>
              </div>
              <div className="absolute -right-4 top-8 h-24 w-24 rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/30 sm:-right-8" />
            </div>
          </Reveal>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {t.why.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal
                  key={item.title}
                  delay={i * 80}
                  className="group relative overflow-hidden rounded-2xl border border-ink-900/5 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-xl hover:shadow-brand-900/10"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-600/5 transition-transform duration-500 group-hover:scale-[3]" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-white transition-colors duration-300 group-hover:bg-brand-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-ink-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700/75">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
