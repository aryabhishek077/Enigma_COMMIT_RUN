import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCheck, ShieldCheck, Pill, ArrowRight, UserPlus, Search } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/doctor/patients/")({
  component: DoctorPatientsList,
});

function DoctorPatientsList() {
  const { doctorPatientRels } = useCare();

  return (
    <DashboardShell
      title="Authorized Patients"
      subtitle="Supervised medication care relationships governed by patient consent"
      badge="Doctor Supervision"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel
          title="Active Doctor-Patient Relationships"
          description="Every patient profile requires mutual authorization before medical records are accessible"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">1 Active</span>
            </div>
          }
        >
          <div className="grid gap-4">
            {doctorPatientRels.map((rel) => (
              <div
                key={rel.id}
                className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center font-display">
                    SS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy text-base">{rel.patientName}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary-soft text-primary font-bold">
                        {rel.patientCode}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      62 yrs · Female · Pune · Authorized on {rel.createdAt}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="size-3.5" /> Doctor-Patient Authorized
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-600 font-medium">3 Active Prescriptions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="hero" size="sm">
                    <Link to="/doctor/patients/$id" params={{ id: "p1" }}>
                      Open Medical Profile <ArrowRight className="size-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Doctor Authorization Model explanation */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 text-xs leading-relaxed">
          <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">
            Doctor Authorization Model Note
          </p>
          <p>
            Doctor verification alone does NOT give unilateral access to every citizen. In Swasthya, patient access is strictly scoped to explicit <strong>doctor_patient_relationships</strong> with status ACTIVE. Patients generate and share their patient ID code (e.g., <code>SWS-P-8F42K91</code>) to authorize specific verified doctors.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
