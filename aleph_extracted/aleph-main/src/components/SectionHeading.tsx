import { Reveal } from "./Reveal";
import { cn } from "../utils/cn";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", dark = false, className }: Props) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em]",
          dark ? "bg-white/10 text-brand-300" : "bg-brand-50 text-brand-700",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-brand-300" : "bg-brand-600")} />
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-ink-700/75")}>{subtitle}</p>
      )}
    </Reveal>
  );
}
