import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/dashboard" });
  },
});

// Swasthya MedCare - Commit&Run Hackathon
