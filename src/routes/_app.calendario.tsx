import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessao } from "@/lib/connecta-store";
import { podeAcessar } from "@/lib/permissoes";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const searchSchema = z.object({
  tecnicoId: z.string().optional(),
  data: z.string().optional(),
});

export const Route = createFileRoute("/_app/calendario")({
  ssr: false,
  validateSearch: searchSchema,
  beforeLoad: () => {
    if (!podeAcessar(getSessao()?.papel, "calendario")) throw redirect({ to: "/dashboard" });
  },
  component: CalendarioPage,
});

type AgendamentoApi = {
  id: number;
  tecnicoId: string;
  clienteId: number | null;
  veiculoId: number | null;
  ordemServicoId: number | null;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  observacao: string | null;
  status: "Agendado" | "Concluído" | "Cancelado";
  dataCadastro: string;
};

type UsuarioApi = { id: string; nome: string; role: string };
type ClienteApi = { id: number; nome: string };
type VeiculoApi = { id: number; clienteId: number; placa: string; marca: string; modelo: string };

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatarHorario(iso: string) {
  return iso.slice(11, 16);
}

// Tela só de leitura — agendamentos nascem e são editados a partir do
// formulário de Ordens de Serviço (técnico + data/horário), nunca aqui.
// Ver specs/calendario/spec.md.
function CalendarioPage() {
  const search = Route.useSearch();

  const [diaFiltro, setDiaFiltro] = useState(search.data || hojeISO());
  const [tecnicoFiltro, setTecnicoFiltro] = useState(search.tecnicoId ?? "");

  const {
    data: agendamentos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: () => apiFetch<AgendamentoApi[]>("/api/Agendamentos"),
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => apiFetch<UsuarioApi[]>("/api/Usuarios"),
    retry: false,
  });

  const mecanicos = useMemo(() => usuarios.filter((u) => u.role === "Mecânico"), [usuarios]);

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ["veiculos"],
    queryFn: () => apiFetch<VeiculoApi[]>("/api/Veiculos"),
  });

  const nomeTecnico = (id: string) => mecanicos.find((u) => u.id === id)?.nome ?? "—";
  const nomeCliente = (id: number | null) =>
    id ? (clientes.find((c) => c.id === id)?.nome ?? "—") : "—";
  const placaVeiculo = (id: number | null) =>
    id ? (veiculos.find((v) => v.id === id)?.placa ?? "—") : "—";

  const lista = useMemo(() => {
    return agendamentos
      .filter((a) => a.dataHoraInicio.slice(0, 10) === diaFiltro)
      .filter((a) => !tecnicoFiltro || a.tecnicoId === tecnicoFiltro)
      .sort((a, b) => a.dataHoraInicio.localeCompare(b.dataHoraInicio));
  }, [agendamentos, diaFiltro, tecnicoFiltro]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
        <p className="text-sm text-muted-foreground">
          Agenda dos mecânicos, só para consulta — agendamentos são criados e alterados a partir do
          formulário de Ordens de Serviço.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="cal-dia">Dia</Label>
          <Input
            id="cal-dia"
            type="date"
            value={diaFiltro}
            onChange={(e) => setDiaFiltro(e.target.value)}
            className="w-44"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cal-tecnico-filtro">Técnico</Label>
          <Select
            value={tecnicoFiltro || "_todos"}
            onValueChange={(v) => setTecnicoFiltro(v === "_todos" ? "" : v)}
          >
            <SelectTrigger id="cal-tecnico-filtro" className="w-56">
              <SelectValue placeholder="Todos os técnicos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_todos">Todos os técnicos</SelectItem>
              {mecanicos.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Horário</th>
              <th className="px-5 py-3 font-medium">Técnico</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Veículo</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Observação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando agenda...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar a agenda. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 font-medium">{formatarHorario(a.dataHoraInicio)}</td>
                  <td className="px-5 py-3">{nomeTecnico(a.tecnicoId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{nomeCliente(a.clienteId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{placaVeiculo(a.veiculoId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.status}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.observacao ?? "—"}</td>
                </tr>
              ))}
            {!isLoading && !isError && lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhum agendamento neste dia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
