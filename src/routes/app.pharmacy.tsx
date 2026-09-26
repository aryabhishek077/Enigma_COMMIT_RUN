import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pharmacy")({
  beforeLoad: () => {
    throw redirect({ to: "/pharmacy/dashboard" });
  },
});

// Swasthya MedCare - Commit&Run Hackathon
