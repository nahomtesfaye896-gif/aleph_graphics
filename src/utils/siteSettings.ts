import type { CoursePrices, SiteSettings, StudentComment } from "../types/admin";
import { CONTACT, COURSES } from "../data/site";
import { api } from "../lib/api";

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

  api.put('/site-settings/', next).catch(() => {});

  return next;
}

export function resetSiteSettings(): SiteSettings {
  settingsCache = { ...DEFAULT_SETTINGS };
  api.delete('/site-settings/').catch(() => {});
  return DEFAULT_SETTINGS;
}

/** Pulls the site settings row from the server so edits made on one
 *  device propagate to every other device. Returns null when unreachable. */
export async function fetchSiteSettingsFromSupabase(): Promise<SiteSettings | null> {
  try {
    const data = await api.get<SiteSettings>('/site-settings/');
    return fillDefaults(data);
  } catch (error) {
    return null;
  }
}

/** Updates the in-memory view after a server fetch. */
export function persistSettingsLocal(next: SiteSettings): void {
  settingsCache = next;
}

/** Pulls moderated comments from the server so approvals made on one device
 *  are respected on all of them. Returns null when unreachable. */
export async function fetchStudentCommentsFromSupabase(): Promise<StudentComment[] | null> {
  try {
    const data = await api.get<StudentComment[]>('/comments/');
    return data;
  } catch {
    return null;
  }
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

  api.post('/comments/', newComment).catch(() => {});

  return updated;
}

export function updateStudentCommentStatus(id: string, approved: boolean): StudentComment[] {
  const current = getStudentComments();
  const updated = current.map((item) => (item.id === id ? { ...item, approved } : item));
  commentsCache = updated;

  api.patch(`/comments/${encodeURIComponent(id)}/`, { approved }).catch(() => {});

  return updated;
}

export function deleteStudentComment(id: string): StudentComment[] {
  const current = getStudentComments();
  const updated = current.filter((item) => item.id !== id);
  commentsCache = updated;

  api.delete(`/comments/${encodeURIComponent(id)}/`).catch(() => {});

  return updated;
}