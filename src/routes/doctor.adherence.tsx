import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { WeeklyDosesChart } from "@/components/care/charts";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/doctor/adherence")({
  head: () => ({
    meta: [{ title: "Doctor Portal — Adherence Analytics | Swasthya" }],
  }),
  component: DoctorAdherencePage,
});

function DoctorAdherencePage() {
  const { adherencePercent, doses } = useCare();

  return (
    <DashboardShell
      title="Patient Adherence Analytics"
      subtitle="Deterministic adherence metrics across authorized patient cohorts"
      badge="Clinical Analytics"
    >
      <div className="space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Cohort Average"
            value={`${adherencePercent}%`}
            caption="Deterministic 7-day rate"
            icon={Activity}
            tone="success"
          />
          <StatCard
            label="Today's Acknowledgements"
            value={`${doses.filter(d => d.status === "taken").length} / ${doses.length}`}
            caption="Doses logged on time"
            icon={CheckCircle2}
            tone="primary"
          />
          <StatCard
            label="Attention Flagged"
            value="1"
            caption="Evening acknowledgement lag"
            icon={AlertTriangle}
            tone="warning"
          />
        </div>

        <Panel
          title="Mrs. Sunita Sharma — 7-Day Adherence Trend"
          description="Formula: Adherence = (Acknowledged Doses / Scheduled Doses) × 100"
        >
          <WeeklyDosesChart />
        </Panel>

        <Panel
          title="Medication Breakdown"
          description="Adherence rate isolated by active pharmacological entity"
        >
          <div className="space-y-3">
            {[
              { med: "Metformin 500 mg", rate: 92, note: "Evening dose missed twice this week" },
              { med: "Amlodipine 5 mg", rate: 100, note: "Perfect morning compliance" },
              { med: "Atorvastatin 10 mg", rate: 96, note: "Post-lunch acknowledgement steady" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy text-sm">{item.med}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-extrabold text-navy text-base">{item.rate}%</span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
