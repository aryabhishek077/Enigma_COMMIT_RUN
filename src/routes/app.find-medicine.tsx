import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/find-medicine")({
  beforeLoad: () => {
    throw redirect({ to: "/patient/find-medicine" });
  },
});
