import { createFileRoute } from "@tanstack/react-router";
import { EmModulo } from "@/components/EmModulo";

export const Route = createFileRoute("/app/ordens")({
  ssr: false,
  component: () => (
    <EmModulo titulo="Ordens de serviço" descricao="Orçamentos, execução e entrega de veículos." />
  ),
});
