import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake,
  ShieldCheck,
  AlertTriangle,
  Pill,
  Clock,
  ArrowRight,
  Lock,
  CheckCircle2,
  Bell,
  Activity,
} from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/caregiver/dashboard")({
  head: () => ({
    meta: [{ title: "Caregiver Portal — Rahul Sharma | Swasthya" }],
  }),
  component: CaregiverDashboard,
});

function CaregiverDashboard() {
  const { adherencePercent, takenCount, doses, supply, hasRepeatedMissed, alerts } = useCare();
  const [showBoundaryModal, setShowBoundaryModal] = useState(false);

  const metforminSupply = supply.find((s) => s.medicine.toLowerCase().includes("metformin")) ?? supply[0];

  const handleAttemptDosageChange = () => {
    toast.error("Action Prohibited by Security Policy", {
      description: "Medication changes must be made by the prescribing doctor.",
    });
    setShowBoundaryModal(true);
  };

  return (
    <DashboardShell
      title="Rahul Sharma"
      subtitle="Authorized Caregiver (Son · Bengaluru) · Monitoring: Mrs. Sunita Sharma"
      badge="Authorized Oversight"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Meaningful Alert Banner */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                Pattern-Based Alert
              </span>
              <h3 className="font-extrabold text-navy text-base mt-1.5">
                Sunita has missed the evening medication acknowledgement multiple times this week
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Swasthya filters out single isolated delays and only alerts caregivers for repeated missed acknowledgements (8:00 PM Metformin dose).
              </p>
            </div>
          </div>

          <Button asChild size="sm" variant="default" className="bg-amber-700 hover:bg-amber-800 text-white shrink-0">
            <Link to="/caregiver/alerts">VIEW DETAILS</Link>
          </Button>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Patient Adherence"
            value={`${adherencePercent}%`}
            caption="Deterministic 7-day rate"
            icon={Activity}
            tone={adherencePercent >= 80 ? "success" : "warning"}
          />
          <StatCard
            label="Today's Progress"
            value={`${takenCount} / ${doses.length}`}
            caption="Doses acknowledged"
            icon={CheckCircle2}
            tone="primary"
          />
          <StatCard
            label="Metformin Supply"
            value={`${metforminSupply?.daysRemaining ?? 3} Days`}
            caption="Estimated supply left"
            icon={Pill}
            tone="danger"
          />
          <StatCard
            label="Connected Doctor"
            value="Dr. Amit Sharma"
            caption="Clinical authority"
            icon={ShieldCheck}
            tone="navy"
          />
        </div>

        {/* Patient Status Overview */}
        <Panel
          title="Monitored Patient: Mrs. Sunita Sharma (Pune)"
          description="Access governed by explicit patient authorization agreement"
          action={
            <Button size="sm" variant="outline" onClick={handleAttemptDosageChange} className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50">
              <Lock className="size-3.5 mr-1" /> Test Dosage Edit Security
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-navy text-sm">Medicine Supply Alert: Metformin 500 mg</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  6 tablets remaining · Approx. 3 days remaining based on 2 tablets/day consumption.
                </p>
              </div>
              <Button asChild size="sm" variant="hero">
                <Link to="/patient/find-medicine">Find Pharmacy Stock Nearby</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {doses.map((dose) => (
                <div key={dose.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy">{dose.medicine} {dose.strength}</span>
                    <p className="text-muted-foreground">{dose.time} ({dose.label})</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                    dose.status === "taken" ? "bg-emerald-100 text-emerald-800" :
                    dose.status === "missed" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {dose.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Security Policy Guardrail Modal / Alert */}
        {showBoundaryModal && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-3 animate-fade-in">
            <Lock className="size-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950">Security Rule Enforced</p>
              <p className="mt-0.5 text-rose-900 leading-relaxed">
                <strong>Medication changes must be made by the prescribing doctor.</strong> Caregiver accounts are strictly granted view and escalation permissions. Clinical modifications cannot be authorized by family members.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
