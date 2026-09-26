import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/adherence")({
  beforeLoad: () => {
    throw redirect({ to: "/patient/adherence" });
  },
});
