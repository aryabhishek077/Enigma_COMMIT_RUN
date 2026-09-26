import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/prescriptions")({
  beforeLoad: () => {
    throw redirect({ to: "/doctor/prescriptions" });
  },
});

// Swasthya MedCare - Commit&Run Hackathon
