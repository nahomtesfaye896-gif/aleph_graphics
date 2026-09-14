import { CheckCircle2, Eye, Target } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n/LanguageContext";
import { IMAGES } from "../data/site";

export function About() {
  const { t } = useLang();

  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Images */}
        <Reveal variant="left" className="relative">
          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] shadow-2xl shadow-brand-900/15">
              <img
                src={IMAGES.about}
                alt="Students collaborating on a design project"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 w-2/5 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:-right-8">
              <img src={IMAGES.classroom} alt="Computer lab classroom" className="aspect-square w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -left-4 -top-4 rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-xl shadow-brand-600/30 sm:-left-8">
              <p className="text-3xl font-black leading-none">6+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-100">Years</p>
            </div>
            <div className="absolute -z-10 -left-6 -bottom-6 h-40 w-40 rounded-full border-[14px] border-brand-100" />
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              {t.about.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              {t.about.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-700/80 sm:text-lg">{t.about.p1}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-700/80 sm:text-lg">{t.about.p2}</p>
          </Reveal>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {t.about.points.map((p, i) => (
              <Reveal key={p} delay={i * 80} as="li" className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-ink-900/5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span className="text-sm font-medium text-ink-800">{p}</span>
              </Reveal>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={100} className="group rounded-2xl bg-ink-900 p-5 text-white transition-transform hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold">{t.about.mission}</h3>
              <p className="mt-1 text-sm text-white/70">{t.about.missionText}</p>
            </Reveal>
            <Reveal delay={200} className="group rounded-2xl bg-brand-600 p-5 text-white transition-transform hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold">{t.about.vision}</h3>
              <p className="mt-1 text-sm text-white/80">{t.about.visionText}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
