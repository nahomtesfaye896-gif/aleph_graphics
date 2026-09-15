import { useEffect, useState } from "react";
import { ArrowRight, Check, Clapperboard, Image as ImageIcon, Palette, PenTool, Wrench, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useLang } from "../i18n/LanguageContext";
import { COURSES, type CourseMeta } from "../data/site";
import { cn } from "../utils/cn";
import { api } from "../lib/api";

const ICONS: Record<string, LucideIcon> = {
  photoshop: ImageIcon,
  illustrator: PenTool,
  graphic: Palette,
  video: Clapperboard,
};

function CourseCard({ course, index }: { course: CourseMeta; index: number }) {
  const { t, lang } = useLang();
  
  // Use localized fields with English fallback
  const name = (lang === "am" && course.nameAm) ? course.nameAm : course.nameEn;
  const tagline = (lang === "am" && course.taglineAm) ? course.taglineAm : course.taglineEn;
  const desc = (lang === "am" && course.descAm) ? course.descAm : course.descEn;
  
  const Icon = ICONS[course.key] || ImageIcon;

  return (
    <Reveal delay={index * 100} className="h-full">
      <a
        href={`#${course.id || course.key}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink-900/5 ring-1 ring-ink-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/15"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.image}
            alt={name}
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
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{tagline}</p>
            <h3 className="mt-1 text-xl font-black leading-tight">{name}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm leading-relaxed text-ink-700/80 line-clamp-3">{desc}</p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/60">{t.courses.fee}</p>
              <p className="text-lg font-black text-ink-900">
                {course.feeEtb || (course as any).feeETB} <span className="text-sm font-bold text-brand-600">ETB</span>
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
  const { t, lang } = useLang();
  
  // Use localized fields with English fallback
  const name = (lang === "am" && course.nameAm) ? course.nameAm : course.nameEn;
  const tagline = (lang === "am" && course.taglineAm) ? course.taglineAm : course.taglineEn;
  const longDesc = (lang === "am" && course.longAm) ? course.longAm : course.longEn;
  const learnItems = (lang === "am" && course.learnAm && course.learnAm.length > 0) ? course.learnAm : (course.learnEn || []);
  
  const Icon = ICONS[course.key] || ImageIcon;
  const reversed = index % 2 === 1;

  return (
    <div id={course.id || course.key} className="scroll-mt-24">
      <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reversed && "lg:[&>*:first-child]:order-2")}>
        <Reveal variant={reversed ? "right" : "left"}>
          <div className="relative">
            <div className={cn("absolute -inset-2 rounded-[2rem] bg-gradient-to-br opacity-25 blur-xl", course.accent)} />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-ink-900/15">
              <img src={course.image} alt={name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-30 mix-blend-multiply", course.accent)} />
            </div>
          </div>
        </Reveal>

        <Reveal variant={reversed ? "left" : "right"} delay={100}>
          <div className={cn("inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white", course.accent)}>
            <Icon className="h-3.5 w-3.5" />
            {tagline}
          </div>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">{name}</h3>
          <p className="mt-4 text-base leading-relaxed text-ink-700/80 sm:text-lg whitespace-pre-wrap">{longDesc}</p>

          {learnItems.length > 0 && (
            <>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">{t.courses.youWillLearn}</p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {learnItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-ink-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {course.tools && course.tools.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-700/60">
                <Wrench className="h-3.5 w-3.5" /> {t.courses.tools}:
              </span>
              {course.tools.map((tool, idx) => (
                <span key={idx} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-800 ring-1 ring-ink-900/5">
                  {tool}
                </span>
              ))}
            </div>
          )}

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
              <span className="font-black text-ink-900">{course.feeEtb || (course as any).feeETB} ETB</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function Courses() {
  const { t } = useLang();
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await api.get<CourseMeta[]>('/courses/');
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(COURSES); // fallback
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses(COURSES); // fallback
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <section id="courses" className="relative bg-white py-20 lg:py-28 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-ink-500 uppercase tracking-widest">Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="courses" className="relative bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.courses.eyebrow} title={t.courses.title} subtitle={t.courses.subtitle} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((c, i) => (
              <CourseCard key={c.id || c.key} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] opacity-60" />
        <div className="relative mx-auto max-w-7xl space-y-24 px-4 sm:px-6 lg:space-y-32 lg:px-8">
          {courses.map((c, i) => (
            <CourseDetail key={c.id || c.key} course={c} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
