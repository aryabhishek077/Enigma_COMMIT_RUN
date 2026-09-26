import { cn } from "@/lib/utils";

/** Soft healthcare atmosphere: radial glow + mesh + floating dots. */
export function Atmosphere({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -right-32 top-24 size-[28rem] rounded-full bg-primary-glow/20 blur-[110px]" />
      <div className="absolute bottom-0 left-0 size-[22rem] rounded-full bg-success/10 blur-[110px]" />
      <svg className="absolute inset-0 size-full opacity-[0.16]" viewBox="0 0 800 500" fill="none">
        <g stroke="currentColor" className="text-primary" strokeWidth="0.8">
          <path d="M40 420 L180 300 L330 350 L470 210 L620 260 L760 130" />
          <path d="M60 180 L200 120 L340 200 L500 90 L660 160" />
        </g>
        <g className="fill-primary">
          {[
            [180, 300],
            [330, 350],
            [470, 210],
            [620, 260],
            [200, 120],
            [500, 90],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />
          ))}
        </g>
      </svg>
    </div>
  );
}

/** CSS/SVG 3D medication capsule composition with floating status cards. */
export function HeroComposition() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" style={{ perspective: "1400px" }}>
      <div className="absolute inset-[12%] rounded-full bg-primary/20 blur-[70px]" />

      {/* Central translucent capsule */}
      <div
        className="absolute left-1/2 top-1/2 h-[54%] w-[30%] -translate-x-1/2 -translate-y-1/2 animate-float-slow"
        style={{ transform: "translate(-50%, -50%) rotateZ(-38deg) rotateX(14deg)" }}
      >
        <div className="relative size-full overflow-hidden rounded-full border border-card/60 shadow-[var(--shadow-glow)]">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-card to-card/70" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-brand" />
          <div className="absolute inset-y-0 left-[14%] w-[22%] rounded-full bg-card/45 blur-md" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-navy/10" />
        </div>
      </div>

      {/* Orbit rings */}
      <div className="absolute inset-[6%] rounded-full border border-primary/15" />
      <div className="absolute inset-[18%] rounded-full border border-primary/10" />

      <FloatCard className="left-0 top-[14%] animate-float-med" tone="success" label="Doctor verified" value="Dr. A. Sharma" />
      <FloatCard className="right-0 top-[6%] animate-float-slow" tone="primary" label="Adherence" value="92%" />
      <FloatCard
        className="right-[2%] bottom-[24%] animate-float-med"
        tone="warning"
        label="Medicine running low"
        value="Metformin · 3 days"
      />
      <FloatCard
        className="left-[4%] bottom-[10%] animate-float-slow"
        tone="success"
        label="ABC Medical"
        value="Availability confirmed"
      />
    </div>
  );
}

function FloatCard({
  className,
  label,
  value,
  tone,
}: {
  className?: string;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning";
}) {
  const dot =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className={cn("absolute w-[10.5rem] rounded-2xl p-3 glass-panel", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", dot)} />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 font-display text-base font-bold text-navy">{value}</p>
    </div>
  );
}

/** Animated voice reminder sound wave. */
export function SoundWave({ active = true }: { active?: boolean }) {
  const bars = [10, 18, 28, 40, 30, 46, 24, 34, 16, 26, 12];
  return (
    <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("w-1.5 rounded-full bg-gradient-brand", active && "animate-float-med")}
          style={{ height: `${h}px`, animationDelay: `${i * 0.11}s`, animationDuration: "1.6s" }}
        />
      ))}
    </div>
  );
}

/** Circular progress ring used for adherence and daily progress. */
export function ProgressRing({
  value,
  label,
  caption,
  size = 168,
  tone = "primary",
}: {
  value: number;
  label: string;
  caption?: string;
  size?: number;
  tone?: "primary" | "success";
}) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="12" className="stroke-secondary" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          className={tone === "success" ? "stroke-success" : "stroke-primary"}
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-3xl font-extrabold text-navy">{label}</span>
        {caption ? <span className="mt-1 text-xs font-medium text-muted-foreground">{caption}</span> : null}
      </div>
    </div>
  );
}
