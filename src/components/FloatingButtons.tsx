import { useEffect, useState } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { getSiteSettings } from "../utils/siteSettings";
import { cn } from "../utils/cn";

export function FloatingButtons() {
  const { t } = useLang();
  const [showTop, setShowTop] = useState(false);
  const settings = getSiteSettings();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg transition-all duration-300 hover:bg-brand-700",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <a
        href={`tel:${settings.phoneRaw}`}
        aria-label={t.floating.call}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 transition-all hover:scale-105 hover:bg-brand-700 sm:hidden"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
