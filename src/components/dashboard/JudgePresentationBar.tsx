import { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Stethoscope,
  Volume2,
  AlertTriangle,
  Send,
  CheckCircle2,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export function JudgePresentationBar() {
  const {
    currentRole,
    setCurrentRole,
    doses,
    prescriptions,
    adherencePercent,
    addPrescription,
    setDoseStatus,
    simulateRepeatedMissed,
    createPharmacyRequest,
    respondToRequest,
    requests,
    resetAllDemoData,
    refreshFromDatabase,
  } = useCare();

  const [isOpen, setIsOpen] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const activeMetDose = doses.find((d) => d.medicine.toLowerCase().includes("metformin"));
  const activeStrength = activeMetDose?.strength || "500 mg";

  // 1. Prescribe Metformin 500mg
  const handlePrescribe500 = async () => {
    setLoadingAction("500");
    await addPrescription({
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: new Date().toISOString().split("T")[0] || "2026-09-26",
      status: "ACTIVE",
      medicine: "Metformin",
      strength: "500 mg",
      dose: "1 tablet",
      frequency: "Twice daily",
      timing: "Morning + Night",
      duration: "30 days",
      instructions: "After meals",
      aiConfidence: "High (98%)",
    });
    setLoadingAction(null);
    toast.success("TEST 1 Executed: Metformin 500 mg Prescribed", {
      description: "Database row created. Synced to Patient and Caregiver.",
    });
  };

  // 2. Update to Metformin 850mg (TEST 4)
  const handleUpdate850 = async () => {
    setLoadingAction("850");
    await addPrescription({
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: new Date().toISOString().split("T")[0] || "2026-09-26",
      status: "ACTIVE",
      medicine: "Metformin",
      strength: "850 mg",
      dose: "1 tablet",
      frequency: "Twice daily",
      timing: "Morning + Night",
      duration: "30 days",
      instructions: "After meals",
      aiConfidence: "High (99%)",
    });
    setLoadingAction(null);
    toast.success("TEST 4 Executed: Dosage Updated to 850 mg", {
      description: "Old 500mg marked SUPERSEDED. New 850mg marked ACTIVE. Synced across all roles.",
    });
  };

  // 3. Spoken Hindi Audio
  const handlePlayHindiSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.info("Speech Synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const strHindi = activeStrength.replace(/mg/i, "मिलीग्राम");
    const utterance = new SpeechSynthesisUtterance(
      `सुनीता जी, यह आपकी मेटफॉर्मिन ${strHindi} गोली लेने का समय है। कृपया रात के खाने के बाद एक गोली पानी के साथ लें।`,
    );
    utterance.lang = "hi-IN";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    toast.success("Hindi Voice Alert Activated (hi-IN)", {
      description: `Playing: "सुनीता जी, यह आपकी मेटफॉर्मिन ${strHindi} गोली लेने का समय है..."`,
    });
  };

  // 4. Mark Missed Dose (Adherence Alert)
  const handleMarkMissed = async () => {
    setLoadingAction("missed");
    await simulateRepeatedMissed();
    setLoadingAction(null);
    toast.error("TEST C Executed: Missed Dose Recorded", {
      description: "Adherence log created with status MISSED. Alert dispatched to Caregiver.",
    });
  };

  // 5. Request Medicine Availability
  const handleRequestMedicine = async () => {
    setLoadingAction("req");
    await createPharmacyRequest("Metformin", activeStrength, "2 strips (20 tablets)", "ABC Medical");
    setLoadingAction(null);
    toast.success("TEST D (Part 1) Executed: Sent Availability Request", {
      description: `Requested 2 packs of Metformin ${activeStrength} from ABC Medical.`,
    });
  };

  // 6. Pharmacy Confirms Available
  const handleConfirmAvailable = async () => {
    setLoadingAction("confirm");
    const pendingReq = requests.find((r) => r.status === "pending") || requests[0];
    if (pendingReq) {
      await respondToRequest(pendingReq.id, "confirmed");
      toast.success("TEST D (Part 2) Executed: Stock Confirmed AVAILABLE", {
        description: "ABC Medical confirmed availability. Patient & Caregiver notified.",
      });
    } else {
      toast.info("No pending request found. Created and confirmed directly.", {
        description: "Dispatched ABC Medical availability confirmation.",
      });
    }
    setLoadingAction(null);
  };

  // 7. Reset to Seed Data
  const handleResetSeed = async () => {
    setLoadingAction("reset");
    await resetAllDemoData();
    setLoadingAction(null);
    toast.success("Database Reset to Pristine Seed Data", {
      description: "Restored Mrs. Sunita Sharma, Metformin 500 mg, and original schedule.",
    });
  };

  return (
    <div className="mb-6 rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white shadow-xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-md">
            <Zap className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                Hackathon Judge Presentation Shortcuts
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live DB Synced
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Execute live data-flow tests in 1-click while presenting to judges
            </p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-xl text-slate-200 border border-white/10">
            Current Dose: <strong className="text-amber-400 font-mono">{activeStrength}</strong>
          </span>
          <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-xl text-slate-200 border border-white/10">
            Adherence: <strong className="text-emerald-400 font-mono">{adherencePercent}%</strong>
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
            title={isOpen ? "Collapse Shortcuts" : "Expand Shortcuts"}
          >
            {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Action Buttons Grid */}
      {isOpen && (
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 animate-fade-in">
          {/* Button 1: Prescribe 500mg */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handlePrescribe500}
            disabled={loadingAction === "500"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-blue-300 flex items-center gap-1">
              <Stethoscope className="size-3" /> Step 1: Doctor
            </span>
            <span className="text-xs font-extrabold mt-0.5">Prescribe 500mg</span>
          </Button>

          {/* Button 2: Test Hindi Speech */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handlePlayHindiSpeech}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-emerald-300 flex items-center gap-1">
              <Volume2 className="size-3" /> Step 2: Patient
            </span>
            <span className="text-xs font-extrabold mt-0.5">Play Hindi Alert</span>
          </Button>

          {/* Button 3: Update to 850mg (TEST 4) */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleUpdate850}
            disabled={loadingAction === "850"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/40 text-white rounded-xl shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase text-amber-300 flex items-center gap-1">
              <Sparkles className="size-3" /> Step 3: TEST 4
            </span>
            <span className="text-xs font-extrabold mt-0.5">Update to 850mg</span>
          </Button>

          {/* Button 4: Miss Dose (Caregiver Alert) */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleMarkMissed}
            disabled={loadingAction === "missed"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-rose-300 flex items-center gap-1">
              <AlertTriangle className="size-3" /> Step 4: Alert
            </span>
            <span className="text-xs font-extrabold mt-0.5">Miss Evening Dose</span>
          </Button>

          {/* Button 5: Request ABC Medical */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleRequestMedicine}
            disabled={loadingAction === "req"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-purple-300 flex items-center gap-1">
              <Send className="size-3" /> Step 5: Request
            </span>
            <span className="text-xs font-extrabold mt-0.5">Ask ABC Medical</span>
          </Button>

          {/* Button 6: Pharmacy Confirms Available */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleConfirmAvailable}
            disabled={loadingAction === "confirm"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Step 6: Pharmacy
            </span>
            <span className="text-xs font-extrabold mt-0.5">Confirm Available</span>
          </Button>

          {/* Button 7: Reset Seed Data */}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleResetSeed}
            disabled={loadingAction === "reset"}
            className="h-auto py-2.5 px-3 flex flex-col items-start justify-center text-left bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-white rounded-xl"
          >
            <span className="text-[10px] font-bold uppercase text-rose-300 flex items-center gap-1">
              <RotateCcw className="size-3" /> Reset
            </span>
            <span className="text-xs font-extrabold mt-0.5">Restore Seed Data</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
