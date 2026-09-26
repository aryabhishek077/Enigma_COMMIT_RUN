import { createFileRoute } from "@tanstack/react-router";
import { Bell, Volume2, ShieldCheck, Clock, CheckCircle2, Languages } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { JudgePresentationBar } from "@/components/dashboard/JudgePresentationBar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCare } from "@/lib/care-store";

export const Route = createFileRoute("/patient/reminders")({
  head: () => ({
    meta: [{ title: "Medication Reminders (English & Hindi) — Swasthya" }],
  }),
  component: PatientRemindersPage,
});

function PatientRemindersPage() {
  const { doses } = useCare();
  const metDose = doses.find((d) => d.medicine.toLowerCase().includes("metformin"));
  const metStrength = metDose?.strength || "500 mg";
  const metStrengthHindi = metStrength.replace(/mg/i, "मिलीग्राम");
  const metHindiSpeech = `सुनीता जी, यह आपकी मेटफॉर्मिन ${metStrengthHindi} गोली लेने का समय है। कृपया रात के खाने के बाद एक गोली पानी के साथ लें।`;

  const speakReminder = (text: string, lang = "en-IN") => {
    if (typeof window === "undefined") return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = lang === "hi-IN" ? 0.85 : 0.88;
      synth.speak(u);
      toast.success(lang === "hi-IN" ? "हिंदी वॉइस अलर्ट सक्रिय" : "Voice Reminder Playing", {
        description: text,
      });
    } catch {
      // fallback
    }
  };

  return (
    <DashboardShell
      title="Medication Reminders & Voice Alerts"
      subtitle="Accessible audio prompts in English & Hindi synthesized via Web Speech API"
      badge="Bilingual Voice Enabled"
    >
      <div className="space-y-6 max-w-5xl">
        <JudgePresentationBar />

        <Panel
          title="Hindi Prescription Spoken Alerts (हिंदी वॉइस अलर्ट)"
          description="High-clarity native Hindi voice prompts synthesized specifically for elderly regional patients"
        >
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                  रात की दवा (Evening Dose)
                </span>
                <h4 className="font-bold text-navy text-base mt-2">मेटफॉर्मिन {metStrengthHindi} वॉइस अलर्ट</h4>
                <p className="text-xs text-emerald-950 mt-1 font-hindi">
                  "{metHindiSpeech}"
                </p>
              </div>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shrink-0"
                onClick={() => speakReminder(metHindiSpeech, "hi-IN")}
              >
                <Languages className="size-4 mr-2" /> हिंदी में सुनें (Play Hindi)
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase">
                  सुबह की दवा (Morning Dose)
                </span>
                <h4 className="font-bold text-navy text-base mt-2">एम्लोडिपिन 5 मिलीग्राम वॉइस अलर्ट</h4>
                <p className="text-xs text-muted-foreground mt-1 font-hindi">
                  "सुप्रभात सुनीता जी। कृपया नाश्ते के बाद अपनी एम्लोडिपिन 5 मिलीग्राम गोली पानी के साथ लें।"
                </p>
              </div>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 shrink-0 font-bold"
                onClick={() =>
                  speakReminder(
                    "सुप्रभात सुनीता जी। कृपया नाश्ते के बाद अपनी एम्लोडिपिन 5 मिलीग्राम गोली पानी के साथ लें।",
                    "hi-IN",
                  )
                }
              >
                <Languages className="size-4 mr-2" /> हिंदी में सुनें (Play Hindi)
              </Button>
            </div>
          </div>
        </Panel>

        <Panel
          title="English Voice Reminders"
          description="Standard synthesized English audio alerts"
        >
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-navy text-base">Evening Metformin Reminder Prompt</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "It is time to take your Metformin 500 milligram tablet. Please take one tablet after dinner."
                </p>
              </div>
              <Button
                variant="hero"
                className="shrink-0"
                onClick={() =>
                  speakReminder(
                    "It is time to take your Metformin 500 milligram tablet. Please take one tablet after dinner.",
                    "en-IN",
                  )
                }
              >
                <Volume2 className="size-4 mr-2" /> Play English Alert
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
