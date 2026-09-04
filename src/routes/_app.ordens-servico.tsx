import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  StatusOrdemServicoBadge,
  type StatusOrdemServico,
} from "@/components/status-ordem-servico-badge";
import { apiFetch } from "@/lib/api";

const STATUS_LISTA: StatusOrdemServico[] = [
  "Aberto",
  "Em Andamento",
  "Aguardando Peça",
  "Concluído",
  "Cancelado",
];

export const Route = createFileRoute("/_app/ordens-servico")({
  ssr: false,
  component: OrdensServicoPage,
});

type ItemOrdemServicoApi = {
  id: number;
  ordemServicoId: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
};

type OrdemServicoApi = {
  id: number;
  clienteId: number;
  veiculoId: number;
  tecnicoId: string | null;
  status: StatusOrdemServico;
  descricaoProblema: string;
  diagnostico: string | null;
  solucao: string | null;
  dataAbertura: string;
  previsaoTermino: string | null;
  dataConclusao: string | null;
  valorMaoDeObra: number;
  desconto: number;
  aprovacaoClienteEm: string | null;
  aprovacaoClienteNome: string | null;
  itens: ItemOrdemServicoApi[];
  valorTotal: number;
};

type ClienteApi = { id: number; nome: string };
type VeiculoApi = { id: number; clienteId: number; placa: string; marca: string; modelo: string };
type UsuarioApi = { id: string; nome: string };

type Form = {
  clienteId: string;
  veiculoId: string;
  tecnicoId: string;
  status: StatusOrdemServico;
  descricaoProblema: string;
  diagnostico: string;
  solucao: string;
  previsaoTermino: string;
  dataConclusao: string;
  valorMaoDeObra: string;
  desconto: string;
  aprovacaoClienteNome: string;
  aprovacaoClienteEm: string;
};

const vazio: Form = {
  clienteId: "",
  veiculoId: "",
  tecnicoId: "",
  status: "Aberto",
  descricaoProblema: "",
  diagnostico: "",
  solucao: "",
  previsaoTermino: "",
  dataConclusao: "",
  valorMaoDeObra: "",
  desconto: "",
  aprovacaoClienteNome: "",
  aprovacaoClienteEm: "",
};

type ItemForm = { descricao: string; quantidade: string; valorUnitario: string };
const itemVazio: ItemForm = { descricao: "", quantidade: "", valorUnitario: "" };

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function OrdensServicoPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<OrdemServicoApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [itemForm, setItemForm] = useState<ItemForm>(itemVazio);
  const [itensNovos, setItensNovos] = useState<ItemForm[]>([]);
  const [excluir, setExcluir] = useState<OrdemServicoApi | null>(null);

  const {
    data: ordens = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ordens-servico"],
    queryFn: () => apiFetch<OrdemServicoApi[]>("/api/OrdensServico"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ["veiculos"],
    queryFn: () => apiFetch<VeiculoApi[]>("/api/Veiculos"),
  });

  const { data: usuarios = [], isError: usuariosIndisponiveis } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => apiFetch<UsuarioApi[]>("/api/Usuarios"),
    retry: false,
  });

  const nomeCliente = (clienteId: number) => clientes.find((c) => c.id === clienteId)?.nome ?? "—";
  const veiculoDe = (veiculoId: number) => veiculos.find((v) => v.id === veiculoId);
  const placaVeiculo = (veiculoId: number) => veiculoDe(veiculoId)?.placa ?? "—";

  const veiculosDoClienteForm = useMemo(
    () => veiculos.filter((v) => v.clienteId === Number(form.clienteId)),
    [veiculos, form.clienteId],
  );

  const osAtual = editando ? (ordens.find((o) => o.id === editando.id) ?? editando) : null;

  const valorTotalExibido =
    editando && osAtual
      ? osAtual.valorTotal
      : Number(form.valorMaoDeObra.replace(",", ".") || 0) -
        Number(form.desconto.replace(",", ".") || 0) +
        itensNovos.reduce(
          (soma, item) =>
            soma +
            Number(item.quantidade.replace(",", ".") || 0) *
              Number(item.valorUnitario.replace(",", ".") || 0),
          0,
        );

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["ordens-servico"] });

  function montarPayload(dados: Form) {
    return {
      clienteId: Number(dados.clienteId),
      veiculoId: Number(dados.veiculoId),
      tecnicoId: dados.tecnicoId || null,
      status: dados.status,
      descricaoProblema: dados.descricaoProblema,
      diagnostico: dados.diagnostico || null,
      solucao: dados.solucao || null,
      previsaoTermino: dados.previsaoTermino || null,
      dataConclusao: dados.dataConclusao || null,
      valorMaoDeObra: Number(dados.valorMaoDeObra.replace(",", ".") || 0),
      desconto: Number(dados.desconto.replace(",", ".") || 0),
      aprovacaoClienteNome: dados.aprovacaoClienteNome || null,
      aprovacaoClienteEm: dados.aprovacaoClienteEm || null,
    };
  }

  const criar = useMutation({
    mutationFn: async ({ dados, itens }: { dados: Form; itens: ItemForm[] }) => {
      const criada = await apiFetch<OrdemServicoApi>("/api/OrdensServico", {
        method: "POST",
        body: JSON.stringify({
          clienteId: Number(dados.clienteId),
          veiculoId: Number(dados.veiculoId),
          descricaoProblema: dados.descricaoProblema,
          previsaoTermino: dados.previsaoTermino || null,
          valorMaoDeObra: Number(dados.valorMaoDeObra.replace(",", ".") || 0),
          desconto: Number(dados.desconto.replace(",", ".") || 0),
        }),
      });

      // Campos que o POST inicial não aceita (status/diagnóstico/técnico etc.)
      // vão num PUT logo em seguida, pra o modal de criar poder ter os mesmos
      // campos do de editar sem precisar de dois passos manuais do usuário.
      await apiFetch(`/api/OrdensServico/${criada.id}`, {
        method: "PUT",
        body: JSON.stringify({ id: criada.id, ...montarPayload(dados) }),
      });

      for (const item of itens) {
        await apiFetch(`/api/OrdensServico/${criada.id}/itens`, {
          method: "POST",
          body: JSON.stringify({
            ordemServicoId: criada.id,
            descricao: item.descricao,
            quantidade: Number(item.quantidade.replace(",", ".")),
            valorUnitario: Number(item.valorUnitario.replace(",", ".")),
          }),
        });
      }

      return criada;
    },
    onSuccess: () => {
      invalidar();
      setAberto(false);
      setItensNovos([]);
      toast.success("Ordem de serviço criada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
      apiFetch(`/api/OrdensServico/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...montarPayload(dados) }),
      }),
    onSuccess: () => {
      invalidar();
      toast.success("Ordem de serviço atualizada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const remover = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/OrdensServico/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      setAberto(false);
      toast.success("Ordem de serviço removida.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const adicionarItem = useMutation({
    mutationFn: ({ ordemServicoId, dados }: { ordemServicoId: number; dados: ItemForm }) =>
      apiFetch(`/api/OrdensServico/${ordemServicoId}/itens`, {
        method: "POST",
        body: JSON.stringify({
          ordemServicoId,
          descricao: dados.descricao,
          quantidade: Number(dados.quantidade.replace(",", ".")),
          valorUnitario: Number(dados.valorUnitario.replace(",", ".")),
        }),
      }),
    onSuccess: () => {
      invalidar();
      setItemForm(itemVazio);
      toast.success("Item adicionado.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const removerItem = useMutation({
    mutationFn: (itemId: number) =>
      apiFetch(`/api/OrdensServico/itens/${itemId}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      toast.success("Item removido.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return ordens;
    return ordens.filter((o) => {
      const veiculo = veiculoDe(o.veiculoId);
      return (
        nomeCliente(o.clienteId).toLowerCase().includes(q) ||
        (veiculo?.placa ?? "").toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      );
    });
  }, [ordens, busca, clientes, veiculos]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setItemForm(itemVazio);
    setItensNovos([]);
    setAberto(true);
  }

  function abrirEdicao(o: OrdemServicoApi) {
    setEditando(o);
    setForm({
      clienteId: String(o.clienteId),
      veiculoId: String(o.veiculoId),
      tecnicoId: o.tecnicoId ?? "",
      status: o.status,
      descricaoProblema: o.descricaoProblema,
      diagnostico: o.diagnostico ?? "",
      solucao: o.solucao ?? "",
      previsaoTermino: o.previsaoTermino ? o.previsaoTermino.slice(0, 10) : "",
      dataConclusao: o.dataConclusao ? o.dataConclusao.slice(0, 10) : "",
      valorMaoDeObra: String(o.valorMaoDeObra),
      desconto: String(o.desconto),
      aprovacaoClienteNome: o.aprovacaoClienteNome ?? "",
      aprovacaoClienteEm: o.aprovacaoClienteEm ? o.aprovacaoClienteEm.slice(0, 10) : "",
    });
    setItemForm(itemVazio);
    setAberto(true);
  }

  function trocarCliente(clienteId: string) {
    const aindaValido = veiculos.some(
      (v) => String(v.clienteId) === clienteId && String(v.id) === form.veiculoId,
    );
    setForm((f) => ({ ...f, clienteId, veiculoId: aindaValido ? f.veiculoId : "" }));
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clienteId || !form.veiculoId) {
      toast.error("Selecione o cliente e o veículo.");
      return;
    }
    if (editando) {
      atualizar.mutate({ id: editando.id, dados: form });
    } else {
      criar.mutate({ dados: form, itens: itensNovos });
    }
  }

  function salvarItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemForm.descricao || !itemForm.quantidade || !itemForm.valorUnitario) {
      toast.error("Preencha descrição, quantidade e valor unitário do item.");
      return;
    }
    if (editando) {
      adicionarItem.mutate({ ordemServicoId: editando.id, dados: itemForm });
    } else {
      setItensNovos((itens) => [...itens, itemForm]);
      setItemForm(itemVazio);
    }
  }

  function removerItemNovo(index: number) {
    setItensNovos((itens) => itens.filter((_, i) => i !== index));
  }

  const salvando = criar.isPending || atualizar.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as ordens de serviço da oficina, do problema relatado até a entrega.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Nova OS
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por cliente, placa ou status"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Veículo</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Abertura</th>
              <th className="px-5 py-3 font-medium">Valor Total</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando ordens de serviço...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar as ordens de serviço. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-medium">{nomeCliente(o.clienteId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{placaVeiculo(o.veiculoId)}</td>
                  <td className="px-5 py-3">
                    <StatusOrdemServicoBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatarData(o.dataAbertura)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatarMoeda(o.valorTotal)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(o)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExcluir(o)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && !isError && lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma ordem de serviço encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Wrench className="h-5 w-5" />
              </span>
              <DialogTitle>
                {editando ? "Editar ordem de serviço" : "Nova ordem de serviço"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {editando
                ? "Atualize os dados, o status e as peças da OS."
                : "Escolha o cliente e o veículo, e descreva o problema relatado."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-cliente">Cliente</Label>
                <Select value={form.clienteId} onValueChange={trocarCliente}>
                  <SelectTrigger id="os-cliente">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-veiculo">Veículo</Label>
                <Select
                  value={form.veiculoId}
                  onValueChange={(v) => setForm({ ...form, veiculoId: v })}
                  disabled={!form.clienteId}
                >
                  <SelectTrigger id="os-veiculo">
                    <SelectValue
                      placeholder={
                        form.clienteId ? "Selecione o veículo" : "Escolha o cliente primeiro"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculosDoClienteForm.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.placa} — {v.marca} {v.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="os-problema">Descrição do problema</Label>
              <Textarea
                id="os-problema"
                required
                rows={2}
                value={form.descricaoProblema}
                onChange={(e) => setForm({ ...form, descricaoProblema: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as StatusOrdemServico })}
                >
                  <SelectTrigger id="os-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_LISTA.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-tecnico">Técnico responsável</Label>
                {usuariosIndisponiveis ? (
                  <p className="text-sm text-muted-foreground">
                    Não foi possível carregar a lista de técnicos.
                  </p>
                ) : (
                  <Select
                    value={form.tecnicoId}
                    onValueChange={(v) => setForm({ ...form, tecnicoId: v })}
                  >
                    <SelectTrigger id="os-tecnico">
                      <SelectValue placeholder="Sem técnico designado" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-diagnostico">Diagnóstico</Label>
                <Textarea
                  id="os-diagnostico"
                  rows={2}
                  value={form.diagnostico}
                  onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-solucao">Solução</Label>
                <Textarea
                  id="os-solucao"
                  rows={2}
                  value={form.solucao}
                  onChange={(e) => setForm({ ...form, solucao: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-previsao">Previsão de término</Label>
                <Input
                  id="os-previsao"
                  type="date"
                  value={form.previsaoTermino}
                  onChange={(e) => setForm({ ...form, previsaoTermino: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-conclusao">Data de conclusão</Label>
                <Input
                  id="os-conclusao"
                  type="date"
                  value={form.dataConclusao}
                  onChange={(e) => setForm({ ...form, dataConclusao: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-mao-obra">Mão de obra</Label>
                <Input
                  id="os-mao-obra"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.valorMaoDeObra}
                  onChange={(e) => setForm({ ...form, valorMaoDeObra: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-desconto">Desconto</Label>
                <Input
                  id="os-desconto"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.desconto}
                  onChange={(e) => setForm({ ...form, desconto: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="os-aprovacao-nome">Aprovado por (cliente)</Label>
                <Input
                  id="os-aprovacao-nome"
                  value={form.aprovacaoClienteNome}
                  onChange={(e) => setForm({ ...form, aprovacaoClienteNome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os-aprovacao-data">Data de aprovação</Label>
                <Input
                  id="os-aprovacao-data"
                  type="date"
                  value={form.aprovacaoClienteEm}
                  onChange={(e) => setForm({ ...form, aprovacaoClienteEm: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Peças e materiais</h3>
                <span className="text-sm font-medium">
                  Total: {formatarMoeda(valorTotalExibido)}
                </span>
              </div>

              {editando && osAtual
                ? osAtual.itens.length > 0 && (
                    <div className="space-y-1.5">
                      {osAtual.itens.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                        >
                          <span>
                            {item.descricao} — {item.quantidade} ×{" "}
                            {formatarMoeda(item.valorUnitario)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={removerItem.isPending}
                            onClick={() => removerItem.mutate(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                : itensNovos.length > 0 && (
                    <div className="space-y-1.5">
                      {itensNovos.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                        >
                          <span>
                            {item.descricao} — {item.quantidade} ×{" "}
                            {formatarMoeda(Number(item.valorUnitario))}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removerItemNovo(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
                <Input
                  placeholder="Descrição"
                  value={itemForm.descricao}
                  onChange={(e) => setItemForm({ ...itemForm, descricao: e.target.value })}
                />
                <Input
                  placeholder="Qtd."
                  inputMode="decimal"
                  className="w-20"
                  value={itemForm.quantidade}
                  onChange={(e) => setItemForm({ ...itemForm, quantidade: e.target.value })}
                />
                <Input
                  placeholder="Valor un."
                  inputMode="decimal"
                  className="w-24"
                  value={itemForm.valorUnitario}
                  onChange={(e) => setItemForm({ ...itemForm, valorUnitario: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={adicionarItem.isPending}
                  onClick={salvarItem}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setAberto(false)}
              >
                Fechar
              </Button>
              <Button type="submit" disabled={salvando} className="rounded-full">
                {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar OS"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remover a OS de {excluir ? nomeCliente(excluir.clienteId) : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita — os itens da OS também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={remover.isPending}
              onClick={() => excluir && remover.mutate(excluir.id)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
