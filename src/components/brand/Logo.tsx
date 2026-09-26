import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 5.5v13M5.5 12h13" strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-foreground/25" />
    </span>
  );
}

export function Logo({
  className,
  tagline = false,
  tone = "default",
}: {
  className?: string;
  tagline?: boolean;
  tone?: "default" | "invert";
}) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-3", className)}>
      <Mark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            tone === "invert" ? "text-navy-foreground" : "text-navy",
          )}
        >
          SWASTHYA
        </span>
        {tagline ? (
          <span
            className={cn(
              "mt-1 text-[11px] font-medium",
              tone === "invert" ? "text-navy-foreground/70" : "text-muted-foreground",
            )}
          >
            Connecting every step of medication care
          </span>
        ) : null}
      </span>
    </Link>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
