import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Pill,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  UserCheck,
} from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/doctor/dashboard")({
  head: () => ({
    meta: [{ title: "Doctor Portal — Overview | Swasthya" }],
  }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const { doctorVerification, doctorPatientRels, prescriptions, doses } = useCare();

  const isVerified = doctorVerification.status === "VERIFIED";

  return (
    <DashboardShell
      title="Dr. Amit Sharma"
      subtitle="General Medicine · Maharashtra Medical Council (MMC123456)"
      badge={isVerified ? "Registration Verified" : "Verification Pending"}
      actions={
        <Button asChild variant="hero">
          <Link to="/doctor/prescriptions">
            <Upload className="size-4 mr-1.5" /> Upload Prescription
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Verification Status Banner if not verified */}
        {!isVerified ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Doctor Verification Pending:</strong> Admin has not yet verified your registration MMC123456.
              </span>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-900">
              <Link to="/admin/dashboard">Go to Admin to Verify</Link>
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Medical Registration Active:</strong> MMC123456 verified with Maharashtra Medical Council. Authorized for clinical prescription management.
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
              MMC123456
            </span>
          </div>
        )}

        {/* Doctor KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Authorized Patients"
            value="1"
            caption="Active consent agreements"
            icon={Users}
            tone="primary"
          />
          <StatCard
            label="Active Medication Plans"
            value={prescriptions.length.toString()}
            caption="Doctor-verified regimens"
            icon={Pill}
            tone="success"
          />
          <StatCard
            label="Patients Needing Attention"
            value="1"
            caption="Evening dose adherence lag"
            icon={AlertTriangle}
            tone="warning"
          />
          <StatCard
            label="Today's Reviews"
            value="2"
            caption="Scheduled check-ins"
            icon={Calendar}
            tone="navy"
          />
        </div>

        {/* Patient Table */}
        <Panel
          title="Authorized Patients"
          description="Patients who have granted explicit consent for medication-care supervision"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/doctor/patients">View All Patients</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pl-1">Patient Name</th>
                  <th className="pb-3">Patient Code</th>
                  <th className="pb-3">Medication Status</th>
                  <th className="pb-3">Adherence</th>
                  <th className="pb-3">Authorization</th>
                  <th className="pb-3">Last Activity</th>
                  <th className="pb-3 pr-1 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {doctorPatientRels.map((rel) => (
                  <tr key={rel.id} className="hover:bg-accent/40 transition">
                    <td className="py-3.5 pl-1">
                      <div className="font-bold text-navy">{rel.patientName}</div>
                      <div className="text-xs text-muted-foreground">62 yrs · Type 2 Diabetes, HTN</div>
                    </td>
                    <td className="py-3.5 font-mono text-xs font-semibold text-primary">
                      {rel.patientCode}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Pill className="size-3.5" /> 3 Active Medicines
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "87%" }} />
                        </div>
                        <span className="font-bold text-xs text-navy">87%</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="size-3" /> ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-muted-foreground">Today (Evening pending)</td>
                    <td className="py-3.5 pr-1 text-right">
                      <Button asChild size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                        <Link to="/doctor/patients/$id" params={{ id: "p1" }}>
                          VIEW <ArrowRight className="size-3.5 ml-1" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Quick Demo Workflow Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy">Test the AI Prescription Extraction Flow</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload a prescription or click "Use Demo Prescription" to trigger the AI analysis and verification step.
            </p>
          </div>
          <Button asChild variant="hero" size="sm">
            <Link to="/doctor/prescriptions">
              Launch Prescription Flow <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
