import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/pharmacy/requests")({
  head: () => ({
    meta: [{ title: "Availability Requests History — Swasthya" }],
  }),
  component: PharmacyRequestsPage,
});

function PharmacyRequestsPage() {
  const { requests } = useCare();

  return (
    <DashboardShell
      title="Availability Requests Archive"
      subtitle="Complete chronological history of patient stock enquiries"
      badge="Audit Trail"
    >
      <div className="space-y-4 max-w-5xl">
        <Panel title="Historical Enquiry Log" description="Records of requests and chemist response actions">
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy text-sm">{r.medicine} {r.strength}</h4>
                  <p className="text-xs text-muted-foreground">{r.patientLabel} · Qty: {r.quantity} · {r.time}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  r.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                  r.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
