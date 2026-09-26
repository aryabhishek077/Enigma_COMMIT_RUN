import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Store,
  Stethoscope,
  User,
  Volume2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Atmosphere, HeroComposition, ProgressRing, SoundWave } from "@/components/care/visuals";
import { Reveal, SectionHeading } from "@/components/care/Reveal";
import { Button } from "@/components/ui/button";
import { journeySteps, prescriptionFields } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swasthya — Medication care, finally connected" },
      {
        name: "description",
        content:
          "Swasthya connects doctors, patients, caregivers and pharmacies in one medication-care journey: verified prescriptions, spoken reminders, honest adherence and nearby medicine availability.",
      },
      { property: "og:title", content: "Swasthya — Medication care, finally connected" },
      {
        property: "og:description",
        content:
          "One connected medication journey: verified prescriptions, spoken reminders, honest adherence and nearby medicine availability.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <Journey />
        <AiPrescription />
        <PatientReminder />
        <Caregiver />
        <Pharmacy />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Atmosphere />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Connected medication care
          </span>

          <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.04] text-navy sm:text-6xl lg:text-[4.25rem]">
            Medication care,
            <br />
            finally <span className="text-gradient-brand">connected</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Swasthya brings doctors, patients, caregivers and pharmacies together in one personalised medication-care
            journey — from a verified prescription to the medicine actually being taken.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/app/patient">
                Explore Swasthya <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#journey">
                <PlayCircle /> Watch how it works
              </a>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-7">
            {[
              ["4 roles", "One shared journey"],
              ["Voice + screen", "Reminders that reach"],
              ["Doctor verified", "Every medication plan"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-lg font-bold text-navy">{k}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <HeroComposition />
        </div>
      </div>
    </section>
  );
}

const roleCards = [
  {
    icon: Stethoscope,
    role: "Doctor",
    points: ["Prescription verification", "Medication plan authority"],
    to: "/app/doctor" as const,
  },
  {
    icon: User,
    role: "Patient",
    points: ["Personalised reminders", "Simple acknowledgement"],
    to: "/app/patient" as const,
  },
  {
    icon: HeartHandshake,
    role: "Caregiver",
    points: ["Remote support", "Meaningful alerts only"],
    to: "/app/caregiver" as const,
  },
  {
    icon: Store,
    role: "Pharmacy",
    points: ["Medicine discovery", "Availability confirmation"],
    to: "/app/pharmacy" as const,
  },
];

function TrustStrip() {
  return (
    <section className="border-y border-border bg-card py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="One connected medication journey"
            title="Four roles. One continuous line of care."
            description="Each role sees only what it needs — and every action stays connected to the same medication plan."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map((card, i) => (
            <Reveal key={card.role} delay={i * 90}>
              <Link
                to={card.to}
                className="group block h-full rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                  <card.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {card.role}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {card.points.map((p) => (
                    <li key={p} className="font-display text-lg font-bold leading-snug text-navy">
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open view <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-24 size-[40rem] -translate-x-1/2 rounded-full bg-primary/8 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The journey"
            title="From prescription to peace of mind."
            description="Eight connected steps. Nothing gets lost between the clinic, the kitchen shelf and the pharmacy counter."
          />
        </Reveal>

        <div className="relative mt-14">
          <svg className="absolute inset-x-0 top-[3.25rem] hidden h-2 w-full lg:block" aria-hidden="true">
            <line x1="0" y1="4" x2="100%" y2="4" className="stroke-border" strokeWidth="2" />
            <line
              x1="0"
              y1="4"
              x2="100%"
              y2="4"
              className="animate-dash stroke-primary"
              strokeWidth="2"
              strokeDasharray="6 14"
              strokeLinecap="round"
            />
          </svg>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <li className="h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy font-display text-sm font-extrabold text-navy-foreground">
                      {s.n}
                    </span>
                    <span className="size-2 rounded-full bg-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function AiPrescription() {
  const [scanned, setScanned] = useState(false);

  return (
    <section className="border-y border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="AI-assisted reading"
            title="A paper prescription becomes a real medication plan."
            description="Swasthya reads the prescription to structure it — and then waits for a doctor to verify before anything reaches the patient."
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-background p-7 shadow-[var(--shadow-lift)]">
              {!scanned ? (
                <span className="absolute left-0 right-0 h-16 animate-scanline bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
              ) : null}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Prescription · sample
                </p>
                <ClipboardList className="size-5 text-primary" />
              </div>
              <div className="mt-5 space-y-1 font-display">
                <p className="text-sm font-semibold text-muted-foreground">Dr. Amit Sharma · MMC123456</p>
                <p className="pt-4 text-3xl font-extrabold text-navy">Metformin 500 mg</p>
                <p className="text-2xl font-bold text-primary">1 - 0 - 1</p>
                <p className="text-xl font-semibold text-navy">30 days · after meals</p>
              </div>
              <div className="mt-6 h-px bg-border" />
              <p className="mt-4 text-sm text-muted-foreground">
                Handwriting, strength and frequency are read together so nothing is guessed in isolation.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl border border-border bg-background p-7 shadow-[var(--shadow-lift)]">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="size-4" /> Structured by AI extraction
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {prescriptionFields.map((f) => (
                  <div key={f.label} className="rounded-xl bg-primary-soft/70 px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                    <dd className="mt-1 font-display text-lg font-bold text-navy">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <span className="text-sm font-semibold text-navy">AI confidence (sample value)</span>
                <span className="font-display text-xl font-extrabold text-primary">94%</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl bg-success-soft px-3.5 py-2 text-sm font-bold text-success">
                  <CheckCircle2 className="size-4" /> Doctor verification required
                </span>
                <Button variant="outline" onClick={() => setScanned((v) => !v)}>
                  {scanned ? "Replay scan" : "Pause scan"}
                </Button>
                <Button asChild variant="hero">
                  <Link to="/app/prescriptions">Try the upload flow</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PatientReminder() {
  return (
    <section id="patient" className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-soft via-background to-background" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Reveal>
          <div className="mx-auto w-full max-w-[20rem] rounded-[2.25rem] border border-border bg-navy p-3 shadow-[var(--shadow-lift)]">
            <div className="rounded-[1.85rem] bg-background p-5">
              <p className="text-sm font-semibold text-muted-foreground">Good evening,</p>
              <p className="font-display text-2xl font-extrabold text-navy">Sunita</p>

              <div className="mt-5 rounded-2xl bg-gradient-hero p-5 text-navy-foreground">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-foreground/75">
                  Next medication
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold">8:00 PM</p>
                <p className="mt-3 font-display text-2xl font-bold">Metformin 500 mg</p>
                <p className="text-lg font-semibold text-navy-foreground/85">1 tablet · after dinner</p>
              </div>

              <div className="mt-4 space-y-2.5">
                <Button asChild variant="success" size="care" className="w-full">
                  <Link to="/app/patient">TAKEN</Link>
                </Button>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/app/patient">SNOOZE</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/app/patient">NOT TAKEN</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            align="left"
            eyebrow="Reminders that reach"
            title="Swasthya doesn't only show a reminder. It can speak it."
            description="Large type, one clear action and a spoken reminder — designed for a 62-year-old parent holding a phone in one hand and dinner in the other."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Volume2 className="size-4" /> Voice reminder
              </div>
              <p className="mt-3 text-lg font-semibold leading-snug text-navy">
                “It is time to take your Metformin, one tablet, after dinner.”
              </p>
              <div className="mt-4">
                <SoundWave />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <BellRing className="size-4" /> Today's progress
              </div>
              <div className="mt-3 flex items-center gap-4">
                <ProgressRing value={75} label="3/4" caption="acknowledged" size={124} tone="success" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Evening dose still pending. One gentle nudge, then the caregiver is informed.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Caregiver() {
  return (
    <section id="caregiver" className="border-y border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Support from anywhere"
            title="A parent in Pune. A son in Bengaluru. One care circle."
            description="Caregivers get context, not surveillance — a meaningful alert only when the routine actually slips."
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <div className="rounded-2xl border border-border bg-background p-7 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Patient</p>
              <h3 className="mt-2 text-2xl font-bold text-navy">Sunita Sharma</h3>
              <p className="mt-1 text-sm text-muted-foreground">Pune · Diabetes, hypertension</p>
              <div className="mt-6 flex items-center gap-5">
                <ProgressRing value={75} label="3/4" caption="today" size={130} />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-navy">Today's medication</p>
                  <p className="text-muted-foreground">3 of 4 doses acknowledged</p>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning-foreground">
                    Evening dose pending
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col items-center gap-2 px-2 py-4 lg:py-0">
              <ShieldCheck className="size-6 text-success" />
              <svg viewBox="0 0 12 120" className="hidden h-28 w-3 lg:block" aria-hidden="true">
                <line x1="6" y1="0" x2="6" y2="120" className="stroke-border" strokeWidth="2" />
                <line
                  x1="6"
                  y1="0"
                  x2="6"
                  y2="120"
                  className="animate-dash stroke-primary"
                  strokeWidth="2"
                  strokeDasharray="5 12"
                />
              </svg>
              <svg viewBox="0 0 120 12" className="h-3 w-24 lg:hidden" aria-hidden="true">
                <line x1="0" y1="6" x2="120" y2="6" className="animate-dash stroke-primary" strokeWidth="2" strokeDasharray="5 12" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Consent-based link
              </span>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="rounded-2xl border border-border bg-background p-7 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Caregiver</p>
              <h3 className="mt-2 text-2xl font-bold text-navy">Rahul Sharma</h3>
              <p className="mt-1 text-sm text-muted-foreground">Son · Bengaluru</p>

              <div className="mt-6 rounded-xl border border-warning/35 bg-warning-soft p-4">
                <p className="text-sm font-bold text-warning-foreground">Attention required</p>
                <p className="mt-1.5 text-sm leading-relaxed text-warning-foreground/85">
                  Evening medication acknowledgement missed repeatedly.
                </p>
                <Button asChild variant="navy" size="sm" className="mt-4">
                  <Link to="/app/caregiver">VIEW</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Pharmacy() {
  const [requested, setRequested] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section id="pharmacy" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Medicine discovery"
            title="Know the medicine is there before the trip."
            description="When supply runs low, Swasthya asks nearby connected pharmacies — and only a pharmacy can confirm its own availability."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border bg-primary-soft shadow-[var(--shadow-soft)]">
              <svg className="absolute inset-0 size-full" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
                <g className="stroke-card" strokeWidth="1.4">
                  {[10, 25, 40, 55, 68].map((y) => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} />
                  ))}
                  {[14, 32, 50, 68, 86].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="70" />
                  ))}
                </g>
                <path d="M0 52 C22 46 30 30 50 28 C70 26 82 16 100 18" className="stroke-primary/30" strokeWidth="2.4" fill="none" />
              </svg>

              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className="size-4 animate-pulse-soft rounded-full bg-primary ring-4 ring-card" />
                <span className="mt-2 rounded-lg bg-card px-2.5 py-1 text-[11px] font-bold text-navy shadow-[var(--shadow-soft)]">
                  You are here
                </span>
              </span>

              {[
                { name: "ABC Medical", x: "24%", y: "26%" },
                { name: "Sanjeevani", x: "70%", y: "20%" },
                { name: "Shree Medico", x: "62%", y: "72%" },
                { name: "Nirmal Chemists", x: "18%", y: "70%" },
              ].map((p) => (
                <span
                  key={p.name}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-[11px] font-bold text-navy shadow-[var(--shadow-soft)]"
                  style={{ left: p.x, top: p.y }}
                >
                  <MapPin className="size-3.5 text-primary" /> {p.name}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-navy">ABC Medical</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Kothrud · 1.2 km · Open till 11 PM</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-2.5 py-1.5 text-xs font-bold text-success">
                  <CheckCircle2 className="size-3.5" /> Availability connected
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-primary-soft/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested medicine</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-navy">Metformin 500 mg</p>
                <p className="text-base font-semibold text-muted-foreground">2 strips · for Sunita Sharma</p>
              </div>

              <div className="mt-auto pt-6">
                {confirmed ? (
                  <div className="animate-rise rounded-2xl border border-success/35 bg-success-soft p-5 text-center">
                    <CheckCircle2 className="mx-auto size-8 text-success" />
                    <p className="mt-2 font-display text-xl font-extrabold text-success">Confirmed by pharmacy</p>
                    <p className="mt-1 text-sm text-success/90">ABC Medical confirmed Metformin 500 mg.</p>
                  </div>
                ) : requested ? (
                  <div className="rounded-2xl border border-border p-5 text-center">
                    <p className="text-sm font-semibold text-navy">Checking pharmacy response…</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-brand" />
                    </div>
                    <Button variant="success" className="mt-4 w-full" onClick={() => setConfirmed(true)}>
                      Simulate pharmacy confirmation
                    </Button>
                  </div>
                ) : (
                  <Button variant="hero" size="xl" className="w-full" onClick={() => setRequested(true)}>
                    REQUEST AVAILABILITY
                  </Button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Availability is confirmed by the pharmacy, not predicted by Swasthya.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="px-5 pb-20 lg:px-8 lg:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-hero px-8 py-16 text-center lg:px-16 lg:py-20">
        <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-primary-glow/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-primary/30 blur-[90px]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-navy-foreground sm:text-4xl">
            See the whole journey in one demo.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/80">
            Switch between patient, doctor, caregiver and pharmacy views and watch the same medication plan move through
            every hand that touches it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" className="bg-card text-navy hover:bg-card/90">
              <Link to="/app/patient">Start with the patient view</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground">
              <Link to="/app/doctor">Open doctor dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
