import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Search,
  Volume2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
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

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — Swasthya Medication Care" },
      {
        name: "description",
        content: "Accessible medication schedule, voice reminders, honest adherence and supply tracking.",
      },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const {
    doses,
    supply,
    setDoseStatus,
    takenCount,
    adherencePercent,
    simulateRepeatedMissed,
    hasRepeatedMissed,
    setCurrentRole,
  } = useCare();

  const [reminderOpen, setReminderOpen] = useState(false);
  const next = doses.find((d) => d.status === "pending" || d.status === "snoozed") ?? doses[doses.length - 1]!;

  function speak(text: string) {
    if (typeof window === "undefined") return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      synth.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  }

  function handleTestReminder() {
    setReminderOpen(true);
    const line = `It is time to take your ${next.medicine} ${next.strength} tablet. Please take one tablet after dinner.`;
    speak(line);

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Swasthya Medication Reminder", {
          body: `${next.medicine} ${next.strength} · 1 tablet after dinner`,
        });
      } else if (Notification.permission !== "denied") {
        void Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("Swasthya Medication Reminder", {
              body: `${next.medicine} ${next.strength} · 1 tablet after dinner`,
            });
          }
        });
      }
    }
  }

  function acknowledgeDose(status: "taken" | "snoozed" | "missed") {
    setDoseStatus(next.id, status);
    setReminderOpen(false);

    if (status === "taken") {
      toast.success("Dose Acknowledged", {
        description: `${next.medicine} ${next.strength} marked as taken. Supply decremented.`,
      });
    } else if (status === "snoozed") {
      toast.info("Reminder Snoozed", {
        description: "Swasthya will remind you again in 10 minutes.",
      });
    } else {
      toast.warning("Marked as Not Taken", {
        description: "Adherence recorded. Your caregiver will be informed about missed patterns.",
      });
    }
  }

  const metforminSupply = supply.find((s) => s.medicine.toLowerCase().includes("metformin")) ?? supply[0];

  return (
    <DashboardShell
      title={`Good evening, ${patient.firstName}`}
      subtitle={`Patient Code: SWS-P-8F42K91 · Supervised by ${patient.doctor}`}
      badge="Doctor-Verified Plan"
      actions={
        <Button variant="hero" onClick={handleTestReminder} className="animate-pulse">
          <BellRing className="size-4 mr-2" /> TEST REMINDER
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Hackathon Judge Simulation Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>
              <strong>Judge Test Shortcut:</strong> Test voice reminder or simulate repeated missed doses for Caregiver alert.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 w-full sm:w-auto"
              onClick={handleTestReminder}
            >
              <Volume2 className="size-3.5 mr-1" /> Test Spoken Reminder
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-amber-600 hover:bg-amber-700 text-white border-transparent w-full sm:w-auto"
              onClick={() => {
                simulateRepeatedMissed();
                toast.warning("Missed doses simulated", {
                  description: "Caregiver alert triggered! Switch to Caregiver Portal to view.",
                });
              }}
            >
              <AlertTriangle className="size-3.5 mr-1" /> Simulate Repeated Missed
            </Button>
          </div>
        </div>

        {/* HERO: NEXT MEDICATION - ACCESSIBLE ELDERLY UI */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 sm:p-8 text-navy-foreground shadow-lg">
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  <Clock className="size-3.5" /> Next Scheduled Dose
                </span>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {next.time}
                  </span>
                  <span className="text-sm font-semibold text-white/80">{next.label}</span>
                </div>

                <div className="mt-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {next.medicine} <span className="text-primary-soft">{next.strength}</span>
                  </h3>
                  <p className="mt-1 text-base text-white/90 font-medium">
                    {next.amount} · {next.instruction}
                  </p>
                </div>
              </div>

              {/* Large Tap Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => acknowledgeDose("taken")}
                  className="py-4 px-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base flex flex-col items-center justify-center gap-1 shadow-md transition transform active:scale-95"
                >
                  <CheckCircle2 className="size-6" />
                  <span>TAKEN</span>
                </button>
                <button
                  onClick={() => acknowledgeDose("snoozed")}
                  className="py-4 px-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm sm:text-base flex flex-col items-center justify-center gap-1 backdrop-blur transition transform active:scale-95"
                >
                  <Clock className="size-6" />
                  <span>SNOOZE</span>
                </button>
                <button
                  onClick={() => acknowledgeDose("missed")}
                  className="py-4 px-2 rounded-2xl bg-rose-500/80 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base flex flex-col items-center justify-center gap-1 shadow-md transition transform active:scale-95"
                >
                  <XCircle className="size-6" />
                  <span>NOT TAKEN</span>
                </button>
              </div>
            </div>
          </section>

          {/* Today's Progress & Adherence */}
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-navy">Today's Medication Progress</h3>
                <span className="text-xs font-bold text-primary font-mono">
                  {takenCount} / {doses.length} doses acknowledged
                </span>
              </div>

              <div className="flex items-center gap-6 my-4">
                <ProgressRing value={adherencePercent} label={`${adherencePercent}%`} caption="Adherence" size={110} />
                <div>
                  <p className="text-3xl font-extrabold text-navy">{adherencePercent}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Deterministic adherence rate</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-2">
                    ✓ Doctor verified regimen
                  </p>
                </div>
              </div>
            </div>

            {/* Medicine Supply Card & Low Stock Alert */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                      Supply Alert
                    </span>
                    <h4 className="font-bold text-navy text-sm mt-1.5">
                      {metforminSupply?.medicine ?? "Metformin"} {metforminSupply?.strength ?? "500 mg"}
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      {metforminSupply?.tabletsLeft ?? 6} tablets remaining · <strong>Estimated {metforminSupply?.daysRemaining ?? 3} days remaining</strong>
                    </p>
                    <p className="text-xs text-amber-800 font-medium mt-1">
                      Medicine may run low soon.
                    </p>
                  </div>

                  <Button asChild size="sm" variant="default" className="bg-primary hover:bg-primary/90 text-white shrink-0">
                    <Link to="/patient/find-medicine">
                      FIND MEDICINE <ArrowRight className="size-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* TODAY'S DOSES LIST */}
        <Panel
          title="Today's Medication Schedule"
          description="Large, accessible view of each dose scheduled for today"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {doses.map((dose) => (
              <div
                key={dose.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex items-center justify-between",
                  dose.status === "taken"
                    ? "bg-emerald-50/50 border-emerald-200"
                    : dose.status === "missed"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-card border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center font-bold text-xs",
                      dose.status === "taken"
                        ? "bg-emerald-100 text-emerald-800"
                        : dose.status === "missed"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {dose.time.split(" ")[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">
                      {dose.medicine} {dose.strength}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {dose.amount} · {dose.instruction} ({dose.label})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs font-bold px-2.5 py-1 rounded-full uppercase",
                      dose.status === "taken"
                        ? "bg-emerald-100 text-emerald-800"
                        : dose.status === "missed"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {dose.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Caregiver Connection Info */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HeartHandshake className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-navy text-sm">Caregiver Support Connected</h4>
              <p className="text-xs text-muted-foreground">
                Rahul Sharma (Son · Bengaluru) receives weekly adherence summaries and missed dose alerts.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link
              to="/caregiver/dashboard"
              onClick={() => setCurrentRole("caregiver")}
            >
              View Caregiver View <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* SPOKEN / IN-APP MEDICATION REMINDER MODAL */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <BellRing className="size-3.5" /> MEDICATION REMINDER
              </span>
              <SoundWave active />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-navy mt-3">
              It is time for your medication
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1">
              Please take your scheduled dose as prescribed by Dr. Amit Sharma.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs uppercase font-bold text-slate-400">Prescribed Medicine</p>
            <h3 className="text-3xl font-extrabold text-navy mt-1">
              {next.medicine} <span className="text-primary">{next.strength}</span>
            </h3>
            <p className="text-base text-slate-700 font-semibold mt-1">
              {next.amount} · {next.instruction}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
              <Volume2 className="size-3.5" /> Spoken reminder played through speaker
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl text-base font-extrabold"
              onClick={() => acknowledgeDose("taken")}
            >
              TAKEN
            </Button>
            <Button
              variant="outline"
              className="py-6 rounded-2xl text-base font-bold"
              onClick={() => acknowledgeDose("snoozed")}
            >
              SNOOZE
            </Button>
            <Button
              variant="outline"
              className="text-rose-600 border-rose-200 hover:bg-rose-50 py-6 rounded-2xl text-base font-bold"
              onClick={() => acknowledgeDose("missed")}
            >
              NOT TAKEN
            </Button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            Prototype reminder — production mobile app would use device-level notification scheduling.
          </p>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
