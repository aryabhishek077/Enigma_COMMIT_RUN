import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Store,
  Stethoscope,
  User,
  UserCheck,
  UserCog,
  X,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCare, type Role } from "@/lib/care-store";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: typeof LayoutDashboard };

const roleNav: { role: Role; label: string; to: string; icon: typeof LayoutDashboard }[] = [
  { role: "patient", label: "Patient View", to: "/patient/dashboard", icon: User },
  { role: "doctor", label: "Doctor Portal", to: "/doctor/dashboard", icon: Stethoscope },
  { role: "caregiver", label: "Caregiver Portal", to: "/caregiver/dashboard", icon: HeartHandshake },
  { role: "pharmacy", label: "Pharmacy Ops", to: "/pharmacy/dashboard", icon: Store },
  { role: "admin", label: "Admin Verify", to: "/admin/dashboard", icon: UserCog },
];

const patientWorkflowNav: NavItem[] = [
  { label: "My Schedule", to: "/patient/dashboard", icon: Activity },
  { label: "Medications", to: "/patient/medications", icon: Pill },
  { label: "Prescriptions", to: "/patient/prescriptions", icon: ClipboardList },
  { label: "Adherence Record", to: "/patient/adherence", icon: Activity },
  { label: "Find Medicine", to: "/patient/find-medicine", icon: Search },
  { label: "Caregiver Link", to: "/patient/caregiver", icon: HeartHandshake },
];

const doctorWorkflowNav: NavItem[] = [
  { label: "Overview", to: "/doctor/dashboard", icon: LayoutDashboard },
  { label: "Patients", to: "/doctor/patients", icon: UserCheck },
  { label: "Upload & Verify Rx", to: "/doctor/prescriptions", icon: ClipboardList },
  { label: "Adherence Analytics", to: "/doctor/adherence", icon: Activity },
];

const caregiverWorkflowNav: NavItem[] = [
  { label: "Status & Care", to: "/caregiver/dashboard", icon: HeartHandshake },
  { label: "Medications", to: "/caregiver/medications", icon: Pill },
  { label: "Alerts Center", to: "/caregiver/alerts", icon: Bell },
];

const pharmacyWorkflowNav: NavItem[] = [
  { label: "Requests Queue", to: "/pharmacy/dashboard", icon: Store },
  { label: "Inventory", to: "/pharmacy/inventory", icon: Pill },
  { label: "Past Requests", to: "/pharmacy/requests", icon: ClipboardList },
];

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <li key={item.label}>
            <Link
              to={item.to as any}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const navigate = useNavigate();
  const { currentRole, currentUser, logout } = useCare();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" as any });
  };

  return (
    <div className="flex h-full flex-col gap-6 p-5 overflow-y-auto">
      <Logo />

      {/* Verified User Badge */}
      <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Verified Account
          </span>
        </div>
        <p className="font-extrabold text-navy text-sm mt-1 truncate">
          {currentUser?.name ?? "Authenticated Session"}
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
          {currentUser?.codeOrReg ?? currentUser?.email}
        </p>
      </div>

      {/* Contextual Navigation based on Active Role */}
      <nav aria-label="Workflows">
        <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {currentRole.toUpperCase()} NAVIGATION
        </p>
        {currentRole === "patient" && <NavList items={patientWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "doctor" && <NavList items={doctorWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "caregiver" && <NavList items={caregiverWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "pharmacy" && <NavList items={pharmacyWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "admin" && (
          <NavList
            items={[{ label: "Doctor Verification", to: "/admin/dashboard", icon: UserCheck }]}
            onNavigate={onNavigate}
          />
        )}
      </nav>

      <div className="mt-auto space-y-2 border-t border-sidebar-border pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="size-4" /> Sign Out / Switch Account
        </button>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          ← Return to Landing Page
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  subtitle,
  badge,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const {
    currentRole,
    currentUser,
    isAuthenticated,
    logout,
    lastPatientNotification,
    clearNotification,
  } = useCare();

  // Role validation: check if the page route matches the current authorized role
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isPatientRoute = pathname.startsWith("/patient");
  const isCaregiverRoute = pathname.startsWith("/caregiver");
  const isPharmacyRoute = pathname.startsWith("/pharmacy");
  const isAdminRoute = pathname.startsWith("/admin");

  const expectedRole = isDoctorRoute
    ? "doctor"
    : isPatientRoute
    ? "patient"
    : isCaregiverRoute
    ? "caregiver"
    : isPharmacyRoute
    ? "pharmacy"
    : isAdminRoute
    ? "admin"
    : currentRole;

  const isRoleMismatch = currentRole !== expectedRole;

  const handleSignOut = () => {
    logout();
    navigate({ to: "/login" as any });
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Verification Status Header Bar */}
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="size-3" /> VERIFIED SESSION
            </span>
            <span className="text-slate-300 text-xs">
              Logged in as: <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.codeOrReg})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSignOut}
              className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 h-7 px-2.5 font-semibold"
            >
              <LogOut className="size-3.5 mr-1" /> Sign Out
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 h-7 text-xs font-bold"
            >
              <Link to="/login">Switch Account</Link>
            </Button>
          </div>
        </div>

        {/* Real-time Notification Banner */}
        {lastPatientNotification && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-4 py-2.5 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>System Notification:</strong> {lastPatientNotification}
              </span>
            </div>
            <button
              onClick={clearNotification}
              className="text-emerald-700 hover:text-emerald-950 p-1"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3.5 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[18rem] bg-sidebar p-0">
                <SidebarBody />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-extrabold text-navy sm:text-2xl">{title}</h1>
                {badge ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                    <ShieldCheck className="size-3.5" /> {badge}
                  </span>
                ) : null}
              </div>
              {subtitle ? <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
                <Bell />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </Button>
            </div>
          </div>
        </header>

        {/* ROLE RESTRICTION / VERIFICATION GUARD */}
        {isRoleMismatch && (
          <div className="m-4 sm:m-8 p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Role Authorization Required
                </span>
                <h3 className="font-extrabold text-navy text-lg mt-1">
                  You are viewing this portal as {currentUser?.name} ({currentRole})
                </h3>
                <p className="text-xs text-amber-900 mt-1 max-w-xl leading-relaxed">
                  This portal belongs to the <strong>{expectedRole.toUpperCase()}</strong> role. To access with full permissions, please sign in using that role's verified credentials.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="hero">
                    <Link to="/login">Sign In with {expectedRole.toUpperCase()} ID</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  caption,
  tone = "primary",
  icon: Icon,
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "navy";
  icon?: typeof LayoutDashboard;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-destructive-soft text-destructive",
    navy: "bg-secondary text-navy",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn("inline-flex size-9 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="size-4.5" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-navy">{value}</p>
      {caption ? <p className="mt-1 text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
