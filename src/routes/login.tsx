import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope, User, HeartHandshake, Store, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useCare, type Role } from "@/lib/care-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useCare();

  const handleSelectRole = (role: Role, destination: string) => {
    setCurrentRole(role);
    navigate({ to: destination as any });
  };

  const demoAccounts = [
    {
      role: "doctor" as Role,
      title: "Doctor",
      name: "Dr. Amit Sharma",
      detail: "General Medicine · MMC123456",
      desc: "Upload prescriptions, AI extraction review, patient oversight & verified plans.",
      dest: "/doctor/dashboard",
      icon: Stethoscope,
      badge: "Clinical Authority",
    },
    {
      role: "patient" as Role,
      title: "Patient",
      name: "Mrs. Sunita Sharma",
      detail: "ID: SWS-P-8F42K91 · Pune",
      desc: "Simple large-format reminders, voice alerts, adherence acknowledgements & pharmacy search.",
      dest: "/patient/dashboard",
      icon: User,
      badge: "Elderly Accessible",
    },
    {
      role: "caregiver" as Role,
      title: "Caregiver",
      name: "Rahul Sharma",
      detail: "Son · Bengaluru",
      desc: "Meaningful non-noisy alerts, missed dose patterns, supply levels & patient support.",
      dest: "/caregiver/dashboard",
      icon: HeartHandshake,
      badge: "Family Oversight",
    },
    {
      role: "pharmacy" as Role,
      title: "Pharmacy",
      name: "ABC Medical",
      detail: "Kothrud, Pune · Connected",
      desc: "Receive real-time availability requests, confirm stock, prevent wasted travel.",
      dest: "/pharmacy/dashboard",
      icon: Store,
      badge: "Operations",
    },
    {
      role: "admin" as Role,
      title: "Admin",
      name: "Swasthya Admin",
      detail: "Verification Portal",
      desc: "Simulate medical council registration verification for incoming doctors.",
      dest: "/admin/dashboard",
      icon: ShieldCheck,
      badge: "Prototype Flow",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <Logo />
        <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
          ← Back to Landing
        </Link>
      </header>

      <main className="max-w-5xl mx-auto w-full my-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider mb-3">
            Hackathon Judge Quick-Access
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Choose a Demo Role to Experience Swasthya
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            No registration or credentials required. Select any role below to enter the full interactive healthcare journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.role}
                onClick={() => handleSelectRole(account.role, account.dest)}
                className="group relative bg-white border border-slate-200 hover:border-primary/50 hover:shadow-lg rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {account.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-navy group-hover:text-primary transition">
                    {account.title}
                  </h2>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{account.name}</p>
                  <p className="text-xs text-slate-500 mb-3">{account.detail}</p>

                  <p className="text-xs text-slate-600 leading-relaxed">{account.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-0.5 transition">
                  <span>Continue as {account.title}</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 text-center max-w-2xl mx-auto shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Recommended Demo Path for Judges
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-700">
            <span className="font-bold text-primary">1. Admin Verify</span> →
            <span className="font-bold text-primary">2. Doctor Upload & Extract</span> →
            <span className="font-bold text-primary">3. Patient Voice Reminder</span> →
            <span className="font-bold text-primary">4. Missed Dose Alert</span> →
            <span className="font-bold text-primary">5. Pharmacy Confirmation</span>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 max-w-6xl mx-auto w-full pt-6 border-t border-slate-200">
        Swasthya Healthcare Prototype · Demo Environment with Local State Persistence
      </footer>
    </div>
  );
}
