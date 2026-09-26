import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Journey", to: "/#journey" },
  { label: "Patient care", to: "/#patient" },
  { label: "Caregivers", to: "/#caregiver" },
  { label: "Pharmacies", to: "/#pharmacy" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/app/patient">Open demo</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/app/doctor">Explore Swasthya</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.to}
                    className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-accent"
                  >
                    {l.label}
                  </a>
                ))}
                <Link to="/app/patient" className="rounded-lg px-3 py-3 text-base font-semibold text-primary hover:bg-accent">
                  Open the demo
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
