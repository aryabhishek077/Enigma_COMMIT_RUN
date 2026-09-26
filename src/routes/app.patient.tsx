import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/patient")({
  beforeLoad: () => {
    throw redirect({ to: "/patient/dashboard" });
  },
});
