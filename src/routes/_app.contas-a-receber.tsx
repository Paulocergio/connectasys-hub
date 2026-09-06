import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, HandCoins } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { PaymentMethodBadge } from "@/components/payment-method-badge";
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
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/_app/contas-a-receber")({
  ssr: false,
  component: ContasAReceberPage,
});

const FORMAS_PAGAMENTO = ["Cartão", "Pix", "Boleto", "Dinheiro"] as const;

type ContaReceberApi = {
  id: number;
  clienteId: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataRecebimento: string | null;
  formaPagamento: (typeof FORMAS_PAGAMENTO)[number] | null;
  status: "Pendente" | "Paga" | "Atrasada";
  dataCadastro: string;
  ordemServicoId: number | null;
};

type ClienteApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
};

type Form = {
  clienteId: string;
  descricao: string;
  valor: string;
  dataVencimento: string;
  dataRecebimento: string;
  formaPagamento: string;
};

const vazio: Form = {
  clienteId: "",
  descricao: "",
  valor: "",
  dataVencimento: "",
  dataRecebimento: "",
  formaPagamento: "",
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function ContasAReceberPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<ContaReceberApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<ContaReceberApi | null>(null);

  const {
    data: contas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contas-a-receber"],
    queryFn: () => apiFetch<ContaReceberApi[]>("/api/ContasReceber"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const nomesPorCliente = useMemo(() => {
    const mapa = new Map<number, string>();
    for (const c of clientes) mapa.set(c.id, c.nome);
    return mapa;
  }, [clientes]);

  function nomeCliente(clienteId: number) {
    return nomesPorCliente.get(clienteId) ?? `Cliente #${clienteId}`;
  }

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return contas;
    return contas.filter(
      (c) =>
        c.descricao.toLowerCase().includes(q) ||
        (nomesPorCliente.get(c.clienteId) ?? "").toLowerCase().includes(q),
    );
  }, [contas, busca, nomesPorCliente]);

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["contas-a-receber"] });

  const criar = useMutation({
    mutationFn: (dados: Form) =>
      apiFetch("/api/ContasReceber", {
        method: "POST",
        body: JSON.stringify({
          clienteId: Number(dados.clienteId),
          descricao: dados.descricao,
          valor: Number(dados.valor.replace(",", ".")),
          dataVencimento: dados.dataVencimento,
        }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Conta cadastrada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
      apiFetch(`/api/ContasReceber/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          clienteId: Number(dados.clienteId),
          descricao: dados.descricao,
          valor: Number(dados.valor.replace(",", ".")),
          dataVencimento: dados.dataVencimento,
          dataRecebimento: dados.dataRecebimento || null,
          formaPagamento: dados.dataRecebimento ? dados.formaPagamento : null,
        }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Conta atualizada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const remover = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/ContasReceber/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      toast.success("Conta removida.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(c: ContaReceberApi) {
    setEditando(c);
    setForm({
      clienteId: String(c.clienteId),
      descricao: c.descricao,
      valor: String(c.valor),
      dataVencimento: c.dataVencimento.slice(0, 10),
      dataRecebimento: c.dataRecebimento ? c.dataRecebimento.slice(0, 10) : "",
      formaPagamento: c.formaPagamento ?? "",
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clienteId) {
      toast.error("Selecione um cliente.");
      return;
    }
    if (!(Number(form.valor.replace(",", ".")) > 0)) {
      toast.error("Informe um valor maior que zero.");
      return;
    }
    if (form.dataRecebimento && !form.formaPagamento) {
      toast.error("Selecione a forma de pagamento.");
      return;
    }
    if (editando) {
      atualizar.mutate({ id: editando.id, dados: form });
    } else {
      criar.mutate(form);
    }
  }

  const salvando = criar.isPending || atualizar.isPending;
  const semClientes = clientes.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas a Receber</h1>
          <p className="text-sm text-muted-foreground">
            Controle os valores que a oficina tem a receber de clientes.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Nova conta
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por descrição ou cliente"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Descrição</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Vencimento</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Forma de pagamento</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando contas...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar as contas. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium">{nomeCliente(c.clienteId)}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <div>{c.descricao}</div>
                    {c.ordemServicoId !== null && (
                      <Link
                        to="/ordens-servico"
                        search={{ os: c.ordemServicoId }}
                        className="text-xs text-primary underline-offset-2 hover:underline"
                      >
                        OS #{c.ordemServicoId}
                      </Link>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatarMoeda(c.valor)}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatarData(c.dataVencimento)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3">
                    <PaymentMethodBadge formaPagamento={c.formaPagamento} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExcluir(c)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && !isError && lista.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma conta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <HandCoins className="h-5 w-5" />
              </span>
              <DialogTitle>
                {editando ? "Editar Conta a Receber" : "Nova Conta a Receber"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {editando
                ? "Atualize os dados da conta a receber."
                : "Preencha os dados da nova conta a receber."}
            </DialogDescription>
          </DialogHeader>
          {editando?.ordemServicoId != null && (
            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Gerada automaticamente pela conclusão da{" "}
              <Link
                to="/ordens-servico"
                search={{ os: editando.ordemServicoId }}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                OS #{editando.ordemServicoId}
              </Link>
              .
            </p>
          )}
          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cr-cliente">Cliente</Label>
              <Select
                value={form.clienteId}
                onValueChange={(v) => setForm({ ...form, clienteId: v })}
              >
                <SelectTrigger id="cr-cliente">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {semClientes ? (
                    <SelectItem value="_sem-clientes" disabled>
                      Nenhum cliente cadastrado
                    </SelectItem>
                  ) : (
                    clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-descricao">Descrição</Label>
              <Input
                id="cr-descricao"
                required
                placeholder="Ex: Troca de óleo e filtros"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cr-valor">Valor</Label>
                <Input
                  id="cr-valor"
                  required
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cr-vencimento">Vencimento</Label>
                <Input
                  id="cr-vencimento"
                  type="date"
                  required
                  value={form.dataVencimento}
                  onChange={(e) => setForm({ ...form, dataVencimento: e.target.value })}
                />
              </div>
            </div>
            {editando && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cr-recebimento">Data de recebimento</Label>
                  <Input
                    id="cr-recebimento"
                    type="date"
                    value={form.dataRecebimento}
                    onChange={(e) => setForm({ ...form, dataRecebimento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cr-forma-pagamento">Forma de pagamento</Label>
                  <Select
                    value={form.formaPagamento}
                    onValueChange={(v) => setForm({ ...form, formaPagamento: v })}
                  >
                    <SelectTrigger id="cr-forma-pagamento">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMAS_PAGAMENTO.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setAberto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando || semClientes} className="rounded-full">
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {excluir?.descricao}?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
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
