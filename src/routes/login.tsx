import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Stethoscope,
  User,
  HeartHandshake,
  Store,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useCare, type Role } from "@/lib/care-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export const DEMO_CREDENTIALS = [
  {
    role: "doctor" as Role,
    roleTitle: "Doctor",
    id: "doctor@swasthya.com",
    password: "doctor123",
    name: "Dr. Amit Sharma",
    subtitle: "General Medicine · MMC123456",
    desc: "Verify prescriptions, review AI extractions, manage patient authorization & clinical plans.",
    dest: "/doctor/dashboard",
    icon: Stethoscope,
    badge: "Clinical Authority",
    color: "from-blue-600 to-indigo-600",
  },
  {
    role: "patient" as Role,
    roleTitle: "Patient",
    id: "patient@swasthya.com",
    password: "patient123",
    name: "Mrs. Sunita Sharma",
    subtitle: "Code: SWS-P-8F42K91 · Pune",
    desc: "Accessible schedule, English & Hindi spoken reminders, deterministic adherence & nearby medicine discovery.",
    dest: "/patient/dashboard",
    icon: User,
    badge: "Elderly Accessible",
    color: "from-emerald-600 to-teal-600",
  },
  {
    role: "caregiver" as Role,
    roleTitle: "Caretaker / Caregiver",
    id: "caretaker@swasthya.com",
    password: "caretaker123",
    name: "Rahul Sharma",
    subtitle: "Son · Bengaluru (Remote Oversight)",
    desc: "Meaningful non-noisy alerts, persistent missed-dose patterns & supply tracking with clinical safety guardrails.",
    dest: "/caregiver/dashboard",
    icon: HeartHandshake,
    badge: "Family Support",
    color: "from-amber-600 to-orange-600",
  },
  {
    role: "pharmacy" as Role,
    roleTitle: "Medical / Pharmacy",
    id: "medical@swasthya.com",
    password: "medical123",
    name: "ABC Medical",
    subtitle: "Kothrud, Pune · Connected Digital Chemist",
    desc: "Live incoming medicine availability requests, real-time shelf stock confirmation & patient notification.",
    dest: "/pharmacy/dashboard",
    icon: Store,
    badge: "Operations",
    color: "from-purple-600 to-pink-600",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useCare();

  const [email, setEmail] = useState("patient@swasthya.com");
  const [password, setPassword] = useState("patient123");
  const [selectedRole, setSelectedRole] = useState<Role>("patient");
  const [error, setError] = useState("");

  const handleQuickLogin = (acc: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(acc.id);
    setPassword(acc.password);
    setSelectedRole(acc.role);
    setCurrentRole(acc.role);
    toast.success(`Logged in as ${acc.name}`, {
      description: `Welcome to Swasthya ${acc.roleTitle} portal.`,
    });
    navigate({ to: acc.dest as any });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Find account by email
    const match = DEMO_CREDENTIALS.find(
      (a) => a.id.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!match) {
      // Check admin
      if (email.trim().toLowerCase() === "admin@swasthya.com" && password === "admin123") {
        setCurrentRole("admin");
        toast.success("Logged in as Admin");
        navigate({ to: "/admin/dashboard" as any });
        return;
      }
      setError("Account not found. Please click any of the 4 demo account cards below.");
      return;
    }

    if (password !== match.password) {
      setError(`Invalid password. Demo password is "${match.password}".`);
      return;
    }

    setCurrentRole(match.role);
    toast.success(`Welcome, ${match.name}!`);
    navigate({ to: match.dest as any });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <Logo />
        <Link
          to="/"
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
        >
          ← Back to Landing
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider mb-2">
            <Sparkles className="size-3.5" /> 4 Official Demo Accounts
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Sign In to Swasthya Care Network
          </h1>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Use the ID & Password below or click <strong>"1-Click Sign In"</strong> on any account to test the complete demo journey.
          </p>
        </div>

        {/* Traditional Credentials Login Box */}
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm mb-10">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account ID / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. doctor@swasthya.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-medium text-navy focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-medium text-navy focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full rounded-xl py-2.5 font-bold" size="lg">
              Sign In with Credentials
            </Button>
          </form>
        </div>

        {/* 4 Demo Account Cards with Credentials & 1-Click Login */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy">
              Available Demo Credentials (Click to Auto-Sign In)
            </h2>
            <span className="text-xs text-slate-500 font-mono">4 Connected Roles</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_CREDENTIALS.map((acc) => {
              const Icon = acc.icon;
              return (
                <div
                  key={acc.role}
                  className="bg-white border border-slate-200 hover:border-primary/50 hover:shadow-md rounded-2xl p-5 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {acc.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-navy text-sm">{acc.roleTitle}</h3>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{acc.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mb-3">{acc.subtitle}</p>

                    {/* ID & Password display box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 mb-4 font-mono">
                      <div>
                        <span className="text-slate-400">ID:</span>{" "}
                        <strong className="text-slate-800">{acc.id}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Pass:</span>{" "}
                        <strong className="text-primary">{acc.password}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {acc.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      className="w-full text-xs font-bold"
                      variant="hero"
                      onClick={() => handleQuickLogin(acc)}
                    >
                      1-Click Sign In <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Prototype Link */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span>
              <strong>Admin Doctor Verification Prototype:</strong> Log in as Swasthya Admin (ID: <code>admin@swasthya.com</code> · Pass: <code>admin123</code>)
            </span>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/dashboard" onClick={() => setCurrentRole("admin")}>
              Open Admin Portal
            </Link>
          </Button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 max-w-6xl mx-auto w-full pt-4 border-t border-slate-200">
        Team COMMIT&RUN · Swasthya Medication Care Platform
      </footer>
    </div>
  );
}
