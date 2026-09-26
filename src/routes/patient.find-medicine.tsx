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
  Navigation,
  Sparkles,
  Loader2,
  Crosshair,
  Building2,
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

interface PharmacyWithCoords {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  open: string;
  connected: boolean;
  x: number;
  y: number;
}

const REGIONAL_PHARMACIES: PharmacyWithCoords[] = [
  // Pune Area (Sunita Sharma Home Region)
  { id: "ph1", name: "ABC Medical", area: "Kothrud", city: "Pune", lat: 18.5074, lng: 73.8077, distanceKm: 1.2, open: "Open till 11 PM", connected: true, x: 32, y: 34 },
  { id: "ph2", name: "Sanjeevani Pharmacy", area: "Karve Nagar", city: "Pune", lat: 18.4912, lng: 73.8214, distanceKm: 2.4, open: "Open till 10 PM", connected: true, x: 68, y: 26 },
  { id: "ph3", name: "Shree Medico", area: "Warje", city: "Pune", lat: 18.4789, lng: 73.7932, distanceKm: 3.1, open: "Open 24 hours", connected: false, x: 58, y: 70 },
  { id: "ph4", name: "Nirmal Chemists", area: "Erandwane", city: "Pune", lat: 18.5112, lng: 73.8341, distanceKm: 3.8, open: "Open till 9 PM", connected: true, x: 22, y: 74 },
  // Bengaluru Area (Caregiver Rahul Sharma Region)
  { id: "ph-blr-1", name: "Apollo Pharmacy — Indiranagar", area: "Indiranagar", city: "Bengaluru", lat: 12.9784, lng: 77.6408, distanceKm: 0.8, open: "Open 24 hours", connected: true, x: 38, y: 38 },
  { id: "ph-blr-2", name: "MedPlus Chemist — Koramangala", area: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245, distanceKm: 2.1, open: "Open till 11 PM", connected: true, x: 62, y: 30 },
  // Mumbai Area
  { id: "ph-mum-1", name: "Noble Medical Store", area: "Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295, distanceKm: 1.4, open: "Open 24 hours", connected: true, x: 35, y: 35 },
  // Delhi Area
  { id: "ph-del-1", name: "Fortis Health Chemist", area: "Connaught Place", city: "Delhi", lat: 28.6315, lng: 77.2167, distanceKm: 1.1, open: "Open till 10 PM", connected: true, x: 45, y: 40 },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const PRESET_LOCATIONS = [
  { label: "Pune — Kothrud (Mrs. Sunita Sharma Home)", city: "Pune", lat: 18.5074, lng: 73.8077 },
  { label: "Pune — Shivajinagar / Camp", city: "Pune", lat: 18.5314, lng: 73.8446 },
  { label: "Bengaluru — Indiranagar (Caregiver Rahul Sharma)", city: "Bengaluru", lat: 12.9716, lng: 77.6412 },
  { label: "Mumbai — Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { label: "Delhi — Connaught Place", city: "Delhi", lat: 28.6315, lng: 77.2167 },
];

function PatientFindMedicine() {
  const { createPharmacyRequest, requests, doses, setCurrentRole } = useCare();

  const activeMetStrength = doses.find((d) => d.medicine.toLowerCase().includes("metformin"))?.strength || "500 mg";

  const [searchName, setSearchName] = useState("Metformin");
  const [searchStrength, setSearchStrength] = useState(activeMetStrength);
  const [searchForm, setSearchForm] = useState("Tablet");

  // Location State
  const [selectedLocationIdx, setSelectedLocationIdx] = useState<number>(0);
  const [customLocationText, setCustomLocationText] = useState("");
  const [isUsingCustom, setIsUsingCustom] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number; label: string }>({
    lat: 18.5074,
    lng: 73.8077,
    label: "Pune — Kothrud (Patient Location)",
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  const [requestedPharmacies, setRequestedPharmacies] = useState<Record<string, boolean>>({});

  // Sync if doctor updates strength in real-time
  useEffect(() => {
    if (activeMetStrength) {
      setSearchStrength(activeMetStrength);
    }
  }, [activeMetStrength]);

  // Handle GPS Geolocation
  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation Not Supported", {
        description: "Your browser does not support HTML5 GPS location. Please select a city/area manually.",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoords({
          lat,
          lng,
          label: `My Live GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
        });
        setIsUsingCustom(true);
        setCustomLocationText(`Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        toast.success("Location Acquired via GPS", {
          description: `Discovered pharmacies within radius of ${lat.toFixed(3)}, ${lng.toFixed(3)}.`,
        });
      },
      (err) => {
        setIsLocating(false);
        toast.info("GPS Access Simulated for Demo", {
          description: "Defaulted to Pune - Kothrud clinic radius. You can also pick Bengaluru, Mumbai, or Delhi.",
        });
      },
      { timeout: 8000 },
    );
  };

  // Handle Preset Change
  const handleLocationPresetChange = (idx: number) => {
    setSelectedLocationIdx(idx);
    setIsUsingCustom(false);
    const loc = PRESET_LOCATIONS[idx]!;
    setCurrentCoords({
      lat: loc.lat,
      lng: loc.lng,
      label: loc.label,
    });
    toast.info("Target Search Area Set", {
      description: `Searching pharmacies around ${loc.label}.`,
    });
  };

  // Perform Search
  const handlePerformSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => {
      setIsSearching(false);
      toast.success("Nearby Pharmacy Search Complete", {
        description: `Found pharmacies stocking ${searchName} ${searchStrength} near ${currentCoords.label}.`,
      });
    }, 400);
  };

  // Compute live distances from currentCoords to pharmacies
  const computedPharmacies = REGIONAL_PHARMACIES.map((ph) => {
    const dist = calculateDistanceKm(currentCoords.lat, currentCoords.lng, ph.lat, ph.lng);
    // If it's a different city, clamp to realistic localized search distance
    const adjustedDist = dist > 50 ? Math.round(((dist % 15) + 1.2) * 10) / 10 : dist;
    return {
      ...ph,
      distanceKm: adjustedDist,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const handleRequest = (pharmacyId: string, pharmacyName: string) => {
    createPharmacyRequest(searchName, searchStrength, "2 strips (20 tablets)", pharmacyName);
    setRequestedPharmacies((prev) => ({ ...prev, [pharmacyId]: true }));
    toast.success("Availability Request Sent", {
      description: `Real-time availability check dispatched to ${pharmacyName} for ${searchName} ${searchStrength}.`,
    });
  };

  const hasSentToAbc = requestedPharmacies["ph1"] || requests.some(r => r.medicine.toLowerCase().includes("metformin") && r.status === "pending");

  return (
    <DashboardShell
      title="Find Medicine Nearby"
      subtitle="Locate connected chemist counters across any city or GPS location — verify live shelf stock"
      badge="Geodesic Stock Discovery"
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

        {/* LOCATION SELECTOR PANEL ("Where I am not sitting") */}
        <Panel
          title="Patient Search Location (Search in Any City / Region)"
          description="Specify patient location or search remotely for family members living in other cities"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Preset Selector */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" /> Target Location / City Area
                </label>
                <select
                  value={isUsingCustom ? "custom" : selectedLocationIdx}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsUsingCustom(true);
                    } else {
                      handleLocationPresetChange(Number(e.target.value));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary bg-white shadow-sm"
                >
                  {PRESET_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={idx}>
                      📍 {loc.label}
                    </option>
                  ))}
                  <option value="custom">✏️ Custom City or GPS Location</option>
                </select>
              </div>

              {/* GPS Geolocation Button */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 opacity-0">
                  GPS Action
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUseGpsLocation}
                  disabled={isLocating}
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-[42px] flex items-center justify-center gap-2"
                >
                  {isLocating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Navigation className="size-4 text-primary" />
                  )}
                  {isLocating ? "Acquiring GPS..." : "Use My Live GPS"}
                </Button>
              </div>
            </div>

            {/* Custom Location input if enabled */}
            {isUsingCustom && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 animate-fade-in">
                <Crosshair className="size-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Enter custom area, landmark, or city (e.g. Bandra, Mumbai or Indiranagar, Bengaluru)"
                  value={customLocationText}
                  onChange={(e) => setCustomLocationText(e.target.value)}
                  className="flex-1 bg-transparent border-0 text-sm font-semibold text-navy focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (customLocationText.trim()) {
                      setCurrentCoords({
                        lat: 18.5204,
                        lng: 73.8567,
                        label: customLocationText.trim(),
                      });
                      toast.success("Location Updated", {
                        description: `Searching around ${customLocationText.trim()}.`,
                      });
                    }
                  }}
                >
                  Set Location
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="font-semibold text-slate-500">Currently Calculating Radius From:</span>
              <span className="font-bold text-navy bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {currentCoords.label}
              </span>
            </div>
          </div>
        </Panel>

        {/* Medicine Search Filter & SEARCH BUTTON */}
        <Panel title="Medicine Query & Filters" description="Select the required medicine entity from your active prescription">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g. Metformin"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary shadow-sm"
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
                  placeholder="e.g. 500 mg or 850 mg"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary shadow-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Form
                </label>
                <select
                  value={searchForm}
                  onChange={(e) => setSearchForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:border-primary bg-white shadow-sm"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
            </div>

            {/* EXPLICIT SEARCH BUTTON (CRITICAL FIX FOR USER REQUEST) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-muted-foreground">
                Showing chemists holding digital integration with Swasthya
              </span>
              <Button
                variant="hero"
                size="lg"
                onClick={handlePerformSearch}
                disabled={isSearching}
                className="w-full sm:w-auto shadow-md font-bold px-8"
              >
                {isSearching ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Search className="size-4 mr-2" />
                )}
                {isSearching ? "Searching Stores..." : "SEARCH NEARBY PHARMACIES"}
              </Button>
            </div>
          </div>
        </Panel>

        {/* Interactive Coordinate Map Visual */}
        <Panel
          title={`Pharmacy Map Radius · ${currentCoords.label}`}
          description="Geodesic distance radius dynamically centered on the chosen patient location"
        >
          <div className="relative h-60 sm:h-72 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-4 flex items-center justify-center">
            {/* Grid Map Styling */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Target Location Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="size-5 rounded-full bg-primary ring-4 ring-primary/40 animate-ping absolute" />
              <div className="size-5 rounded-full bg-primary mx-auto relative z-10 flex items-center justify-center text-white">
                <MapPin className="size-3" />
              </div>
              <span className="block mt-1 text-[10px] font-bold text-white bg-slate-800/95 px-2 py-0.5 rounded-full border border-slate-700 whitespace-nowrap shadow-lg">
                📍 {currentCoords.label.split("—")[0] || "Target"}
              </span>
            </div>

            {/* Pharmacy Pins */}
            {computedPharmacies.slice(0, 4).map((ph, idx) => (
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
                <span className="block mt-1 text-[10px] font-bold text-slate-200 bg-slate-800/90 px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-700">
                  {ph.name} ({ph.distanceKm} km)
                </span>
              </div>
            ))}

            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" /> Connected Chemist Counter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-500" /> Unconnected Chemist
              </span>
            </div>
          </div>
        </Panel>

        {/* Pharmacy List with Live Request Button */}
        <Panel
          title={`Available Pharmacies (${computedPharmacies.length} nearby)`}
          description={`Showing chemist stores near ${currentCoords.label} offering ${searchName} ${searchStrength}`}
        >
          <div className="grid gap-4">
            {computedPharmacies.map((ph) => {
              const isRequested = requestedPharmacies[ph.id];

              return (
                <div
                  key={ph.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition shadow-sm"
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
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {ph.distanceKm} km from {currentCoords.label.split("—")[0]}
                        </span>
                        {ph.connected ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" /> Connected Chemist
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Not Connected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {ph.area}, {ph.city} · {ph.open}
                        {ph.connected ? " · Live digital availability verification enabled" : " · Cannot report live stock digitally"}
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
                          className="shadow-sm font-bold"
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
                  Go to Pharmacy Portal <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
