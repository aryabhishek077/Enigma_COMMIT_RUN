import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Edit2,
  RefreshCw,
  Eye,
  Check,
} from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useCare } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/prescriptions")({
  head: () => ({
    meta: [{ title: "Doctor Portal — Prescription Upload & AI Extraction | Swasthya" }],
  }),
  component: DoctorPrescriptionsPage,
});

function DoctorPrescriptionsPage() {
  const navigate = useNavigate();
  const { addPrescription, verifyPrescription, prescriptions, setCurrentRole } = useCare();

  const [hasFile, setHasFile] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form values for extraction
  const [form, setForm] = useState({
    medicine: "Metformin",
    strength: "500 mg",
    dose: "1 tablet",
    frequency: "Twice daily (1-0-1)",
    timing: "Morning + Night",
    duration: "30 days",
    instructions: "After meals",
    confidence: "High (98.4%)",
  });

  const handleUseDemo = () => {
    setHasFile(true);
    setAnalyzing(true);
    setExtracted(false);
    setVerified(false);

    setTimeout(() => {
      setAnalyzing(false);
      setExtracted(true);
      toast.success("AI Extraction Complete", {
        description: "Prescription parsed. Doctor verification is required before plan activation.",
      });
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUseDemo();
    }
  };

  const handleVerify = () => {
    setVerified(true);
    addPrescription({
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: new Date().toISOString().split("T")[0] ?? "2026-09-26",
      status: "VERIFIED",
      medicine: form.medicine,
      strength: form.strength,
      dose: form.dose,
      frequency: form.frequency,
      timing: form.timing,
      duration: form.duration,
      instructions: form.instructions,
      aiConfidence: form.confidence,
    });
    verifyPrescription();
    toast.success("Prescription Verified by Doctor", {
      description: "Active medication plan created and synced to patient and caregiver.",
    });
  };

  return (
    <DashboardShell
      title="Upload & Verify Prescription"
      subtitle="AI-assisted clinical extraction with mandatory doctor verification"
      badge="Clinical Authority"
    >
      <div className="space-y-6 max-w-5xl">
        {/* AI Safety Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">AI Safety & Clinical Decision Support Guardrails</p>
            <p className="mt-1 text-amber-800 leading-relaxed">
              AI within Swasthya strictly performs <strong>text extraction, language structuring, and format normalization</strong>. It NEVER diagnoses, prescribes, changes dosage, or makes autonomous medical decisions. The registered doctor remains the sole clinical authority.
            </p>
          </div>
        </div>

        {/* Upload Zone & Demo Button */}
        <Panel
          title="Prescription Ingestion"
          description="Upload a handwritten or printed prescription image, or use the pre-loaded demo prescription"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-3xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Upload className="size-7" />
              </div>
              <h3 className="font-bold text-navy text-sm">Drag & drop or browse prescription</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP, or PDF
              </p>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="pointer-events-none">
                  Select File
                </Button>
              </div>
            </div>

            {/* Demo Prescription Option */}
            <div className="border border-border rounded-3xl p-6 bg-card flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Recommended for Hackathon Demo
                  </span>
                  <Sparkles className="size-4 text-primary" />
                </div>
                <h3 className="font-bold text-navy text-base">Standard Demo Prescription</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Contains: <strong>Metformin 500 mg</strong> (1-0-1, 30 days, after meals) prescribed for patient Mrs. Sunita Sharma (SWS-P-8F42K91).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <Button variant="hero" className="w-full" onClick={handleUseDemo}>
                  <Sparkles className="size-4 mr-1.5" /> Use Demo Prescription
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        {/* AI Scanning Animation State */}
        {analyzing && (
          <div className="p-8 rounded-3xl bg-card border border-primary/30 text-center animate-pulse shadow-sm">
            <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3 animate-spin">
              <RefreshCw className="size-6" />
            </div>
            <h3 className="font-bold text-navy text-lg">Analyzing prescription...</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Extracting drug names, strengths, dosage frequencies, and duration using structured OCR.
            </p>
          </div>
        )}

        {/* AI Structured Extraction Result */}
        {extracted && (
          <Panel
            title="AI Extraction Result (Doctor Review Required)"
            description="Verify the parsed clinical fields against the original prescription before activating"
            action={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  AI Confidence: {form.confidence}
                </span>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 className="size-3.5 mr-1" /> {isEditing ? "Done Editing" : "Edit Fields"}
                </Button>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Prescription Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <span className="font-semibold text-slate-500">Patient: <strong className="text-navy">Mrs. Sunita Sharma (SWS-P-8F42K91)</strong></span>
                  <span className="font-semibold text-slate-500">Doctor: <strong className="text-navy">Dr. Amit Sharma (MMC123456)</strong></span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Medicine Name</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-lg text-sm font-bold"
                        value={form.medicine}
                        onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                      />
                    ) : (
                      <p className="font-bold text-navy text-base">{form.medicine}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Strength</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-lg text-sm font-bold"
                        value={form.strength}
                        onChange={(e) => setForm({ ...form, strength: e.target.value })}
                      />
                    ) : (
                      <p className="font-bold text-navy text-base">{form.strength}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Dose & Frequency</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-lg text-sm font-bold"
                        value={form.frequency}
                        onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                      />
                    ) : (
                      <p className="font-bold text-navy text-sm">{form.dose} · {form.frequency}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Duration & Timing</label>
                    {isEditing ? (
                      <input
                        className="w-full p-2 border rounded-lg text-sm font-bold"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      />
                    ) : (
                      <p className="font-bold text-navy text-sm">{form.duration} ({form.timing})</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600">Instructions: <strong>{form.instructions}</strong></span>
                  <span className="text-[11px] text-amber-700 font-medium">
                    ⚠️ AI extracted information — doctor verification required.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground">
                  By clicking verify, you confirm clinical accuracy and activate patient medication reminders.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!verified ? (
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto" size="lg" onClick={handleVerify}>
                      <CheckCircle2 className="size-5 mr-2" /> VERIFY PRESCRIPTION
                    </Button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-700" /> ✓ Prescription Verified & Plan Activated
                    </div>
                  )}
                </div>
              </div>

              {/* Next Step Banner */}
              {verified && (
                <div className="mt-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                  <div>
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Next Step in Hackathon Demo:</p>
                    <p className="text-sm text-emerald-800">
                      Switch to <strong>Patient View</strong> to see the active medication plan, test spoken voice reminders, and record adherence!
                    </p>
                  </div>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                    <Link
                      to="/patient/dashboard"
                      onClick={() => setCurrentRole("patient")}
                    >
                      Go to Patient View <ArrowRight className="size-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        )}

        {/* Existing Prescriptions List */}
        <Panel title="Active Verified Prescriptions" description="Currently active clinical orders in the Swasthya care graph">
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    Rx
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy text-sm">{rx.medicine} {rx.strength}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rx.dose} · {rx.frequency} · {rx.instructions}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>{rx.doctorName}</p>
                  <p className="text-[11px]">{rx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
