import { createFileRoute } from "@tanstack/react-router";
import { Bell, Volume2, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/reminders")({
  component: PatientRemindersPage,
});

function PatientRemindersPage() {
  const speakReminder = (text: string) => {
    if (typeof window === "undefined") return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      synth.speak(u);
      toast.success("Voice Reminder Playing", { description: text });
    } catch {
      // fallback
    }
  };

  return (
    <DashboardShell
      title="Medication Reminders & Voice Alerts"
      subtitle="Accessible audio prompts and multi-channel notifications"
      badge="Voice Enabled"
    >
      <div className="space-y-6 max-w-5xl">
        <Panel title="Voice Reminder Engine" description="High-clarity spoken audio synthesized via browser Web Speech API">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-navy text-base">Evening Metformin Reminder Prompt</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "It is time to take your Metformin 500 milligram tablet. Please take one tablet after dinner."
                </p>
              </div>
              <Button
                variant="hero"
                onClick={() =>
                  speakReminder(
                    "It is time to take your Metformin 500 milligram tablet. Please take one tablet after dinner."
                  )
                }
              >
                <Volume2 className="size-4 mr-2" /> Play Voice Alert
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-navy text-base">Morning Amlodipine Reminder Prompt</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "Good morning Sunita. Please take your Amlodipine 5 milligram tablet with water."
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  speakReminder(
                    "Good morning Sunita. Please take your Amlodipine 5 milligram tablet with water."
                  )
                }
              >
                <Volume2 className="size-4 mr-2" /> Play Voice Alert
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
