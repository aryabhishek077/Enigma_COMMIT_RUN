import { createFileRoute, Link } from "@tanstack/react-router";
import { Pill, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/patient/medications")({
  component: PatientMedicationsPage,
});

function PatientMedicationsPage() {
  const { doses, supply } = useCare();

  return (
    <DashboardShell
      title="My Active Medications"
      subtitle="Personalized medication regimens verified by Dr. Amit Sharma"
      badge="Doctor Verified"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel title="Active Prescribed Schedule" description="Every dose is synchronized with your daily routine">
          <div className="grid gap-3 sm:grid-cols-2">
            {doses.map((dose) => (
              <div key={dose.id} className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {dose.label} ({dose.time})
                    </span>
                    <h3 className="font-bold text-navy text-base mt-2">{dose.medicine} {dose.strength}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{dose.amount} · {dose.instruction}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                    dose.status === "taken" ? "bg-emerald-100 text-emerald-800" :
                    dose.status === "missed" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {dose.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Current Tablet Supply & Refill Prediction" description="Formula: Days Remaining = Current Tablets / Daily Consumption">
          <div className="grid gap-3 sm:grid-cols-3">
            {supply.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl border border-border bg-card">
                <h4 className="font-bold text-navy text-sm">{s.medicine} {s.strength}</h4>
                <p className="text-2xl font-extrabold text-navy mt-2">{s.tabletsLeft} tablets</p>
                <p className="text-xs text-muted-foreground mt-0.5">Approx. {s.daysRemaining} days remaining</p>
                {s.daysRemaining <= 5 && (
                  <div className="mt-3">
                    <Button asChild size="sm" variant="hero" className="w-full">
                      <Link to="/patient/find-medicine">Find Nearby Stock</Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
