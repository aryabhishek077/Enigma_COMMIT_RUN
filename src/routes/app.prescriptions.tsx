import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/prescriptions")({
  beforeLoad: () => {
    throw redirect({ to: "/doctor/prescriptions" });
  },
});
