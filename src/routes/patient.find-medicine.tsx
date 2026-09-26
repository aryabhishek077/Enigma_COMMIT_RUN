import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Store,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
} from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/find-medicine")({
  head: () => ({
    meta: [{ title: "Find Medicine — Nearby Pharmacy Availability | Swasthya" }],
  }),
  component: PatientFindMedicine,
});

function PatientFindMedicine() {
  const { pharmaciesList, createPharmacyRequest, requests, doses, setCurrentRole } = useCare();

  const activeMetStrength = doses.find((d) => d.medicine.toLowerCase().includes("metformin"))?.strength || "500 mg";

  const [searchName, setSearchName] = useState("Metformin");
  const [searchStrength, setSearchStrength] = useState(activeMetStrength);

  // Sync if doctor updates strength in real-time
  useEffect(() => {
    if (activeMetStrength) {
      setSearchStrength(activeMetStrength);
    }
  }, [activeMetStrength]);
  const [searchForm, setSearchForm] = useState("Tablet");
  const [requestedPharmacies, setRequestedPharmacies] = useState<Record<string, boolean>>({});

  const handleRequest = (pharmacyId: string, pharmacyName: string) => {
    createPharmacyRequest(searchName, searchStrength, "2 strips (20 tablets)", pharmacyName);
    setRequestedPharmacies((prev) => ({ ...prev, [pharmacyId]: true }));
    toast.success("Availability Request Sent", {
      description: `Request sent to ${pharmacyName}. They will confirm live shelf stock shortly.`,
    });
  };

  const hasSentToAbc = requestedPharmacies["ph1"] || requests.some(r => r.medicine.toLowerCase().includes("metformin") && r.status === "pending");

  return (
    <DashboardShell
      title="Find Medicine Nearby"
      subtitle="Verify pharmacy stock availability before travelling — prevent wasted trips"
      badge="Stock Discovery"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Important Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Important Stock & Distance Notice</p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              <strong>Distance does NOT mean stock availability.</strong> Swasthya connects with local chemist counters to request live shelf verification. Unconnected pharmacies cannot report stock. Never travel before confirmation.
            </p>
          </div>
        </div>

        {/* Medicine Search Filter */}
        <Panel title="Medicine Query" description="Select the required medicine entity from your active prescription">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Medicine Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Strength
              </label>
              <input
                type="text"
                value={searchStrength}
                onChange={(e) => setSearchStrength(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Form
              </label>
              <select
                value={searchForm}
                onChange={(e) => setSearchForm(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary bg-white"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
              </select>
            </div>
          </div>
        </Panel>

        {/* Interactive Coordinate Map Visual */}
        <Panel title="Nearby Pharmacies (Pune - Kothrud Area)" description="Haversine geodesic distance radius from patient location">
          <div className="relative h-56 sm:h-64 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-4 flex items-center justify-center">
            {/* Grid Map Styling */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Patient Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="size-4 rounded-full bg-primary ring-4 ring-primary/30 animate-ping absolute" />
              <div className="size-4 rounded-full bg-primary mx-auto relative z-10" />
              <span className="block mt-1 text-[10px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700">
                You (Pune)
              </span>
            </div>

            {/* Pharmacy Pins */}
            {pharmaciesList.map((ph) => (
              <div
                key={ph.id}
                style={{ top: `${ph.y}%`, left: `${ph.x}%` }}
                className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold transition shadow-md ${
                    ph.connected ? "bg-emerald-500 group-hover:scale-110" : "bg-slate-600"
                  }`}
                >
                  <Store className="size-3.5" />
                </div>
                <span className="block mt-1 text-[10px] font-bold text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-700">
                  {ph.name} ({ph.distanceKm} km)
                </span>
              </div>
            ))}

            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" /> Connected Chemist
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-500" /> Unconnected Chemist
              </span>
            </div>
          </div>
        </Panel>

        {/* Pharmacy List with Live Request Button */}
        <Panel
          title="Pharmacy Availability Status"
          description="Send direct digital availability requests to connected chemist counters"
        >
          <div className="grid gap-4">
            {pharmaciesList.map((ph) => {
              const isRequested = requestedPharmacies[ph.id];

              return (
                <div
                  key={ph.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        ph.connected
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Store className="size-6" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-navy text-base">{ph.name}</h4>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {ph.distanceKm} km away
                        </span>
                        {ph.connected ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" /> Connected
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Not Connected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {ph.area}, Pune · {ph.open}
                        {ph.connected ? " · Last reported stock active 10 minutes ago" : " · Cannot report live stock"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {ph.connected ? (
                      isRequested ? (
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                          <CheckCircle2 className="size-4 text-emerald-600" /> Request Sent (Pending)
                        </div>
                      ) : (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleRequest(ph.id, ph.name)}
                        >
                          <Send className="size-3.5 mr-1.5" /> REQUEST AVAILABILITY
                        </Button>
                      )
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">
                        Availability Unverifiable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hackathon Demo Step Guide */}
          {hasSentToAbc && (
            <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div>
                <p className="text-xs font-bold text-navy uppercase tracking-wider">Next Step in Hackathon Demo:</p>
                <p className="text-sm text-slate-700">
                  Switch to <strong>Pharmacy Portal (ABC Medical)</strong> to view the incoming request and confirm stock!
                </p>
              </div>
              <Button asChild variant="hero" size="sm" className="shrink-0">
                <Link
                  to="/pharmacy/dashboard"
                  onClick={() => setCurrentRole("pharmacy")}
                >
                  Open Pharmacy Ops <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
