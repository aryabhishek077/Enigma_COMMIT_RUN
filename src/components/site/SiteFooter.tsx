import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo tagline />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A connected medication-care experience for doctors, patients, caregivers and pharmacies. This build is a
            demonstration interface with sample data.
          </p>
        </div>

        <FooterCol
          title="Roles"
          items={[
            { label: "Patient", to: "/app/patient" },
            { label: "Doctor", to: "/app/doctor" },
            { label: "Caregiver", to: "/app/caregiver" },
            { label: "Pharmacy", to: "/app/pharmacy" },
          ]}
        />
        <FooterCol
          title="Product"
          items={[
            { label: "Prescriptions", to: "/app/prescriptions" },
            { label: "Adherence", to: "/app/adherence" },
            { label: "Find medicine", to: "/app/find-medicine" },
            { label: "Verification", to: "/app/admin" },
          ]}
        />
        <div>
          <h3 className="text-sm font-bold text-navy">Care & safety</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Swasthya supports a medication routine. It does not diagnose, prescribe or replace clinical advice. Every
            medication plan requires verification by a registered doctor.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground lg:px-8">
        © {new Date().getFullYear()} Swasthya · Demonstration interface · Sample data
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
