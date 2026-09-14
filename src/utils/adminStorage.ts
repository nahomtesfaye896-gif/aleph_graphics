import type { AdminUser, Applicant, SavedPassword } from "../types/admin";
import { api, setAuthToken } from "../lib/api";
import {
  decryptText,
  encryptText,
  randomBytes,
  randomHex,
} from "./crypto";

let adminUserCache: AdminUser | null = null;
let applicantsCache: Applicant[] = [];
let savedPasswordsCache: SavedPassword[] = [];

export const ADMIN_DEFAULT_USERNAME = "admin@alphagraphics.et";

const PASSWORD_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

// ---------- Admin user ----------

export function isAdminSetup(): boolean {
  return adminUserCache !== null;
}

export function getAdminUser(): AdminUser | null {
  return adminUserCache;
}

/** True when ANY admin account already exists on the server (any device). */
export async function hasAdminUserOnServer(): Promise<boolean> {
  try {
    const res = await api.get<{exists: boolean}>('/admin/exists/');
    return res.exists;
  } catch {
    return false;
  }
}

/** Creates the first administrator account. */
export async function setupAdmin(username: string, password: string): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  
  try {
    await api.post('/auth/setup/', { username: normalizedUsername, password });
    
    // Automatically log in after setup
    await verifyLogin(normalizedUsername, password);
  } catch (err: any) {
    if (err.message === "ADMIN_EXISTS") {
      throw new Error("ADMIN_EXISTS");
    }
    throw new Error("SYNC_FAILED");
  }
}

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const normalized = (username || "").trim().toLowerCase();

  try {
    const data = await api.post('/auth/login/', { username: normalized, password });
    if (data.token && data.user) {
      setAuthToken(data.token);
      adminUserCache = {
        username: data.user.username,
        name: data.user.name,
        role: data.user.role,
        passwordHash: data.user.password_hash,
        salt: data.user.salt,
      };
      return true;
    }
  } catch (error) {
    // Return false on login failure
  }

  return false;
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<"ok" | "bad-current"> {
  const user = getAdminUser();
  if (!user) return "bad-current";
  
  // Verify current password first via login
  try {
    await api.post('/auth/login/', { username: user.username, password: currentPassword });
  } catch {
    return "bad-current";
  }

  // Re-encrypt the vault with the new password locally before we lose the old password
  await reencryptVault(currentPassword, newPassword);

  // Update password on server
  try {
    await api.put('/auth/password/', { newPassword });
    return "ok";
  } catch {
    return "bad-current";
  }
}

// ---------- Applicants ----------

export function getApplicants(): Applicant[] {
  return applicantsCache;
}

export function saveApplicants(applicants: Applicant[]): void {
  applicantsCache = applicants;
}

export async function fetchApplicantsFromSupabase(): Promise<Applicant[]> {
  try {
    const data = await api.get<Applicant[]>('/applicants/');
    applicantsCache = data;
    return data;
  } catch {
    return [];
  }
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

  // Async API call, we don't block the UI
  api.post('/applicants/', newApp).catch(() => {});
  
  return updated;
}

export function updateApplicantStatus(name: string, status: Applicant["status"] | "deleted"): Applicant[] {
  const current = getApplicants();
  let updated: Applicant[];
  
  // In the old code, deletion and status update used `name` instead of `id` for identifying rows.
  // We'll pass `name` to the endpoint which handles `name_or_id`.
  
  if (status === "deleted") {
    updated = current.filter((a) => a.name !== name);
  } else {
    updated = current.map((a) => (a.name === name ? { ...a, status } : a));
  }
  saveApplicants(updated);

  if (status === "deleted") {
    api.delete(`/applicants/${encodeURIComponent(name)}/`).catch(() => {});
  } else {
    api.patch(`/applicants/${encodeURIComponent(name)}/status/`, { status }).catch(() => {});
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

/** Pulls the vault from the server. Returns null when the
 *  remote is unreachable or has no rows; ciphertext stays encrypted. */
export async function fetchSavedPasswordsFromSupabase(): Promise<SavedPassword[] | null> {
  try {
    const data = await api.get<SavedPassword[]>('/vault/');
    savedPasswordsCache = data;
    return data;
  } catch (error) {
    throw new Error("Could not load saved passwords from Server.");
  }
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

  api.post('/vault/', newItem).catch(() => {});
  
  return decryptVault(updated, password);
}

export async function deleteSavedPassword(id: string, password: string): Promise<SavedPassword[]> {
  const current = getSavedPasswords();
  const updated = current.filter((p) => p.id !== id);
  savedPasswordsCache = updated;

  api.delete(`/vault/${encodeURIComponent(id)}/`).catch(() => {});
  
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
  
  // Update each password on the server
  for (const item of reencrypted) {
      // we need to delete and re-insert, or provide a put endpoint, but actually 
      // let's just delete and post to avoid creating new endpoints
      api.delete(`/vault/${encodeURIComponent(item.id)}/`)
         .then(() => api.post('/vault/', item))
         .catch(() => {});
  }
}

// ---------- Utilities ----------

export function generateRandomPassword(length = 16): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += PASSWORD_CHARSET[bytes[i] % PASSWORD_CHARSET.length];
  return out;
}