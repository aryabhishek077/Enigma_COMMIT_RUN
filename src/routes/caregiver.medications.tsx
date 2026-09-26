import { createFileRoute } from "@tanstack/react-router";
import { Pill, Lock, ShieldCheck } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/caregiver/medications")({
  component: CaregiverMedicationsPage,
});

function CaregiverMedicationsPage() {
  const { doses, supply } = useCare();

  const handleEditAttempt = () => {
    toast.error("Action Not Allowed", {
      description: "Medication changes must be made by the prescribing doctor.",
    });
  };

  return (
    <DashboardShell
      title="Monitored Medications (Read-Only)"
      subtitle="Supervised care view for Rahul Sharma · Patient: Mrs. Sunita Sharma"
      badge="Read-Only Consent"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel title="Active Medication Regimen" description="Prescribed and verified by Dr. Amit Sharma">
          <div className="grid gap-3 sm:grid-cols-2">
            {doses.map((dose) => (
              <div key={dose.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy text-sm">{dose.medicine} {dose.strength}</h4>
                  <p className="text-xs text-muted-foreground">{dose.amount} · {dose.instruction} · {dose.time}</p>
                </div>
                <button
                  onClick={handleEditAttempt}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 border border-dashed border-slate-300 px-2.5 py-1 rounded"
                >
                  <Lock className="size-3" /> Edit
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Current Medicine Supply" description="Days remaining calculated deterministically based on daily dose">
          <div className="grid gap-4 sm:grid-cols-3">
            {supply.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-border bg-card">
                <h4 className="font-bold text-navy text-sm">{s.medicine} {s.strength}</h4>
                <p className="text-xl font-bold text-navy mt-1">{s.tabletsLeft} tablets</p>
                <p className="text-xs text-muted-foreground">{s.daysRemaining} days remaining</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
