import { useLang } from "../i18n/LanguageContext";
import { cn } from "../utils/cn";

interface LogoProps {
  className?: string;
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 720" className={className} aria-hidden="true">
      <clipPath id="aga-clip">
        <circle cx="360" cy="360" r="356" />
      </clipPath>
      {/* Solid blue disc */}
      <circle cx="360" cy="360" r="356" fill="var(--color-brand-500, #1579bc)" />
      {/* White channels cut through the disc: one straight slash + two curved
          slashes (180° rotational symmetry) forming the pinwheel "A" */}
      <g clipPath="url(#aga-clip)" stroke="#ffffff" fill="none">
        {/* Main diagonal slash, edge to edge */}
        <path d="M150 55 L570 665" strokeWidth="95" />
        {/* Curved channel, lower left */}
        <path d="M258 262 Q140 400 68 580" strokeWidth="72" />
        {/* Curved channel, upper right (180° rotation of the one above) */}
        <path d="M462 458 Q580 320 652 140" strokeWidth="72" />
      </g>
    </svg>
  );
}

export function Logo({ className, dark = false, size = "md" }: LogoProps) {
  const { t } = useLang();
  const markSize = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const nameSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <a href="#home" className={cn("group inline-flex items-center gap-3", className)} aria-label="Aleph Graphics Academy">
      <LogoMark className={cn(markSize, "shrink-0 drop-shadow-md transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-extrabold tracking-tight", nameSize, dark ? "text-white" : "text-ink-900")}>
          {t.brand.name}
        </span>
        <span className={cn("mt-1 text-[0.65rem] font-bold uppercase tracking-[0.3em]", dark ? "text-brand-300" : "text-brand-600")}>
          {t.brand.sub}
        </span>
      </span>
    </a>
  );
}
