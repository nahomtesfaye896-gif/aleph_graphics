import type { CoursePrices, SiteSettings, StudentComment } from "../types/admin";
import { CONTACT, COURSES } from "../data/site";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const DEFAULT_PRICES: CoursePrices = {
  photoshop: COURSES.find((c) => c.key === "photoshop")?.feeETB ?? "6,500",
  illustrator: COURSES.find((c) => c.key === "illustrator")?.feeETB ?? "6,500",
  graphic: COURSES.find((c) => c.key === "graphic")?.feeETB ?? "14,000",
  video: COURSES.find((c) => c.key === "video")?.feeETB ?? "9,000",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: CONTACT.phone,
  phoneRaw: CONTACT.phoneRaw,
  phone2: CONTACT.phone2,
  whatsapp: CONTACT.whatsapp,
  telegram: CONTACT.telegram,
  email: CONTACT.email,
  mapUrl: CONTACT.mapUrl,
  logoImage: "",
  addressEn: "Bole Road, Near Edna Mall, 3rd Floor, Addis Ababa, Ethiopia",
  addressAm: "ቦሌ መንገድ፣ ኤድና ሞል አጠገብ፣ 3ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ",
  prices: { ...DEFAULT_PRICES },
  social: { ...CONTACT.social },
};

let settingsCache: SiteSettings = { ...DEFAULT_SETTINGS };
let commentsCache: StudentComment[] = [];

const SOCIAL_KEYS: (keyof SiteSettings["social"])[] = ["facebook", "instagram", "tiktok", "telegram", "youtube", "linkedin"];
const COURSE_KEYS: (keyof CoursePrices)[] = ["photoshop", "illustrator", "graphic", "video"];

function fillDefaults(raw: Partial<SiteSettings>): SiteSettings {
  const social = {} as SiteSettings["social"];
  for (const key of SOCIAL_KEYS) {
    social[key] = raw.social && typeof raw.social[key] === "string" ? (raw.social[key] as string) : DEFAULT_SETTINGS.social[key];
  }

  const prices = {} as CoursePrices;
  for (const key of COURSE_KEYS) {
    prices[key] = raw.prices && typeof raw.prices[key] === "string" ? (raw.prices[key] as string) : DEFAULT_SETTINGS.prices[key];
  }

  return {
    phone: typeof raw.phone === "string" ? raw.phone : DEFAULT_SETTINGS.phone,
    phoneRaw: typeof raw.phoneRaw === "string" ? raw.phoneRaw : DEFAULT_SETTINGS.phoneRaw,
    phone2: typeof raw.phone2 === "string" ? raw.phone2 : DEFAULT_SETTINGS.phone2,
    whatsapp: typeof raw.whatsapp === "string" ? raw.whatsapp : DEFAULT_SETTINGS.whatsapp,
    telegram: typeof raw.telegram === "string" ? raw.telegram : DEFAULT_SETTINGS.telegram,
    email: typeof raw.email === "string" ? raw.email : DEFAULT_SETTINGS.email,
    mapUrl: typeof raw.mapUrl === "string" ? raw.mapUrl : DEFAULT_SETTINGS.mapUrl,
    logoImage: typeof raw.logoImage === "string" ? raw.logoImage : DEFAULT_SETTINGS.logoImage,
    addressEn: typeof raw.addressEn === "string" ? raw.addressEn : DEFAULT_SETTINGS.addressEn,
    addressAm: typeof raw.addressAm === "string" ? raw.addressAm : DEFAULT_SETTINGS.addressAm,
    prices,
    social,
  };
}

// --- SITE SETTINGS STORAGE ---
export function getSiteSettings(): SiteSettings {
  return settingsCache;
}

export function saveSiteSettings(patch: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const next: SiteSettings = {
    ...current,
    ...patch,
    prices: { ...current.prices, ...(patch.prices || {}) },
    social: { ...current.social, ...(patch.social || {}) },
  };
  settingsCache = next;

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("site_settings")
      .upsert({
        id: 1,
        phone: next.phone,
        phone_raw: next.phoneRaw,
        phone2: next.phone2,
        whatsapp: next.whatsapp,
        telegram: next.telegram,
        email: next.email,
        map_url: next.mapUrl,
        logo_image: next.logoImage,
        address_en: next.addressEn,
        address_am: next.addressAm,
        prices: next.prices,
        social: next.social,
      })
      .then();
  }

  return next;
}

export function resetSiteSettings(): SiteSettings {
  settingsCache = { ...DEFAULT_SETTINGS };
  if (isSupabaseConfigured && supabase) {
    supabase.from("site_settings").delete().eq("id", 1).then();
  }
  return DEFAULT_SETTINGS;
}

/** Pulls the site settings row (id = 1) from the server so edits made on one
 *  device propagate to every other device. Returns null when unreachable. */
export async function fetchSiteSettingsFromSupabase(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;

  const raw = data as Record<string, unknown>;
  return fillDefaults({
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    phoneRaw: typeof raw.phone_raw === "string" ? raw.phone_raw : undefined,
    phone2: typeof raw.phone2 === "string" ? raw.phone2 : undefined,
    whatsapp: typeof raw.whatsapp === "string" ? raw.whatsapp : undefined,
    telegram: typeof raw.telegram === "string" ? raw.telegram : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    mapUrl: typeof raw.map_url === "string" ? raw.map_url : undefined,
    logoImage: typeof raw.logo_image === "string" ? raw.logo_image : undefined,
    addressEn: typeof raw.address_en === "string" ? raw.address_en : undefined,
    addressAm: typeof raw.address_am === "string" ? raw.address_am : undefined,
    prices: raw.prices as CoursePrices | undefined,
    social: raw.social as SiteSettings["social"] | undefined,
  });
}

/** Updates the in-memory view after a server fetch. */
export function persistSettingsLocal(next: SiteSettings): void {
  settingsCache = next;
}

/** Pulls moderated comments from the server so approvals made on one device
 *  are respected on all of them. Returns null when unreachable. */
export async function fetchStudentCommentsFromSupabase(): Promise<StudentComment[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("student_comments")
    .select("id,name,role,text,approved,created_at")
    .order("created_at", { ascending: false });
  if (error || !data) return null;

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? `comment-remote-${Date.now()}`),
    name: String(row.name ?? "Student"),
    role: typeof row.role === "string" ? row.role : "",
    text: String(row.text ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    approved: Boolean(row.approved),
  }));
}

/** Updates the in-memory view after a server fetch. */
export function persistCommentsLocal(list: StudentComment[]): void {
  commentsCache = list;
}

// --- STUDENT COMMENTS STORAGE ---
export function getStudentComments(): StudentComment[] {
  return commentsCache;
}

export function addStudentComment(data: Omit<StudentComment, "id" | "createdAt" | "approved">): StudentComment[] {
  const current = getStudentComments();
  const newComment: StudentComment = {
    ...data,
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    approved: false,
  };
  const updated = [newComment, ...current];
  commentsCache = updated;

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("student_comments")
      .insert([{ id: newComment.id, name: newComment.name, role: newComment.role, text: newComment.text, approved: false }])
      .then();
  }

  return updated;
}

export function updateStudentCommentStatus(id: string, approved: boolean): StudentComment[] {
  const current = getStudentComments();
  const updated = current.map((item) => (item.id === id ? { ...item, approved } : item));
  commentsCache = updated;

  if (isSupabaseConfigured && supabase) {
    supabase.from("student_comments").update({ approved }).eq("id", id).then();
  }

  return updated;
}

export function deleteStudentComment(id: string): StudentComment[] {
  const current = getStudentComments();
  const updated = current.filter((item) => item.id !== id);
  commentsCache = updated;

  if (isSupabaseConfigured && supabase) {
    supabase.from("student_comments").delete().eq("id", id).then();
  }

  return updated;
}