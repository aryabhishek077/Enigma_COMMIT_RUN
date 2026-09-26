import { createFileRoute } from "@tanstack/react-router";
import { Pill, Package, CheckCircle2, Clock } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/pharmacy/inventory")({
  head: () => ({
    meta: [{ title: "Pharmacy Inventory — ABC Medical | Swasthya" }],
  }),
  component: PharmacyInventoryPage,
});

function PharmacyInventoryPage() {
  const stockItems = [
    { name: "Metformin 500 mg", category: "Antidiabetic", strips: 45, status: "In Stock", updated: "10m ago" },
    { name: "Amlodipine 5 mg", category: "Antihypertensive", strips: 30, status: "In Stock", updated: "25m ago" },
    { name: "Atorvastatin 10 mg", category: "Lipid Lowering", strips: 20, status: "In Stock", updated: "1h ago" },
    { name: "Levothyroxine 50 mcg", category: "Thyroid hormone", strips: 15, status: "In Stock", updated: "2h ago" },
    { name: "Ferrous ascorbate 100 mg", category: "Iron supplement", strips: 0, status: "Out of Stock", updated: "3h ago" },
  ];

  return (
    <DashboardShell
      title="Counter Inventory Status"
      subtitle="Reported live shelf stock for Swasthya digital network queries"
      badge="Connected Stock"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel title="Active Shelf Entities" description="Verified stock counts used for rapid availability replies">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3">Medicine & Strength</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">On-Hand Count</th>
                  <th className="pb-3">Availability</th>
                  <th className="pb-3 text-right">Last Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {stockItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-accent/40">
                    <td className="py-3.5 font-bold text-navy">{item.name}</td>
                    <td className="py-3.5 text-xs text-muted-foreground">{item.category}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{item.strips} strips</td>
                    <td className="py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.strips > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-xs text-muted-foreground font-mono">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
