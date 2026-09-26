import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Store,
  Stethoscope,
  User,
  UserCog,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: LinkProps["to"]; icon: typeof LayoutDashboard };

const roleNav: NavItem[] = [
  { label: "Patient", to: "/app/patient", icon: User },
  { label: "Doctor", to: "/app/doctor", icon: Stethoscope },
  { label: "Caregiver", to: "/app/caregiver", icon: HeartHandshake },
  { label: "Pharmacy", to: "/app/pharmacy", icon: Store },
  { label: "Admin", to: "/app/admin", icon: UserCog },
];

const workNav: NavItem[] = [
  { label: "Prescriptions", to: "/app/prescriptions", icon: ClipboardList },
  { label: "Adherence", to: "/app/adherence", icon: Activity },
  { label: "Find medicine", to: "/app/find-medicine", icon: Search },
];

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <li key={item.label}>
            <Link
              to={item.to}
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
  return (
    <div className="flex h-full flex-col gap-7 p-5">
      <Logo />

      <nav aria-label="Roles">
        <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Roles</p>
        <NavList items={roleNav} onNavigate={onNavigate} />
      </nav>

      <nav aria-label="Workflows">
        <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workflows</p>
        <NavList items={workNav} onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto space-y-1 border-t border-sidebar-border pt-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary">
            SS
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-navy">Sunita Sharma</span>
            <span className="block text-xs text-muted-foreground">Demo profile</span>
          </span>
        </div>
        <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Settings className="size-4.5" /> Settings
        </button>
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4.5" /> Exit demo
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
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-col">
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
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
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
