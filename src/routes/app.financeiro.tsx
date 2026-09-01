import { createFileRoute } from "@tanstack/react-router";
import { EmModulo } from "@/components/EmModulo";

export const Route = createFileRoute("/app/financeiro")({
  ssr: false,
  component: () => (
    <EmModulo titulo="Financeiro" descricao="Contas a pagar, a receber e fluxo de caixa." />
  ),
});
