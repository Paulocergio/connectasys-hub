import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wrench, Users, Package, Receipt } from "@/components/icons";
import { useConnecta } from "@/lib/connecta-store";
import { getInitials } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  ssr: false,
  component: Dashboard,
});

type ClienteApi = { id: number };
type EstoqueApi = { id: number; quantidade: number; estoqueMinimo: number };
type ContaReceberApi = { valor: number; dataRecebimento: string | null };
type OrdemServicoApi = {
  status: "Aberto" | "Em Andamento" | "Aguardando Peça" | "Concluído" | "Cancelado";
  previsaoTermino: string | null;
};

const corMap: Record<string, string> = {
  primary: "bg-primary",
  chart3: "bg-chart-3",
  chart4: "bg-chart-4",
  chart5: "bg-chart-5",
};

const agenda: { hora: string; servico: string; mecanico: string }[] = [];

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Mesmo critério da tela de Estoque: quantidade no ou abaixo do mínimo cadastrado.
function estoqueBaixo(e: EstoqueApi) {
  return e.quantidade <= e.estoqueMinimo;
}

function Dashboard() {
  const { sessao } = useConnecta();

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const { data: estoque = [] } = useQuery({
    queryKey: ["estoque"],
    queryFn: () => apiFetch<EstoqueApi[]>("/api/Estoque"),
  });

  const { data: contasReceber = [] } = useQuery({
    queryKey: ["contas-a-receber"],
    queryFn: () => apiFetch<ContaReceberApi[]>("/api/ContasReceber"),
  });

  const { data: ordens = [] } = useQuery({
    queryKey: ["ordens-servico"],
    queryFn: () => apiFetch<OrdemServicoApi[]>("/api/OrdensServico"),
  });

  // "Hoje" no calendário local do usuário — não usar toISOString() aqui, que
  // converte pra UTC e adianta a data em fusos negativos (ex: Brasil, UTC-3),
  // fazendo uma OS com prazo pra hoje aparecer como atrasada mais cedo.
  const agora = new Date();
  const doisDigitos = (n: number) => String(n).padStart(2, "0");
  const mesAtual = `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}`;
  const hoje = `${mesAtual}-${doisDigitos(agora.getDate())}`;

  const faturamentoMes = useMemo(
    () =>
      contasReceber
        .filter((c) => c.dataRecebimento?.slice(0, 7) === mesAtual)
        .reduce((soma, c) => soma + c.valor, 0),
    [contasReceber, mesAtual],
  );

  const estoqueBaixoCount = useMemo(() => estoque.filter(estoqueBaixo).length, [estoque]);

  const { osAbertas, osAtrasadas } = useMemo(() => {
    let abertas = 0;
    let atrasadas = 0;
    for (const o of ordens) {
      if (o.status === "Concluído" || o.status === "Cancelado") continue;
      abertas++;
      if (o.previsaoTermino && o.previsaoTermino.slice(0, 10) < hoje) atrasadas++;
    }
    return { osAbertas: abertas, osAtrasadas: atrasadas };
  }, [ordens, hoje]);

  const cards = [
    { icon: Users, label: "Clientes ativos", valor: String(clientes.length), cor: "chart4" },
    {
      icon: Package,
      label: "Peças em estoque baixo",
      valor: String(estoqueBaixoCount),
      cor: "chart5",
    },
    {
      icon: Receipt,
      label: "Faturamento do mês",
      valor: formatarMoeda(faturamentoMes),
      cor: "chart3",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Olá, {sessao?.nome?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Resumo operacional de hoje.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <div className="mt-4 flex items-end gap-5">
            <div>
              <p className="text-3xl font-bold">{osAbertas}</p>
              <p className="text-xs font-medium text-muted-foreground">Abertas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-destructive">{osAtrasadas}</p>
              <p className="text-xs font-medium text-muted-foreground">Atrasadas</p>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-muted-foreground">OS em aberto</p>
        </div>

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
