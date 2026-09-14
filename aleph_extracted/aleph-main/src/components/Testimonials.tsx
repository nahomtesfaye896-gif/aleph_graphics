import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Loader2, MessageSquarePlus, Quote, Send, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useLang } from "../i18n/LanguageContext";
import { cn } from "../utils/cn";
import { addStudentComment, fetchStudentCommentsFromSupabase, getStudentComments, persistCommentsLocal } from "../utils/siteSettings";

const COLORS = ["from-brand-500 to-brand-700", "from-sky-500 to-blue-600", "from-indigo-500 to-brand-700", "from-blue-600 to-ink-900"];

interface TestimonialItem {
  key: string;
  name: string;
  role: string;
  text: string;
}

export function Testimonials() {
  const { t, lang } = useLang();
  const [studentItems, setStudentItems] = useState<TestimonialItem[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [cName, setCName] = useState("");
  const [cRole, setCRole] = useState("");
  const [cText, setCText] = useState("");
  const [cErrors, setCErrors] = useState<{ name?: string; text?: string }>({});
  const [cStatus, setCStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    let cancelled = false;
    const apply = (comments: Awaited<ReturnType<typeof getStudentComments>>) => {
      if (cancelled) return;
      setStudentItems(comments.filter((c) => c.approved).map((c) => ({ key: c.id, name: c.name, role: c.role, text: c.text })));
    };
    fetchStudentCommentsFromSupabase()
      .then((remote) => {
        if (remote) {
          persistCommentsLocal(remote);
          apply(remote);
        } else {
          apply(getStudentComments());
        }
      })
      .catch(() => apply(getStudentComments()));
    return () => {
      cancelled = true;
    };
  }, []);

  const items: TestimonialItem[] = [
    ...studentItems,
    ...t.testimonials.items.map((item, i) => ({ key: `static-${i}`, name: item.name, role: item.role, text: item.text })),
  ];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  const go = (dir: number) => setIndex((i) => (i + dir + items.length) % items.length);

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; text?: string } = {};
    if (cName.trim().length < 2) errors.name = lang === "am" ? "እባክዎ ስምዎን ያስገቡ" : "Please enter your name";
    if (cText.trim().length < 5) errors.text = lang === "am" ? "እባክዎ አስተያየትዎን ያስገቡ" : "Please write your comment";
    setCErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCStatus("sending");
    window.setTimeout(() => {
      try {
        addStudentComment({
          name: cName.trim(),
          role: cRole.trim(),
          text: cText.trim(),
        });
      } catch (_) {}
      setCStatus("done");
    }, 500);
  };

  const inputCls = (hasError?: string) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-700/40 focus:ring-4",
      hasError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-ink-900/10 focus:border-brand-500 focus:ring-brand-100",
    );

  return (
    <section id="testimonials" className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} />

        {/* Desktop grid */}
        <div className="mt-14 hidden gap-6 lg:grid lg:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 100} className="group relative rounded-3xl bg-white p-8 shadow-lg shadow-ink-900/5 ring-1 ring-ink-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/10">
              <Quote className="absolute right-8 top-8 h-10 w-10 text-brand-100 transition-colors group-hover:text-brand-200" />
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-ink-800">“{item.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white", COLORS[i % COLORS.length])}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-ink-900">{item.name}</p>
                  <p className="text-sm text-ink-700/70">{item.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile carousel */}
        <Reveal className="mt-12 lg:hidden">
          <div
            className="relative overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-ink-900/5"
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
              {items.map((item, i) => (
                <div key={item.key} className="w-full shrink-0 p-7">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-ink-800">“{item.text}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white", COLORS[i % COLORS.length])}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-ink-900">{item.name}</p>
                      <p className="text-sm text-ink-700/70">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={cn("h-2 rounded-full transition-all", i === index ? "w-7 bg-brand-600" : "w-2 bg-ink-900/20")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-ink-900/10 transition hover:bg-brand-600 hover:text-white" aria-label="Previous">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-ink-900/10 transition hover:bg-brand-600 hover:text-white" aria-label="Next">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Student comment form */}
        <Reveal className="mt-14">
          <div className="mx-auto max-w-2xl rounded-3xl border border-ink-900/5 bg-white p-7 shadow-lg shadow-ink-900/5 sm:p-9">
            {cStatus === "done" ? (
              <div className="text-center py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <MessageSquarePlus className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-xl font-black text-ink-900">{t.comments.success}</h4>
                <button
                  type="button"
                  onClick={() => {
                    setCName("");
                    setCRole("");
                    setCText("");
                    setCErrors({});
                    setCStatus("idle");
                  }}
                  className="mt-5 text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
                >
                  {t.comments.another}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <MessageSquarePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-ink-900">{t.comments.sectionTitle}</h3>
                    <p className="text-sm text-ink-700/70">{t.comments.subtitle}</p>
                  </div>
                </div>

                <form onSubmit={handleCommentSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.comments.name} <span className="text-red-500">*</span>
                    </label>
                    <input id="c-name" value={cName} onChange={(e) => setCName(e.target.value)} placeholder={t.comments.namePh} className={inputCls(cErrors.name)} autoComplete="name" />
                    {cErrors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{cErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-role" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.comments.role}
                    </label>
                    <input id="c-role" value={cRole} onChange={(e) => setCRole(e.target.value)} placeholder={t.comments.rolePh} className={inputCls()} autoComplete="organization-title" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-text" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.comments.text} <span className="text-red-500">*</span>
                    </label>
                    <textarea id="c-text" rows={3} value={cText} onChange={(e) => setCText(e.target.value)} placeholder={t.comments.textPh} className={cn(inputCls(cErrors.text), "resize-none")} />
                    {cErrors.text && <p className="mt-1.5 text-xs font-medium text-red-600">{cErrors.text}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={cStatus === "sending"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    >
                      {cStatus === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      {cStatus === "sending" ? t.comments.sending : t.comments.submit}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}