import { useState, useEffect, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { getSiteSettings, fetchSiteSettingsFromSupabase, persistSettingsLocal } from "../../utils/siteSettings";
import type { SiteSettings } from "../../types/admin";
import { api } from "../../lib/api";

export function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the latest from the backend, not just memory cache
    fetchSiteSettingsFromSupabase().then((data) => {
      if (data) {
        persistSettingsLocal(data);
        setSettings(data);
      } else {
        setSettings(getSiteSettings());
      }
    });
  }, []);

  if (!settings) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      // Send directly to the backend API
      const response = await api.put<SiteSettings>('/site-settings/', settings);
      // Update the in-memory cache so the rest of the site picks it up
      persistSettingsLocal(response);
      setSettings(response);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (key: keyof SiteSettings | string, value: string) => {
    if (["facebook", "instagram", "tiktok", "telegram", "youtube", "linkedin"].includes(key)) {
      setSettings((s) => s ? { ...s, social: { ...s.social, [key]: value } } : null);
    } else {
      setSettings((s) => s ? { ...s, [key]: value } : null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">Site Settings</h2>
        <p className="mt-1 text-sm text-white/60">Manage your contact information, working hours, and social media links.</p>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid gap-6 sm:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-white border-b border-white/10 pb-2">Contact Details</h3>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Primary Phone</label>
              <input type="text" value={settings.phone} onChange={(e) => updateSettings("phone", e.target.value)} placeholder="+251 9XX XXX XXX" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">This phone number is used everywhere on the site and for call links.</p>
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Alternate Phone (Optional)</label>
              <input type="text" value={settings.phoneAlt || ""} onChange={(e) => updateSettings("phoneAlt", e.target.value)} placeholder="+251 9XX XXX XXX" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">Shown only in the Visit Us / Get in Touch section.</p>
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
              <input type="email" value={settings.email} onChange={(e) => updateSettings("email", e.target.value)} placeholder="info@alephgraphics.et" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Google Maps Link</label>
              <input type="url" value={settings.mapUrl} onChange={(e) => updateSettings("mapUrl", e.target.value)} placeholder="https://maps.google.com/?q=Bole+Road+Edna+Mall+Addis+Ababa" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
              <p className="mt-1 text-xs text-white/30">Paste the full Google Maps URL. The address text is auto-extracted from the link.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-white border-b border-white/10 pb-2 mt-4">Working Hours</h3>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Working Days</label>
              <input type="text" value={settings.workingDays || ""} onChange={(e) => updateSettings("workingDays", e.target.value)} placeholder="Mon-Sat" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div className="col-span-full grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Opening Time (Ethiopian Time)</label>
                <input type="time" value={settings.workingHoursStart || ""} onChange={(e) => updateSettings("workingHoursStart", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Closing Time (Ethiopian Time)</label>
                <input type="time" value={settings.workingHoursEnd || ""} onChange={(e) => updateSettings("workingHoursEnd", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-white border-b border-white/10 pb-2 mt-4">Social Links</h3>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Facebook URL</label>
              <input type="url" value={settings.social.facebook || ""} onChange={(e) => updateSettings("facebook", e.target.value)} placeholder="https://facebook.com/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Instagram URL</label>
              <input type="url" value={settings.social.instagram || ""} onChange={(e) => updateSettings("instagram", e.target.value)} placeholder="https://instagram.com/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">TikTok URL</label>
              <input type="url" value={settings.social.tiktok || ""} onChange={(e) => updateSettings("tiktok", e.target.value)} placeholder="https://tiktok.com/@alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Telegram Channel</label>
              <input type="url" value={settings.social.telegram || ""} onChange={(e) => updateSettings("telegram", e.target.value)} placeholder="https://t.me/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">YouTube Channel URL</label>
              <input type="url" value={settings.social.youtube || ""} onChange={(e) => updateSettings("youtube", e.target.value)} placeholder="https://youtube.com/@alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">LinkedIn URL</label>
              <input type="url" value={settings.social.linkedin || ""} onChange={(e) => updateSettings("linkedin", e.target.value)} placeholder="https://linkedin.com/company/alephgraphics" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-6">
            {success && <span className="text-sm font-medium text-emerald-400">✓ Settings saved and applied to the live site!</span>}
            {error && <span className="text-sm font-medium text-red-400">{error}</span>}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-500 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
