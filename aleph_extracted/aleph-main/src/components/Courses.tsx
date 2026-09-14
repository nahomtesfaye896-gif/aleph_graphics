import { ArrowRight, Check, Clapperboard, Clock, Image as ImageIcon, Palette, PenTool, Signal, Wrench, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useLang } from "../i18n/LanguageContext";
import { COURSES, type CourseKey, type CourseMeta } from "../data/site";
import { cn } from "../utils/cn";

const ICONS: Record<CourseKey, LucideIcon> = {
  photoshop: ImageIcon,
  illustrator: PenTool,
  graphic: Palette,
  video: Clapperboard,
};

function CourseCard({ course, index }: { course: CourseMeta; index: number }) {
  const { t } = useLang();
  const info = t.courses.items[course.key];
  const Icon = ICONS[course.key];

  return (
    <Reveal delay={index * 100} className="h-full">
      <a
        href={`#${course.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink-900/5 ring-1 ring-ink-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/15"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.image}
            alt={info.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-t opacity-80 mix-blend-multiply", course.accent)} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
          <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
            <Icon className="h-5 w-5" />
          </div>
          {course.popular && (
            <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 shadow">
              {t.courses.popular}
            </span>
          )}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{info.tagline}</p>
            <h3 className="mt-1 text-xl font-black leading-tight">{info.name}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm leading-relaxed text-ink-700/80">{info.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-ink-700/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-600" />
              {course.weeks} {t.courses.weeks}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Signal className="h-4 w-4 text-brand-600" />
              {t.courses.levels[course.level]}
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/60">{t.courses.fee}</p>
              <p className="text-lg font-black text-ink-900">
                {course.feeETB} <span className="text-sm font-bold text-brand-600">ETB</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-all group-hover:gap-2.5">
              {t.courses.learnMore}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

function CourseDetail({ course, index }: { course: CourseMeta; index: number }) {
  const { t } = useLang();
  const info = t.courses.items[course.key];
  const Icon = ICONS[course.key];
  const reversed = index % 2 === 1;

  return (
    <div id={course.id} className="scroll-mt-24">
      <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reversed && "lg:[&>*:first-child]:order-2")}>
        <Reveal variant={reversed ? "right" : "left"}>
          <div className="relative">
            <div className={cn("absolute -inset-2 rounded-[2rem] bg-gradient-to-br opacity-25 blur-xl", course.accent)} />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-ink-900/15">
              <img src={course.image} alt={info.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-30 mix-blend-multiply", course.accent)} />
            </div>
            <div className={cn("absolute -bottom-5 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl ring-1 ring-ink-900/5", reversed ? "-right-3 sm:-right-6" : "-left-3 sm:-left-6")}>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white", course.accent)}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/60">{t.courses.duration}</p>
                <p className="text-sm font-black text-ink-900">
                  {course.weeks} {t.courses.weeks}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant={reversed ? "left" : "right"} delay={100}>
          <div className={cn("inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white", course.accent)}>
            <Icon className="h-3.5 w-3.5" />
            {info.tagline}
          </div>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">{info.name}</h3>
          <p className="mt-4 text-base leading-relaxed text-ink-700/80 sm:text-lg">{info.long}</p>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{t.courses.youWillLearn}</p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {info.learn.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-ink-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-700/60">
              <Wrench className="h-3.5 w-3.5" /> {t.courses.tools}:
            </span>
            {course.tools.map((tool) => (
              <span key={tool} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-800 ring-1 ring-ink-900/5">
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#register"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {t.courses.enroll}
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="text-sm">
              <span className="text-ink-700/60">{t.courses.fee}: </span>
              <span className="font-black text-ink-900">{course.feeETB} ETB</span>
              <span className="mx-2 text-ink-900/20">|</span>
              <span className="text-ink-700/60">{t.courses.level}: </span>
              <span className="font-bold text-ink-900">{t.courses.levels[course.level]}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function Courses() {
  const { t } = useLang();

  return (
    <>
      <section id="courses" className="relative bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.courses.eyebrow} title={t.courses.title} subtitle={t.courses.subtitle} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {COURSES.map((c, i) => (
              <CourseCard key={c.key} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] opacity-60" />
        <div className="relative mx-auto max-w-7xl space-y-24 px-4 sm:px-6 lg:space-y-32 lg:px-8">
          {COURSES.map((c, i) => (
            <CourseDetail key={c.key} course={c} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
