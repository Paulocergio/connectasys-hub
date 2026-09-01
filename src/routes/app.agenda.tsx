import { createFileRoute } from "@tanstack/react-router";
import { EmModulo } from "@/components/EmModulo";

export const Route = createFileRoute("/app/agenda")({
  ssr: false,
  component: () => (
    <EmModulo titulo="Agenda" descricao="Distribuição de serviços entre boxes e mecânicos." />
  ),
});
