import { ArrowRight, Award, Briefcase, Sparkles, Star } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { IMAGES } from "../data/site";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="home" className="relative overflow-hidden bg-white pt-[72px]">
      {/* Background decoration */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-sky-300/25 blur-3xl animate-blob [animation-delay:-6s]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            {t.hero.badge}
          </div>

          <h1 className="animate-fade-up mt-6 text-4xl font-black leading-[1.08] tracking-tight text-ink-900 [animation-delay:100ms] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {t.hero.title1}
            <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-ink-700/80 [animation-delay:200ms] sm:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:items-center">
            <a
              href="#register"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-2xl hover:shadow-brand-600/35"
            >
              {t.hero.join}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-7 py-3.5 text-base font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-ink-900 hover:text-white"
            >
              {t.hero.contact}
            </a>
          </div>

          <div className="animate-fade-up mt-8 flex items-center gap-4 [animation-delay:400ms]">
            <div className="flex -space-x-2.5">
              {["AB", "MK", "SG", "YT", "RH"].map((ini, i) => (
                <div
                  key={ini}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow"
                  style={{ background: `hsl(${215 + i * 12}, 80%, ${45 + i * 5}%)` }}
                >
                  {ini}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1.5 text-xs font-bold text-ink-900">4.9/5</span>
              </div>
              <p className="text-xs font-medium text-ink-700/70 sm:text-sm">{t.hero.trusted}</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-6">
          <div className="animate-fade-up relative mx-auto max-w-lg lg:max-w-none [animation-delay:250ms]">
            {/* Frame */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-sky-400 opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl shadow-brand-900/20">
              <img
                src={IMAGES.hero}
                alt="Student designing on a graphics tablet at Aleph Graphics Academy"
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/10 p-3 backdrop-blur-md sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="text-white">
                    <p className="text-sm font-bold">Aleph Graphics Academy</p>
                    <p className="text-xs text-white/80">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
            </div>

            {/* Floating card 1 */}
            <div className="animate-float absolute -left-4 top-8 hidden rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-xl shadow-brand-900/10 backdrop-blur sm:flex sm:items-center sm:gap-3 lg:-left-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">{t.hero.card1}</p>
                <p className="text-xs text-ink-700/70">{t.hero.card1sub}</p>
              </div>
            </div>

            {/* Floating card 2 */}
            <div className="animate-float-slow absolute -right-3 bottom-24 hidden rounded-2xl border border-white/70 bg-ink-900 p-3.5 text-white shadow-xl shadow-brand-900/20 sm:flex sm:items-center sm:gap-3 lg:-right-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{t.hero.card2}</p>
                <p className="text-xs text-white/70">{t.hero.card2sub}</p>
              </div>
            </div>

            {/* Decorative shapes */}
            <div className="absolute -top-6 right-10 h-14 w-14 rotate-12 rounded-2xl border-4 border-brand-500/40" />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="animate-fade-up grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-900/5 bg-ink-900/5 shadow-lg shadow-brand-900/5 [animation-delay:500ms] md:grid-cols-4">
          {t.hero.stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-6 text-center transition-colors hover:bg-brand-50">
              <p className="text-3xl font-black tracking-tight text-brand-700 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-700/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
