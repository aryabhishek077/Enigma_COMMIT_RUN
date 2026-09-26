import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  ShieldCheck,
  Pill,
  Clock,
  Calendar,
  Activity,
  ClipboardList,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
} from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { WeeklyDosesChart } from "@/components/care/charts";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/doctor/patients/$id")({
  component: DoctorPatientDetail,
});

function DoctorPatientDetail() {
  const [activeTab, setActiveTab] = useState<"overview" | "medications" | "prescriptions" | "adherence" | "history">("overview");
  const { prescriptions, doses, supply, adherencePercent } = useCare();

  return (
    <DashboardShell
      title="Patient Profile: Mrs. Sunita Sharma"
      subtitle="Authorized Doctor-Patient Connection · Code: SWS-P-8F42K91"
      badge="Active Consent"
      actions={
        <Button asChild variant="hero">
          <Link to="/doctor/prescriptions">
            <Upload className="size-4 mr-1.5" /> Prescribe / Add Rx
          </Link>
        </Button>
      }
    >
      <div className="space-y-6 max-w-6xl">
        {/* Patient Summary Header Card */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-primary-soft text-primary font-bold text-xl flex items-center justify-center font-display shrink-0">
              SS
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-navy">Mrs. Sunita Sharma</h2>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  SWS-P-8F42K91
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="size-3" /> ACTIVE AUTHORIZATION
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                62 years old · Female · Pune, Maharashtra · Connected since 15 August 2026
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Clinical Diagnosis: <span className="font-normal text-slate-600">Type 2 Diabetes Mellitus, Essential Hypertension</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div>
              <p className="text-[11px] uppercase font-bold text-muted-foreground">Overall Adherence</p>
              <p className="text-2xl font-extrabold text-navy mt-0.5">{adherencePercent}%</p>
              <p className="text-[11px] text-emerald-600 font-medium">Above target (80%)</p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-muted-foreground">Active Doses/Day</p>
              <p className="text-2xl font-extrabold text-navy mt-0.5">4</p>
              <p className="text-[11px] text-slate-500 font-medium">3 medicines</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "medications", label: "Medication Plan", icon: Pill },
            { id: "prescriptions", label: "Prescription History", icon: ClipboardList },
            { id: "adherence", label: "Adherence Record", icon: Clock },
            { id: "history", label: "Audit Log", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Current Verified Plan"
                value="Metformin + 2"
                caption="Last updated: Sep 26, 2026"
                icon={Pill}
                tone="primary"
              />
              <StatCard
                label="Weekly Acknowledged"
                value="25 / 28 doses"
                caption="89% deterministic rate"
                icon={CheckCircle2}
                tone="success"
              />
              <StatCard
                label="Caregiver Link"
                value="Rahul Sharma (Son)"
                caption="Authorized for alerts"
                icon={ShieldCheck}
                tone="navy"
              />
            </div>

            <Panel title="7-Day Dose Adherence Graph" description="Deterministic dose acknowledgements recorded from patient device">
              <WeeklyDosesChart />
            </Panel>
          </div>
        )}

        {/* TAB 2: MEDICATIONS */}
        {activeTab === "medications" && (
          <Panel title="Personalized Medication Plan" description="Prescription items mapped to patient's daily routine">
            <div className="grid gap-3">
              {doses.map((dose) => (
                <div key={dose.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {dose.time.split(" ")[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm">{dose.medicine} {dose.strength}</h4>
                      <p className="text-xs text-muted-foreground">{dose.amount} · {dose.instruction} · {dose.label}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    dose.status === "taken" ? "bg-emerald-100 text-emerald-800" :
                    dose.status === "missed" ? "bg-rose-100 text-rose-800" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {dose.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* TAB 3: PRESCRIPTIONS */}
        {activeTab === "prescriptions" && (
          <Panel
            title="Prescriptions on Record"
            description="Verified clinical orders and extracted items"
            action={
              <Button asChild size="sm">
                <Link to="/doctor/prescriptions">Add New Prescription</Link>
              </Button>
            }
          >
            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-5 rounded-2xl border border-border bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-navy">{rx.medicine} {rx.strength}</h4>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ DOCTOR VERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prescribed by {rx.doctorName} on {rx.date} · Duration: {rx.duration}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-500">ID: {rx.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Dosage</p>
                      <p className="font-bold text-navy mt-0.5">{rx.dose}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Frequency</p>
                      <p className="font-bold text-navy mt-0.5">{rx.frequency}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Timing</p>
                      <p className="font-bold text-navy mt-0.5">{rx.timing}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Instructions</p>
                      <p className="font-bold text-navy mt-0.5">{rx.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* TAB 4: ADHERENCE */}
        {activeTab === "adherence" && (
          <Panel title="Patient Adherence Analytics" description="Honest, deterministic adherence calculation without AI assumptions">
            <WeeklyDosesChart />
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-navy">Adherence Formula:</p>
              <code className="text-primary font-mono block mt-1">
                Adherence = (Acknowledged Doses / Scheduled Doses) × 100
              </code>
              <p className="mt-2 text-slate-600">
                Acknowledged doses today: {doses.filter(d => d.status === "taken").length} of {doses.length} scheduled.
              </p>
            </div>
          </Panel>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === "history" && (
          <Panel title="Security & Audit Trail" description="Immutable activity records for compliance and transparency">
            <div className="space-y-3 text-xs">
              {[
                { time: "Today 15:30", action: "AI Prescription Extraction completed for Metformin 500mg", actor: "System / Dr. Amit Sharma" },
                { time: "Today 15:32", action: "Prescription verified by Dr. Amit Sharma (MMC123456)", actor: "Dr. Amit Sharma" },
                { time: "Today 14:00", action: "Atorvastatin 10 mg dose marked as TAKEN by patient", actor: "Mrs. Sunita Sharma" },
                { time: "15 Aug 2026", action: "Doctor-Patient connection relationship activated", actor: "Patient SWS-P-8F42K91" },
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy">{log.action}</span>
                    <span className="text-muted-foreground ml-2">by {log.actor}</span>
                  </div>
                  <span className="font-mono text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </DashboardShell>
  );
}
