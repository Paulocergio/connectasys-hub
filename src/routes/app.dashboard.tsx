import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Users, Package, Receipt } from "lucide-react";
import { useConnecta } from "@/lib/connecta-store";

export const Route = createFileRoute("/app/dashboard")({
  ssr: false,
  component: Dashboard,
});

const cards = [
  { icon: Wrench, label: "OS em aberto", valor: "18" },
  { icon: Users, label: "Clientes ativos", valor: "212" },
  { icon: Package, label: "Peças em estoque baixo", valor: "7" },
  { icon: Receipt, label: "Faturamento do mês", valor: "R$ 84.320" },
];

const agenda = [
  ["08:00", "Gol 1.0 — Troca de embreagem", "Marcos V."],
  ["10:30", "Civic — Revisão 40.000 km", "Juliana P."],
  ["13:00", "Hilux — Suspensão dianteira", "Marcos V."],
  ["16:00", "Onix — Diagnóstico eletrônico", "Rafael M."],
];

function Dashboard() {
  const { sessao } = useConnecta();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Olá, {sessao?.nome?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Resumo operacional de hoje.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, valor }) => (
          <div key={label} className="rounded-2xl border border-border/60 bg-card p-5">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-2xl font-semibold">{valor}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="font-semibold">Agenda de box — hoje</h2>
        <ul className="mt-4 divide-y divide-border/60">
          {agenda.map(([h, s, m]) => (
            <li key={h} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="w-14 font-medium text-primary">{h}</span>
              <span className="flex-1 truncate">{s}</span>
              <span className="text-muted-foreground">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
