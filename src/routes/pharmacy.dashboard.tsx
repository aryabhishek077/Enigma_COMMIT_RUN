import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  AlertCircle,
} from "lucide-react";
import { DashboardShell, Panel, StatCard } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/pharmacy/dashboard")({
  head: () => ({
    meta: [{ title: "Pharmacy Operations — ABC Medical | Swasthya" }],
  }),
  component: PharmacyDashboard,
});

function PharmacyDashboard() {
  const { requests, respondToRequest, setCurrentRole } = useCare();

  const handleRespond = (id: string, status: "confirmed" | "unavailable", medicine: string) => {
    respondToRequest(id, status);
    if (status === "confirmed") {
      toast.success("Stock Confirmed", {
        description: `ABC Medical confirmed availability of ${medicine}. Patient notified.`,
      });
    } else {
      toast.error("Stock Unavailable", {
        description: `Marked as unavailable. Patient notified to check alternative chemists.`,
      });
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const confirmedCount = requests.filter((r) => r.status === "confirmed").length;
  const unavailableCount = requests.filter((r) => r.status === "unavailable").length;

  return (
    <DashboardShell
      title="ABC Medical — Operations Counter"
      subtitle="Kothrud, Pune · Connected Digital Chemist Counter · Lat 18.5074, Lng 73.8077"
      badge="Connected Chemist"
    >
      <div className="space-y-6 max-w-5xl">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Requests Today"
            value={requests.length.toString()}
            caption="Live patient enquiries"
            icon={Store}
            tone="navy"
          />
          <StatCard
            label="Confirmed Stock"
            value={confirmedCount.toString()}
            caption="Stock held on counter"
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Pending Action"
            value={pendingCount.toString()}
            caption="Awaiting physical shelf check"
            icon={Clock}
            tone="warning"
          />
          <StatCard
            label="Unavailable"
            value={unavailableCount.toString()}
            caption="Out of stock reported"
            icon={XCircle}
            tone="danger"
          />
        </div>

        {/* Live Incoming Requests Queue */}
        <Panel
          title="Live Medicine Availability Enquiries"
          description="Patients from nearby clinics requesting real-time shelf stock confirmation"
        >
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  req.status === "pending"
                    ? "bg-amber-50/40 border-amber-300 shadow-sm"
                    : req.status === "confirmed"
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      req.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : req.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Package className="size-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-navy text-base">
                        {req.medicine} {req.strength}
                      </h4>
                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Quantity: {req.quantity}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      Patient: <strong className="text-slate-800">{req.patientLabel}</strong> · Received {req.time}
                    </p>

                    <div className="mt-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.status === "pending"
                            ? "bg-amber-200/80 text-amber-900 animate-pulse"
                            : req.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        Status: {req.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pharmacist Action Buttons */}
                <div className="flex items-center gap-2">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        size="sm"
                        onClick={() => handleRespond(req.id, "confirmed", `${req.medicine} ${req.strength}`)}
                      >
                        <CheckCircle2 className="size-4 mr-1.5" /> AVAILABLE
                      </Button>
                      <Button
                        variant="outline"
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold"
                        size="sm"
                        onClick={() => handleRespond(req.id, "unavailable", `${req.medicine} ${req.strength}`)}
                      >
                        <XCircle className="size-4 mr-1.5" /> NOT AVAILABLE
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 italic">
                      Response Recorded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Hackathon Completion Banner */}
          {confirmedCount > 0 && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div>
                <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Demo Journey Complete!</p>
                <p className="text-sm text-emerald-800">
                  You confirmed stock for Mrs. Sunita Sharma! Switch back to Patient View to see the confirmed live status banner.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                <Link
                  to="/patient/dashboard"
                  onClick={() => setCurrentRole("patient")}
                >
                  Return to Patient Dashboard <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
