import { useEffect, useState } from "react";
import { ArrowRight, Heart, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialIcons";
import { useLang } from "../i18n/LanguageContext";
import { COURSES, type CourseMeta } from "../data/site";
import { getSiteSettings } from "../utils/siteSettings";
import { api } from "../lib/api";

export function CTA() {
  const settings = getSiteSettings();
  const { t } = useLang();
  return (
    <section className="relative bg-white px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal variant="scale" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 px-6 py-14 text-center text-white shadow-2xl shadow-brand-600/30 sm:px-12 lg:py-20">
        <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-ink-900/30 blur-3xl animate-blob [animation-delay:-7s]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{t.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">{t.cta.subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#register" className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl">
              {t.cta.button}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={`tel:${settings.phoneRaw}`} className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
              <Phone className="h-5 w-5" />
              {settings.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const settings = getSiteSettings();
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  const [courses, setCourses] = useState<CourseMeta[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await api.get<CourseMeta[]>('/courses/');
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(COURSES);
        }
      } catch (err) {
        setCourses(COURSES);
      }
    }
    loadCourses();
  }, []);

  const quick = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "courses", label: t.nav.courses },
    { id: "projects", label: t.nav.projects },
    { id: "why", label: t.nav.why },
    { id: "testimonials", label: t.nav.testimonials },
    { id: "register", label: t.nav.join },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-white">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{t.footer.tagline}</p>
            <SocialLinks className="mt-6" size="sm" itemClassName="bg-white/10 text-white" />
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">{t.footer.quick}</h4>
            <ul className="mt-5 space-y-2.5">
              {quick.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">{t.footer.coursesTitle}</h4>
            <ul className="mt-5 space-y-2.5">
              {courses.map((c) => {
                const name = (lang === "am" && c.nameAm) ? c.nameAm : c.nameEn;
                return (
                  <li key={c.id || c.key}>
                    <a href={`#${c.id || c.key}`} className="text-sm text-white/70 transition-colors hover:text-white">
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">{t.footer.contactTitle}</h4>
            <ul className="mt-5 space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{settings.addressEn || t.contact.addressValue}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${settings.phoneRaw}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} Aleph Graphics Academy. {t.footer.rights}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t.footer.made} <Heart className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
            <span className="ml-1 inline-flex overflow-hidden rounded-sm">
              <span className="h-2.5 w-2 bg-[#078930]" />
              <span className="h-2.5 w-2 bg-[#FCDD09]" />
              <span className="h-2.5 w-2 bg-[#DA121A]" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
