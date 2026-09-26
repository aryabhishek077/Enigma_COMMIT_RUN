import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, ShieldCheck } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/patient/prescriptions")({
  component: PatientPrescriptionsPage,
});

function PatientPrescriptionsPage() {
  const { prescriptions } = useCare();

  const activePrescriptions = prescriptions.filter((rx) => rx.status !== "SUPERSEDED");

  return (
    <DashboardShell
      title="My Verified Prescriptions"
      subtitle="Clinical orders authorized and signed by your registered physician"
      badge="Doctor Signed"
    >
      <div className="space-y-4 max-w-5xl">
        {activePrescriptions.map((rx) => (
          <div key={rx.id} className="p-6 rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-navy text-lg">{rx.medicine} {rx.strength}</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    ✓ Doctor Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prescribed by {rx.doctorName} · Date: {rx.date}
                </p>
              </div>
              <span className="font-mono text-xs text-slate-400">Order ID: {rx.id}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Dosage Amount</p>
                <p className="font-bold text-navy text-sm mt-0.5">{rx.dose}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Frequency</p>
                <p className="font-bold text-navy text-sm mt-0.5">{rx.frequency}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Timing</p>
                <p className="font-bold text-navy text-sm mt-0.5">{rx.timing}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Instructions</p>
                <p className="font-bold text-navy text-sm mt-0.5">{rx.instructions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
