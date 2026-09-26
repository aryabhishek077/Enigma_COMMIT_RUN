import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, ArrowRight, UserCheck, Stethoscope } from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Portal — Doctor Verification | Swasthya" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { doctorVerification, verifyDoctor, rejectDoctor, setCurrentRole } = useCare();

  const handleVerify = () => {
    verifyDoctor();
    toast.success("Doctor Verified", {
      description: "Dr. Amit Sharma's medical council registration is now verified.",
    });
  };

  const handleReject = () => {
    rejectDoctor();
    toast.error("Doctor Rejected", {
      description: "Registration flagged for further manual document audit.",
    });
  };

  return (
    <DashboardShell
      title="Admin — Medical Council Verification"
      subtitle="Prototype simulation of doctor credential and state medical council verification"
      badge="Admin System"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Prototype Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Prototype verification flow</p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Production version would integrate with an appropriate official medical-registration verification mechanism (e.g. National Medical Commission / State Medical Council API). This prototype simulates the credential audit and authorization flag.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Pending Verifications"
            value={doctorVerification.status === "PENDING" ? "1" : "0"}
            tone={doctorVerification.status === "PENDING" ? "warning" : "success"}
            caption="Applications awaiting review"
            icon={UserCheck}
          />
          <StatCard
            label="Verified Doctors"
            value={doctorVerification.status === "VERIFIED" ? "1" : "0"}
            tone="success"
            caption="Active clinical prescribers"
            icon={ShieldCheck}
          />
          <StatCard
            label="Council Registries"
            value="Maharashtra (MMC)"
            tone="navy"
            caption="State Medical Council link"
            icon={Stethoscope}
          />
        </div>

        {/* Verification Request Table / Card */}
        <Panel
          title="Doctor Verification Requests"
          description="Review incoming medical practitioner credentials before clinical access is granted"
        >
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-display">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-navy">{doctorVerification.doctorName}</h3>
                    {doctorVerification.status === "VERIFIED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="size-3.5" /> Medical Registration Verified
                      </span>
                    )}
                    {doctorVerification.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        PENDING AUDIT
                      </span>
                    )}
                    {doctorVerification.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        REJECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Specialization: <strong className="text-slate-800">{doctorVerification.specialization}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {doctorVerification.status === "PENDING" ? (
                  <>
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleVerify}>
                      <CheckCircle2 className="size-4 mr-1.5" /> VERIFY DOCTOR
                    </Button>
                    <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={handleReject}>
                      <XCircle className="size-4 mr-1.5" /> REJECT
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => verifyDoctor()}>
                    Re-verify Doctor
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
              <div>
                <p className="text-slate-500 uppercase font-semibold text-[11px] tracking-wider">State Medical Council</p>
                <p className="font-bold text-navy mt-1 text-sm">{doctorVerification.council}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-semibold text-[11px] tracking-wider">Registration Number</p>
                <p className="font-bold font-mono text-navy mt-1 text-sm">{doctorVerification.regNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-semibold text-[11px] tracking-wider">Verification Status</p>
                <p className={`font-bold mt-1 text-sm ${doctorVerification.status === "VERIFIED" ? "text-emerald-700" : "text-amber-700"}`}>
                  {doctorVerification.status === "VERIFIED" ? "✓ Verified (Active)" : "Pending Admin Review"}
                </p>
              </div>
            </div>
          </div>

          {/* Next Step Navigation */}
          {doctorVerification.status === "VERIFIED" && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Next Step in Hackathon Demo:</p>
                <p className="text-sm text-emerald-800">
                  Dr. Amit Sharma is verified! Switch to Doctor view to upload the prescription.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link
                  to="/doctor/dashboard"
                  onClick={() => setCurrentRole("doctor")}
                >
                  Continue to Doctor Portal <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
