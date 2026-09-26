import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { useCare, type Role } from "@/lib/care-store";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useCare();
  const [selectedRole, setSelectedRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    toast.success("Demo Account Activated", {
      description: `Welcome to Swasthya as ${selectedRole}.`,
    });
    if (selectedRole === "doctor") navigate({ to: "/doctor/dashboard" as any });
    else if (selectedRole === "patient") navigate({ to: "/patient/dashboard" as any });
    else if (selectedRole === "caregiver") navigate({ to: "/caregiver/dashboard" as any });
    else if (selectedRole === "pharmacy") navigate({ to: "/pharmacy/dashboard" as any });
    else navigate({ to: "/admin/dashboard" as any });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <Logo />
          <h1 className="mt-4 text-xl font-bold text-navy">Join Swasthya Care Network</h1>
          <p className="mt-1 text-xs text-slate-500">
            Create an account or use instant demo mode
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["patient", "doctor", "caregiver", "pharmacy"] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition ${
                    selectedRole === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Amit Sharma or Sunita Sharma"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email / ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" size="lg">
            Create & Enter Demo
          </Button>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have a demo account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Choose Pre-loaded Demo Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
