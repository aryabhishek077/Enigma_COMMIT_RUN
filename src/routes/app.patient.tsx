import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CheckCircle2, Clock, HeartHandshake, Search, Volume2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { ProgressRing, SoundWave } from "@/components/care/visuals";
import { SupplyCard } from "@/components/care/SupplyCard";
import { WeeklyDosesChart } from "@/components/care/charts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCare } from "@/lib/care-store";
import { patient } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/patient")({
  head: () => ({
    meta: [
      { title: "Patient view — Swasthya medication care" },
      {
        name: "description",
        content:
          "The patient view: next medication, today's schedule, adherence progress, medicine supply and the caregiver connection.",
      },
      { property: "og:title", content: "Patient view — Swasthya medication care" },
      {
        property: "og:description",
        content: "Next medication, today's schedule, adherence and medicine supply in one calm screen.",
      },
    ],
  }),
  component: PatientView,
});

function PatientView() {
  const { doses, supply, setDoseStatus, takenCount, adherencePercent } = useCare();
  const [reminderOpen, setReminderOpen] = useState(false);
  const next = doses.find((d) => d.status === "pending" || d.status === "snoozed") ?? doses[doses.length - 1]!;

  function speak(text: string) {
    if (typeof window === "undefined") return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      synth.speak(utterance);
    } catch {
      /* voice is a nice-to-have */
    }
  }

  function openReminder() {
    setReminderOpen(true);
    const line = `It is time to take your ${next.medicine} ${next.strength}, ${next.amount}, ${next.instruction}.`;
    speak(line);
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Medication reminder", { body: `${next.medicine} ${next.strength} · ${next.amount}` });
      } else if (Notification.permission !== "denied") {
        void Notification.requestPermission();
      }
    }
  }

  function acknowledge(status: "taken" | "snoozed" | "missed") {
    setDoseStatus(next.id, status);
    setReminderOpen(false);
    if (status === "taken") {
      toast.success("Dose acknowledged", { description: `${next.medicine} ${next.strength} marked as taken.` });
    } else if (status === "snoozed") {
      toast.info("Reminder snoozed", { description: "Swasthya will remind you again in 15 minutes." });
    } else {
      toast.warning("Marked as not taken", { description: "Your caregiver will be informed about this dose." });
    }
  }

  return (
    <DashboardShell
      title={`Good evening, ${patient.firstName}`}
      subtitle="You're doing great today. One dose is still waiting."
      badge="Plan verified by doctor"
      actions={
        <Button variant="hero" onClick={openReminder}>
          <BellRing /> Show reminder
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-7 text-navy-foreground shadow-[var(--shadow-lift)]">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary-glow/25 blur-[80px]" />
          <div className="relative flex flex-wrap items-center gap-8">
            <div className="rounded-full bg-card/10 p-2">
              <ProgressRing
                value={(takenCount / doses.length) * 100}
                label={`${takenCount}/${doses.length}`}
                caption="doses today"
                tone="success"
                size={150}
              />
            </div>
            <div className="min-w-[14rem] flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-foreground/75">
                Next medication
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold">{next.time}</p>
              <p className="mt-3 font-display text-3xl font-bold">
                {next.medicine} {next.strength}
              </p>
              <p className="text-xl font-semibold text-navy-foreground/85">
                {next.amount} · {next.instruction}
              </p>
            </div>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
            <Button variant="success" size="care" onClick={() => acknowledge("taken")}>
              <CheckCircle2 className="size-5" /> TAKEN
            </Button>
            <Button
              size="care"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
              onClick={() => acknowledge("snoozed")}
            >
              <Clock className="size-5" /> SNOOZE
            </Button>
            <Button
              size="care"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
              onClick={() => acknowledge("missed")}
            >
              <XCircle className="size-5" /> NOT TAKEN
            </Button>
          </div>
        </section>

        <Panel title="Today's medicines" description="Every dose in your plan, in the order you take them.">
          <ul className="space-y-3">
            {doses.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {d.time} · {d.label}
                  </p>
                  <p className="font-display text-xl font-bold text-navy">
                    {d.medicine} {d.strength}
                  </p>
                  <p className="text-base font-medium text-muted-foreground">
                    {d.amount} · {d.instruction}
                  </p>
                </div>
                <StatusPill status={d.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel
          title="This week"
          description={`Doses acknowledged out of planned. Overall adherence ${adherencePercent}% today.`}
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/app/adherence">Full adherence</Link>
            </Button>
          }
        >
          <WeeklyDosesChart />
        </Panel>

        <Panel
          title="Medicine supply"
          description="Swasthya watches your stock so a refill never becomes an emergency."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/app/find-medicine">
                <Search className="size-4" /> Find medicine
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {supply.map((s) => (
              <SupplyCard key={s.id} item={s} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel title="Caregiver connection" description="Someone is quietly keeping an eye out for you.">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-primary-soft/70 p-5">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-card text-primary">
              <HeartHandshake className="size-7" />
            </span>
            <div className="min-w-[12rem] flex-1">
              <p className="font-display text-xl font-bold text-navy">{patient.caregiver}</p>
              <p className="text-sm text-muted-foreground">{patient.caregiverRelation}</p>
              <p className="mt-2 text-sm font-semibold text-success">Connected with your consent</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/app/caregiver">Open caregiver view</Link>
            </Button>
          </div>
        </Panel>

        <Panel title="Voice reminder" description="Swasthya can read the reminder out loud.">
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-background p-5">
            <SoundWave />
            <p className="min-w-[13rem] flex-1 text-lg font-semibold leading-snug text-navy">
              “It is time to take your {next.medicine}, {next.amount}, {next.instruction}.”
            </p>
            <Button
              variant="navy"
              onClick={() => speak(`It is time to take your ${next.medicine}, ${next.amount}, ${next.instruction}.`)}
            >
              <Volume2 /> Play voice
            </Button>
          </div>
        </Panel>
      </div>

      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BellRing className="size-5 text-primary" /> Medication reminder
            </DialogTitle>
            <DialogDescription className="text-base">It is time for your scheduled dose.</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-primary-soft p-5">
            <p className="font-display text-3xl font-extrabold text-navy">
              {next.medicine} {next.strength}
            </p>
            <p className="mt-1 text-xl font-semibold text-muted-foreground">
              {next.amount} · {next.instruction}
            </p>
          </div>
          <div className="grid gap-2.5">
            <Button variant="success" size="care" onClick={() => acknowledge("taken")}>
              TAKEN
            </Button>
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" size="lg" onClick={() => acknowledge("snoozed")}>
                SNOOZE
              </Button>
              <Button variant="outline" size="lg" onClick={() => acknowledge("missed")}>
                NOT TAKEN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

function StatusPill({ status }: { status: "taken" | "pending" | "snoozed" | "missed" }) {
  const map = {
    taken: { label: "Taken", cls: "bg-success-soft text-success" },
    pending: { label: "Pending", cls: "bg-warning-soft text-warning-foreground" },
    snoozed: { label: "Snoozed", cls: "bg-secondary text-navy" },
    missed: { label: "Not taken", cls: "bg-destructive-soft text-destructive" },
  } as const;
  const s = map[status];
  return <span className={cn("rounded-lg px-3 py-1.5 text-sm font-bold", s.cls)}>{s.label}</span>;
}
