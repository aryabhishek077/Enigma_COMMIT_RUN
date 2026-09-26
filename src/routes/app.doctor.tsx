import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/doctor")({
  beforeLoad: () => {
    throw redirect({ to: "/doctor/dashboard" });
  },
});

// Swasthya MedCare - Commit&Run Hackathon
