import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => <Outlet />,
});

// Swasthya MedCare - Commit&Run Hackathon
