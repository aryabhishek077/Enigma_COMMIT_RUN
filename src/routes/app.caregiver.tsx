import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/caregiver")({
  beforeLoad: () => {
    throw redirect({ to: "/caregiver/dashboard" });
  },
});

// Swasthya MedCare - Commit&Run Hackathon
