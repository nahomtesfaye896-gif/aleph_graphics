import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "../i18n/LanguageContext";
import { cn } from "../utils/cn";

export function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const links = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "courses", label: t.nav.courses },
    { id: "projects", label: t.nav.projects },
    { id: "why", label: t.nav.why },
    { id: "testimonials", label: t.nav.testimonials },
    { id: "contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/85 shadow-[0_2px_20px_rgba(15,23,42,0.08)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                active === l.id ? "text-brand-700" : "text-ink-700 hover:text-brand-700",
              )}
            >
              {l.label}
              <span
                className={cn(
                  "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-600 transition-transform duration-300 origin-left",
                  active === l.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink-900/10 bg-white/70 px-3 text-sm font-semibold text-ink-800 backdrop-blur transition-all hover:border-brand-500 hover:text-brand-700"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span lang={lang === "en" ? "am" : "en"}>{t.nav.switchLang}</span>
          </button>
          <a
            href="#register"
            className="hidden h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30 sm:inline-flex"
          >
            {t.nav.join}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white/70 text-ink-900 backdrop-blur lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white transition-all duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex h-full flex-col gap-1 overflow-y-auto px-6 py-6" aria-label="Mobile">
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={cn(
                "rounded-xl px-4 py-3.5 text-lg font-semibold transition-all duration-300",
                open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                active === l.id ? "bg-brand-50 text-brand-700" : "text-ink-800 hover:bg-slate-50",
              )}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-ink-900 text-sm font-semibold text-ink-900"
            >
              {t.nav.contactUs}
            </a>
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/25"
            >
              {t.nav.join}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
