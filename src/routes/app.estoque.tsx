import { createFileRoute } from "@tanstack/react-router";
import { EmModulo } from "@/components/EmModulo";

export const Route = createFileRoute("/app/estoque")({
  ssr: false,
  component: () => (
    <EmModulo titulo="Estoque" descricao="Controle de peças, entradas e estoque mínimo." />
  ),
});
