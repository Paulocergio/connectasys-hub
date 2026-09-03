import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Users, Package, Receipt } from "lucide-react";
import { useConnecta } from "@/lib/connecta-store";
import { getInitials } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/dashboard")({
  ssr: false,
  component: Dashboard,
});

const corMap: Record<string, string> = {
  primary: "bg-primary",
  chart3: "bg-chart-3",
  chart4: "bg-chart-4",
  chart5: "bg-chart-5",
};

const cards = [
  { icon: Wrench, label: "OS em aberto", valor: "0", cor: "primary" },
  { icon: Users, label: "Clientes ativos", valor: "0", cor: "chart4" },
  { icon: Package, label: "Peças em estoque baixo", valor: "0", cor: "chart5" },
  { icon: Receipt, label: "Faturamento do mês", valor: "R$ 0,00", cor: "chart3" },
] as const;

const agenda: { hora: string; servico: string; mecanico: string }[] = [];

function Dashboard() {
  const { sessao } = useConnecta();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Olá, {sessao?.nome?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Resumo operacional de hoje.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, valor, cor }) => (
          <div key={label} className="rounded-2xl bg-card p-5 shadow-sm">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${corMap[cor]}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-bold">{valor}</p>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Agenda de box — hoje</h2>
        {agenda.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum agendamento para hoje.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {agenda.map(({ hora, servico, mecanico }) => (
              <li key={hora} className="flex items-center gap-4 py-3">
                <span className="w-20 shrink-0 rounded-full bg-primary/10 px-3 py-1 text-center text-xs font-semibold text-primary">
                  {hora}
                </span>
                <span className="flex-1 truncate text-sm">{servico}</span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">{getInitials(mecanico)}</AvatarFallback>
                  </Avatar>
                  {mecanico}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
