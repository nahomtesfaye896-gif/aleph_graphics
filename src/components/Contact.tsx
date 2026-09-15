import { useState, useEffect, type FormEvent } from "react";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SocialLinks } from "./SocialIcons";
import { useLang } from "../i18n/LanguageContext";
import { cn } from "../utils/cn";
import { addApplicant } from "../utils/adminStorage";
import { api } from "../lib/api";
import { getSiteSettings } from "../utils/siteSettings";
import type { CourseMeta } from "../types/admin";

interface FormState {
  name: string;
  phone: string;
  email: string;
  course: string;
  schedule: string;
  message: string;
}

const initial: FormState = { name: "", phone: "", email: "", course: "", schedule: "", message: "" };

const ET_PHONE = /^(\+?251|0)?9\d{8}$/;

export function Contact() {
  const { t, lang } = useLang();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const settings = getSiteSettings();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.get<CourseMeta[]>('/courses/');
        if (data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {}
    }
    loadData();
  }, []);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (form.name.trim().length < 2) er.name = t.form.errors.name;
    if (!ET_PHONE.test(form.phone.replace(/[\s-]/g, ""))) er.phone = t.form.errors.phone;
    if (!form.course) er.course = t.form.errors.course;
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const courseName = (key: string) => {
    const c = courses.find((c) => c.key === key || c.id === key);
    return c ? (lang === "am" && c.nameAm ? c.nameAm : c.nameEn) : "";
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      addApplicant({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        course: courseName(form.course) || form.course,
        schedule: form.schedule || "Regular",
        message: form.message.trim(),
      });
    } catch (_) {}

    window.setTimeout(() => setStatus("done"), 600);
  };

  const inputCls = (hasError?: string) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-700/40 focus:ring-4",
      hasError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-ink-900/10 focus:border-brand-500 focus:ring-brand-100",
    );

  const getWorkingHoursStatus = () => {
    if (!settings.workingHoursStart || !settings.workingHoursEnd) return null;
    
    // Get current time in Ethiopia (UTC+3)
    const now = new Date();
    const ethiopiaTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3 * 3600000));
    
    const currentHours = ethiopiaTime.getHours();
    const currentMinutes = ethiopiaTime.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    const [startH, startM] = settings.workingHoursStart.split(':').map(Number);
    const [endH, endM] = settings.workingHoursEnd.split(':').map(Number);
    
    const startTime = (startH * 60) + (startM || 0);
    const endTime = (endH * 60) + (endM || 0);
    
    // Simple day check (Mon-Sat = 1-6)
    const day = ethiopiaTime.getDay();
    const isWorkingDay = day !== 0; // Assuming Sunday is closed
    
    if (isWorkingDay && currentTime >= startTime && currentTime < endTime) {
      return { isOpen: true, text: lang === 'am' ? 'ክፍት ነው' : 'Open Now' };
    }
    return { isOpen: false, text: lang === 'am' ? 'ዝግ ነው' : 'Closed' };
  };

  const getMapAddress = (url: string) => {
    if (!url) return '';
    try {
      const parsedUrl = new URL(url);
      
      // Try to extract from /place/Name path
      const placeMatch = parsedUrl.pathname.match(/\/place\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }
      
      // Try to extract from ?q=Name
      const query = parsedUrl.searchParams.get('q') || parsedUrl.searchParams.get('query');
      if (query) {
        return query.split('+').join(' ');
      }
    } catch (e) {
      // Ignore
    }
    return '';
  };

  const statusObj = getWorkingHoursStatus();
  const generatedAddress = getMapAddress(settings.mapUrl);
  // Prioritize generated address if mapUrl exists, fallback to manual or default
  const displayAddress = generatedAddress || (lang === 'am' ? settings.addressAm : settings.addressEn) || t.contact.addressValue;
  const validPhones = [settings.phone, settings.phoneAlt].filter((p): p is string => typeof p === "string" && p.trim().length > 0);

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Contact info */}
          <Reveal variant="left" className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-7 text-white sm:p-9">
              <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-70" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/40 blur-3xl" />
              <div className="relative space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.address}</p>
                    {settings.mapUrl ? (
                      <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block whitespace-pre-line text-sm font-medium leading-relaxed text-white/90 hover:text-white hover:underline">
                        {displayAddress}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-sm font-medium leading-relaxed text-white/90">{displayAddress}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.phone}</p>
                    <div className="mt-1 space-y-1">
                      {validPhones.map((p, i) => (
                        <a key={i} href={`tel:${p.replace(/\s+/g, '')}`} className="block whitespace-pre-line text-sm font-medium leading-relaxed text-white/90 hover:text-white hover:underline">
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.email}</p>
                    <a href={`mailto:${settings.email}`} className="mt-1 block whitespace-pre-line text-sm font-medium leading-relaxed text-white/90 hover:text-white hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300 flex items-center gap-2">
                      {t.contact.hours}
                      {statusObj && (
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", statusObj.isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                          {statusObj.text}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm font-medium leading-relaxed text-white/90">
                      {settings.workingDays || 'Mon-Sat'}: {settings.workingHoursStart} - {settings.workingHoursEnd}
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-300">{t.contact.follow}</p>
                  <SocialLinks itemClassName="bg-white/10 text-white" />
                </div>
              </div>
            </div>

            {/* Map */}
            {settings.mapUrl && (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 flex items-center justify-between rounded-2xl border border-ink-900/5 bg-slate-50 p-4 transition-all hover:border-brand-200 hover:bg-brand-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-ink-900/5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{t.contact.map}</p>
                    <p className="text-xs text-ink-700/70">{displayAddress.split(',')[0] || 'Our Location'}</p>
                  </div>
                </div>
                <Send className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </Reveal>

          {/* Registration form */}
          <Reveal variant="right" delay={100} className="lg:col-span-7">
            <div id="register" className="scroll-mt-24 rounded-3xl border border-ink-900/5 bg-white p-7 shadow-2xl shadow-brand-900/10 sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                {t.form.eyebrow}
              </span>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">{t.form.title}</h3>
              <p className="mt-2 text-sm text-ink-700/75 sm:text-base">{t.form.subtitle}</p>

              {status === "done" ? (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 text-xl font-black text-ink-900">
                    {lang === "am" ? "ምዝገባዎ በተሳካ ሁኔታ ደርሶናል!" : "Registration Received Successfully!"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-700/80">
                    {lang === "am"
                      ? "ስለተመዘገቡ እናመሰግናለን። የአድሚሽን ቡድናችን መረጃዎትን አይቶ በ 24 ሰዓት ውስጥ ይደውልልዎታል።"
                      : "Thank you for registering. Our admissions team will review your application and contact you within 24 hours."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initial);
                      setStatus("idle");
                    }}
                    className="mt-6 text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
                  >
                    {t.form.another}
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.form.name} <span className="text-red-500">*</span>
                    </label>
                    <input id="name" value={form.name} onChange={set("name")} placeholder={t.form.namePh} className={inputCls(errors.name)} autoComplete="name" />
                    {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.form.phone} <span className="text-red-500">*</span>
                    </label>
                    <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder={t.form.phonePh} className={inputCls(errors.phone)} autoComplete="tel" inputMode="tel" />
                    {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.form.email}
                    </label>
                    <input id="email" type="email" value={form.email} onChange={set("email")} placeholder={t.form.emailPh} className={inputCls()} autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="course" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.form.course} <span className="text-red-500">*</span>
                    </label>
                    <select id="course" value={form.course} onChange={set("course")} className={cn(inputCls(errors.course), "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231f2937%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10")}>
                      <option value="">{t.form.coursePh}</option>
                      {courses.map((c) => {
                        const name = lang === "am" && c.nameAm ? c.nameAm : c.nameEn;
                        return (
                          <option key={c.id || c.key} value={c.id || c.key}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.course && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.course}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <p className="mb-2 block text-sm font-semibold text-ink-900">{t.form.schedule}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {t.form.schedules.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, schedule: s }))}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all",
                            form.schedule === s ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/25" : "border-ink-900/10 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink-900">
                      {t.form.message}
                    </label>
                    <textarea id="message" rows={3} value={form.message} onChange={set("message")} placeholder={t.form.messagePh} className={cn(inputCls(), "resize-none")} />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      {status === "sending" ? t.form.sending : t.form.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
