import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, ShieldCheck, Bell, Lock } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/patient/caregiver")({
  component: PatientCaregiverPage,
});

function PatientCaregiverPage() {
  return (
    <DashboardShell
      title="Caregiver Authorization"
      subtitle="Explicit patient authorization granting family members adherence oversight"
      badge="Consent Active"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel title="Authorized Family Caregiver" description="Status governed by caregiver_relationships record">
          <div className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base font-display">
                RS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-navy text-base">Rahul Sharma</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Relationship: Son · Location: Bengaluru · Linked: August 2026
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Granted Permissions: Adherence oversight & critical alerts
            </div>
          </div>
        </Panel>

        <Panel title="Caregiver Security Boundary" description="Strict architectural limitations on non-clinical roles">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Lock className="size-4 text-primary" /> Caregiver Permission Guardrails
            </div>
            <p>
              Caregivers can monitor daily adherence and receive meaningful repeated-missed alerts. However, caregivers <strong>CANNOT modify prescriptions, dosages, or frequencies</strong>. Any medication modifications must be made directly by the prescribing doctor.
            </p>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
