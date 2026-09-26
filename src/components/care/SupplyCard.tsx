import { Link } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SupplyItem } from "@/lib/demo-data";

export function SupplyCard({ item }: { item: SupplyItem }) {
  const pct = Math.max(4, Math.round((item.tabletsLeft / item.tabletsTotal) * 100));
  const low = item.daysRemaining <= 5;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-4">
        {/* Capsule supply visual */}
        <div className="relative h-20 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
          <div
            className={cn("absolute inset-x-0 bottom-0 rounded-b-full", low ? "bg-warning" : "bg-gradient-brand")}
            style={{ height: `${pct}%`, transition: "height 800ms cubic-bezier(0.22,1,0.36,1)" }}
          />
          <span className="absolute inset-y-0 left-1.5 w-1.5 rounded-full bg-card/50" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-navy">{item.medicine}</h3>
            <span className="text-sm font-semibold text-muted-foreground">{item.strength}</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-navy">
            {item.tabletsLeft} tablets · {item.daysRemaining} days remaining
          </p>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary" role="presentation">
            <div
              className={cn("h-full rounded-full", low ? "bg-warning" : "bg-gradient-brand")}
              style={{ width: `${pct}%`, transition: "width 800ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold",
                low ? "bg-warning-soft text-warning-foreground" : "bg-success-soft text-success",
              )}
            >
              {low ? "Running low" : "Supply healthy"}
            </span>
            {low ? (
              <Button asChild size="sm" variant="warning">
                <Link to="/app/find-medicine">
                  <PackageSearch className="size-4" /> FIND MEDICINE
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Swasthya MedCare - Commit&Run Hackathon
