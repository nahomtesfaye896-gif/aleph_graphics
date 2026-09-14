export interface Applicant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  schedule: string;
  message?: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface AdminUser {
  username: string;
  /** Legacy plaintext password — only ever present on old installs; migrated on next login. Never written for new accounts. */
  password?: string;
  /** PBKDF2-SHA256 password hash (base64) — current storage format. */
  passwordHash?: string;
  /** Per-user random salt (base64) used to derive passwordHash. */
  salt?: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface SavedPassword {
  id: string;
  serviceName: string;
  username: string;
  password: string;
  category: "Social Media" | "Email / Server" | "Tools & Software" | "Other";
  createdAt: string;
}

export interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  telegram: string;
  youtube: string;
  linkedin: string;
}

export type CoursePrices = {
  photoshop: string;
  illustrator: string;
  graphic: string;
  video: string;
};

export interface SiteSettings {
  phone: string;
  phoneRaw: string;
  phone2: string;
  whatsapp: string;
  telegram: string;
  email: string;
  mapUrl: string;
  logoImage: string;
  addressEn: string;
  addressAm: string;
  prices: CoursePrices;
  social: SocialMediaLinks;
}

export interface StudentComment {
  id: string;
  name: string;
  role: string;
  text: string;
  createdAt: string;
  approved: boolean;
}
