import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/caregiver/alerts")({
  head: () => ({
    meta: [{ title: "Caregiver Alerts — Swasthya" }],
  }),
  component: CaregiverAlertsPage,
});

function CaregiverAlertsPage() {
  const { alerts } = useCare();

  return (
    <DashboardShell
      title="Meaningful Caregiver Alerts"
      subtitle="Smart alerts highlighting persistent adherence patterns without notification fatigue"
      badge="Alert Filtering Active"
    >
      <div className="space-y-4 max-w-4xl">
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <p className="font-bold text-navy uppercase tracking-wider mb-1">Fatigue Prevention Policy</p>
          <p>
            Swasthya deliberately does NOT notify caregivers for every individual dose delay. Caregivers are only alerted when a patient exhibits repeated missed patterns or supply thresholds drop below 5 days.
          </p>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border flex items-start gap-4 ${
                alert.tone === "warning" || alert.tone === "danger"
                  ? "bg-amber-50/60 border-amber-200 text-amber-950"
                  : "bg-card border-border text-navy"
              }`}
            >
              <div className="mt-0.5">
                {alert.tone === "warning" || alert.tone === "danger" ? (
                  <AlertTriangle className="size-5 text-amber-600" />
                ) : alert.tone === "success" ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <Info className="size-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  <span className="text-[11px] font-mono opacity-60">{alert.time}</span>
                </div>
                <p className="text-xs mt-1 opacity-80 leading-relaxed">{alert.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
