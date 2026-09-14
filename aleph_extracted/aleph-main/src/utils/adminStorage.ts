import type { AdminUser, Applicant, SavedPassword } from "../types/admin";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  decryptText,
  encryptText,
  hashPassword,
  randomBytes,
  randomHex,
  verifyPassword,
} from "./crypto";

let adminUserCache: AdminUser | null = null;
let applicantsCache: Applicant[] = [];
let savedPasswordsCache: SavedPassword[] = [];

export const ADMIN_DEFAULT_USERNAME = "admin@alphagraphics.et";

const PASSWORD_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

// ---------- Admin user ----------

function adminToRow(u: AdminUser): Record<string, unknown> {
  return {
    username: u.username,
    password_hash: u.passwordHash ?? null,
    salt: u.salt ?? null,
    name: u.name,
    role: u.role,
  };
}

function rowToAdmin(row: Record<string, unknown>): AdminUser {
  return {
    username: String(row.username ?? ""),
    passwordHash: typeof row.password_hash === "string" ? row.password_hash : undefined,
    salt: typeof row.salt === "string" ? row.salt : undefined,
    name: typeof row.name === "string" && row.name ? row.name : "Academy Administrator",
    role: typeof row.role === "string" && row.role ? row.role : "Super Admin",
  };
}

export function isAdminSetup(): boolean {
  return adminUserCache !== null;
}

export function getAdminUser(): AdminUser | null {
  return adminUserCache;
}

/** True when ANY admin account already exists on the server (any device). */
export async function hasAdminUserOnServer(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { data, error } = await supabase.from("admin_users").select("username").limit(1);
    return !error && Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

/** Creates the first administrator account in Supabase. */
export async function setupAdmin(username: string, password: string): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();

  // Supabase Auth owns accounts created/reset from Authentication > Users.
  // Accept an existing Auth account before trying the legacy admin_users table.
  if (isSupabaseConfigured && supabase && normalizedUsername.includes("@")) {
    const { data: signedIn, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedUsername,
      password,
    });
    if (!signInError && signedIn.user) {
      adminUserCache = {
        username: signedIn.user.email?.trim().toLowerCase() || normalizedUsername,
        name: typeof signedIn.user.user_metadata?.name === "string" ? signedIn.user.user_metadata.name : "Academy Administrator",
        role: "Super Admin",
      };
      return;
    }

    const { data: registered, error: signUpError } = await supabase.auth.signUp({
      email: normalizedUsername,
      password,
    });
    if (!signUpError && registered.user && registered.session) {
      adminUserCache = {
        username: registered.user.email?.trim().toLowerCase() || normalizedUsername,
        name: "Academy Administrator",
        role: "Super Admin",
      };
      return;
    }
  }

  const { hash, salt } = await hashPassword(password);
  const user: AdminUser = {
    username: normalizedUsername,
    passwordHash: hash,
    salt,
    name: "Academy Administrator",
    role: "Super Admin",
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("admin_users").select("username").limit(1);
    if (!error && Array.isArray(data) && data.length > 0) {
      throw new Error("ADMIN_EXISTS");
    }
    const { error: insertError } = await supabase.from("admin_users").upsert(adminToRow(user), { onConflict: "username" });
    if (insertError) throw new Error("SYNC_FAILED");
  }

  adminUserCache = user;
}

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const user = getAdminUser();
  const normalized = (username || "").trim().toLowerCase();

  // Fast path: local cached account
  if (user && normalized === (user.username || "").trim().toLowerCase()) {
    if (user.passwordHash && user.salt) {
      if (await verifyPassword(password, user.salt, user.passwordHash)) return true;
    } else if (user.password) {
      // Legacy record stored the raw password. Verify it, then migrate to a
      // hash and re-encrypt the vault so no plaintext secret survives.
      if (password === user.password) {
        const { hash, salt } = await hashPassword(password);
        const upgraded: AdminUser = { ...user, passwordHash: hash, salt };
        delete (upgraded as Partial<AdminUser>).password;
        adminUserCache = upgraded;
        await reencryptVault(password, password);
        if (isSupabaseConfigured && supabase) {
          supabase.from("admin_users").upsert(adminToRow(upgraded), { onConflict: "username" }).then(() => {}, () => {});
        }
        return true;
      }
    }
    // Fall through to server check on credential mismatch (e.g. password changed on another device).
  }

  // Server fallback: lets any OTHER device sign in with the account that was
  // created on another device.
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("admin_users").select("username,password_hash,salt,name,role");
      const rows = (data as Array<Record<string, unknown>> | null) ?? [];
      if (!error && rows.length > 0) {
        let match = rows.find((r) => String(r.username ?? "").trim().toLowerCase() === normalized);
        if (!match && rows.length === 1) {
          match = rows[0];
        }
        if (match) {
          const serverUser = rowToAdmin(match);
          if (serverUser.passwordHash && serverUser.salt && (await verifyPassword(password, serverUser.salt, serverUser.passwordHash))) {
            adminUserCache = serverUser;
            return true;
          }
        }
      }
    } catch {
      // ignore network errors
    }

    // Also support credentials created in Supabase Authentication. The
    // application historically used its own admin_users table, but Supabase
    // Auth passwords are not available to the client for custom hash checks.
    if (normalized.includes("@")) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (!error && data.user) {
        adminUserCache = {
          username: data.user.email?.trim().toLowerCase() || normalized,
          name: typeof data.user.user_metadata?.name === "string" ? data.user.user_metadata.name : "Academy Administrator",
          role: "Super Admin",
        };
        return true;
      }
    }
  }

  return false;
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<"ok" | "bad-current"> {
  const user = getAdminUser();
  if (!user) return "bad-current";
  const valid = await verifyLogin(user.username, currentPassword);
  if (!valid) return "bad-current";

  await reencryptVault(currentPassword, newPassword);

  const { hash, salt } = await hashPassword(newPassword);
  const updated: AdminUser = { ...user, passwordHash: hash, salt };
  delete (updated as Partial<AdminUser>).password;
  adminUserCache = updated;

  // Push the new credential server-side so every device accepts it.
  if (isSupabaseConfigured && supabase) {
    supabase.from("admin_users").upsert(adminToRow(updated), { onConflict: "username" }).then(
      () => {},
      () => {},
    );
  }
  return "ok";
}

// ---------- Applicants ----------

export function getApplicants(): Applicant[] {
  return applicantsCache;
}

export function saveApplicants(applicants: Applicant[]): void {
  applicantsCache = applicants;
}

export async function fetchApplicantsFromSupabase(): Promise<Applicant[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.from("applicants").select("*").order("created_at", { ascending: false });

  if (error || !data) throw error ?? new Error("Could not load applicants from Supabase.");

  const remote: Applicant[] = (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? `remote-${row.created_at ?? Date.now()}`),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    email: row.email ? String(row.email) : undefined,
    course: String(row.course ?? ""),
    schedule: String(row.schedule ?? ""),
    message: row.message ? String(row.message) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    status: (row.status as Applicant["status"]) ?? "pending",
  }));
  return savedPasswordsCache;

  applicantsCache = remote;
  return remote;
}

export function addApplicant(applicant: Omit<Applicant, "id" | "createdAt" | "status">): Applicant[] {
  const current = getApplicants();
  const newApp: Applicant = {
    ...applicant,
    id: `app-${Date.now()}-${randomHex(6)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  const updated = [newApp, ...current];
  saveApplicants(updated);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("applicants")
      .insert([{ name: newApp.name, phone: newApp.phone, email: newApp.email, course: newApp.course, schedule: newApp.schedule, message: newApp.message }])
      .then(() => {}, () => {});
  }
  return updated;
}

export function updateApplicantStatus(name: string, status: Applicant["status"] | "deleted"): Applicant[] {
  const current = getApplicants();
  let updated: Applicant[];
  if (status === "deleted") {
    updated = current.filter((a) => a.name !== name);
  } else {
    updated = current.map((a) => (a.name === name ? { ...a, status } : a));
  }
  saveApplicants(updated);

  if (isSupabaseConfigured && supabase) {
    if (status === "deleted") {
      supabase.from("applicants").delete().eq("name", name).then(() => {}, () => {});
    } else {
      supabase.from("applicants").update({ status }).eq("name", name).then(() => {}, () => {});
    }
  }
  return updated;
}

export function deleteApplicant(name: string): Applicant[] {
  return updateApplicantStatus(name, "deleted");
}

// ---------- Password vault (encrypted at rest) ----------

export function getSavedPasswords(): SavedPassword[] {
  return savedPasswordsCache;
}

/** Returns the vault with every `password` decrypted. Needs the admin passphrase. */
export async function decryptVault(items: SavedPassword[], password: string): Promise<SavedPassword[]> {
  return Promise.all(
    items.map(async (item) => ({ ...item, password: await decryptText(item.password, password) })),
  );
}

/** Pulls the vault from the server (other devices). Returns null when the
 *  remote is unreachable or has no rows; ciphertext stays encrypted. */
export async function fetchSavedPasswordsFromSupabase(): Promise<SavedPassword[] | null> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("saved_passwords")
    .select("id,service_name,username,password,category,created_at")
    .order("created_at", { ascending: false });
  if (error || !data) throw error ?? new Error("Could not load saved passwords from Supabase.");

  savedPasswordsCache = (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id ?? `pass-remote-${Date.now()}`),
    serviceName: String(row.service_name ?? ""),
    username: String(row.username ?? ""),
    password: String(row.password ?? ""),
    category: (["Social Media", "Email / Server", "Tools & Software", "Other"].includes(String(row.category))
      ? String(row.category)
      : "Other") as SavedPassword["category"],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }));
}

export async function addSavedPassword(
  item: Omit<SavedPassword, "id" | "createdAt">,
  password: string,
): Promise<SavedPassword[]> {
  const current = getSavedPasswords();
  const encrypted = await encryptText(item.password, password);
  const newItem: SavedPassword = {
    ...item,
    id: `pass-${Date.now()}-${randomHex(6)}`,
    password: encrypted,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  savedPasswordsCache = updated;

  if (isSupabaseConfigured && supabase) {
    supabase
      .from("saved_passwords")
      .insert([{ id: newItem.id, service_name: newItem.serviceName, username: newItem.username, password: encrypted, category: newItem.category }])
      .then(() => {}, () => {});
  }
  return decryptVault(updated, password);
}

export async function deleteSavedPassword(id: string, password: string): Promise<SavedPassword[]> {
  const current = getSavedPasswords();
  const updated = current.filter((p) => p.id !== id);
  savedPasswordsCache = updated;

  if (isSupabaseConfigured && supabase) {
    supabase.from("saved_passwords").delete().eq("id", id).then(() => {}, () => {});
  }
  return decryptVault(updated, password);
}

/** Re-encrypt every vault entry from `currentPassword` to `newPassword`. */
async function reencryptVault(currentPassword: string, newPassword: string): Promise<void> {
  const items = getSavedPasswords();
  if (items.length === 0) return;
  const reencrypted = await Promise.all(
    items.map(async (item) => ({
      ...item,
      password: await encryptText(await decryptText(item.password, currentPassword), newPassword),
    })),
  );
  savedPasswordsCache = reencrypted;
}

// ---------- Utilities ----------

export function generateRandomPassword(length = 16): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += PASSWORD_CHARSET[bytes[i] % PASSWORD_CHARSET.length];
  return out;
}