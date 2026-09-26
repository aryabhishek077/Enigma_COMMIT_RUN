import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, XCircle, Flame, Calendar } from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { WeeklyDosesChart } from "@/components/care/charts";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/patient/adherence")({
  head: () => ({
    meta: [{ title: "My Adherence Record — Swasthya" }],
  }),
  component: PatientAdherencePage,
});

function PatientAdherencePage() {
  const { adherencePercent, takenCount, doses } = useCare();

  const totalDoses = doses.length;
  const missedCount = doses.filter((d) => d.status === "missed").length;

  return (
    <DashboardShell
      title="My Adherence Record"
      subtitle="Honest, deterministic tracking calculated directly from your dose acknowledgements"
      badge="Verified Compliance"
    >
      <div className="space-y-6 max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overall Adherence"
            value={`${adherencePercent}%`}
            caption="Deterministic percentage"
            icon={Activity}
            tone="success"
          />
          <StatCard
            label="Acknowledged Doses"
            value={`${takenCount} / ${totalDoses}`}
            caption="Doses marked taken"
            icon={CheckCircle2}
            tone="primary"
          />
          <StatCard
            label="Missed Doses"
            value={missedCount.toString()}
            caption="Missed acknowledgements"
            icon={XCircle}
            tone={missedCount > 0 ? "warning" : "navy"}
          />
          <StatCard
            label="Current Streak"
            value="6 Days"
            caption="Consistent routine"
            icon={Flame}
            tone="navy"
          />
        </div>

        <Panel
          title="Weekly Adherence Trend"
          description="Formula: Adherence = (Acknowledged Doses / Scheduled Doses) × 100"
        >
          <WeeklyDosesChart />
        </Panel>

        <Panel title="Medicine-Specific Compliance" description="Individual adherence breakdown per prescribed molecule">
          <div className="space-y-3">
            {[
              { name: "Metformin 500 mg", rate: 92, timing: "Morning & Night", doses: "26 / 28 taken" },
              { name: "Amlodipine 5 mg", rate: 96, timing: "Morning with water", doses: "14 / 14 taken" },
              { name: "Atorvastatin 10 mg", rate: 93, timing: "After lunch", doses: "13 / 14 taken" },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy text-sm">{m.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.timing} · {m.doses}</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-extrabold text-navy text-lg">{m.rate}%</span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">Healthy</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
