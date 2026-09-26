import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
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

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { currentRole, setCurrentRole } = useCare();

  const roleProfiles: Record<Role, { name: string; tag: string; initials: string }> = {
    patient: { name: "Sunita Sharma", tag: "ID: SWS-P-8F42K91", initials: "SS" },
    doctor: { name: "Dr. Amit Sharma", tag: "General Medicine", initials: "AS" },
    caregiver: { name: "Rahul Sharma", tag: "Caregiver (Son)", initials: "RS" },
    pharmacy: { name: "ABC Medical", tag: "Connected Chemist", initials: "AM" },
    admin: { name: "Swasthya Admin", tag: "Prototype Verifier", initials: "AD" },
  };

  const activeProfile = roleProfiles[currentRole] || roleProfiles.patient;

  return (
    <div className="flex h-full flex-col gap-6 p-5 overflow-y-auto">
      <Logo />

      {/* Role Switcher */}
      <nav aria-label="Roles">
        <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Demo Roles
        </p>
        <div className="grid grid-cols-1 gap-1">
          {roleNav.map((r) => {
            const isCurrent = currentRole === r.role;
            return (
              <Link
                key={r.role}
                to={r.to}
                onClick={() => {
                  setCurrentRole(r.role);
                  onNavigate?.();
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
                  isCurrent
                    ? "bg-primary/10 text-primary font-bold border border-primary/30"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <r.icon className="size-4" />
                  {r.label}
                </span>
                {isCurrent && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Contextual Navigation based on Active Role */}
      <nav aria-label="Workflows">
        <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {currentRole.toUpperCase()} PORTAL
        </p>
        {currentRole === "patient" && <NavList items={patientWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "doctor" && <NavList items={doctorWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "caregiver" && <NavList items={caregiverWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "pharmacy" && <NavList items={pharmacyWorkflowNav} onNavigate={onNavigate} />}
        {currentRole === "admin" && (
          <NavList
            items={[
              { label: "Doctor Verification", to: "/admin/dashboard", icon: UserCheck },
            ]}
            onNavigate={onNavigate}
          />
        )}
      </nav>

      <div className="mt-auto space-y-2 border-t border-sidebar-border pt-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-card border border-border">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary">
            {activeProfile.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-navy">{activeProfile.name}</span>
            <span className="block text-xs text-muted-foreground truncate">{activeProfile.tag}</span>
          </span>
        </div>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" /> Home / Landing
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
  const { currentRole, setCurrentRole, lastPatientNotification, clearNotification } = useCare();

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top Announcement / Quick Switcher Bar */}
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Demo Mode
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Testing as <strong className="text-white capitalize">{currentRole}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Quick Switch:</span>
            {(["admin", "doctor", "patient", "caregiver", "pharmacy"] as Role[]).map((r) => (
              <Link
                key={r}
                to={
                  r === "admin"
                    ? "/admin/dashboard"
                    : r === "doctor"
                    ? "/doctor/dashboard"
                    : r === "patient"
                    ? "/patient/dashboard"
                    : r === "caregiver"
                    ? "/caregiver/dashboard"
                    : "/pharmacy/dashboard"
                }
                onClick={() => setCurrentRole(r)}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-medium transition capitalize",
                  currentRole === r
                    ? "bg-primary text-white font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
                )}
              >
                {r}
              </Link>
            ))}
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
