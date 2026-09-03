import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Wallet } from "lucide-react";
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

export const Route = createFileRoute("/_app/contas-a-pagar")({
  ssr: false,
  component: ContasAPagarPage,
});

const FORMAS_PAGAMENTO = ["Cartão", "Pix", "Boleto", "Dinheiro"] as const;

type ContaPagarApi = {
  id: number;
  descricao: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  formaPagamento: (typeof FORMAS_PAGAMENTO)[number] | null;
  status: "Pendente" | "Paga" | "Atrasada";
  dataCadastro: string;
};

type Form = {
  descricao: string;
  fornecedor: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string;
  formaPagamento: string;
};

const vazio: Form = {
  descricao: "",
  fornecedor: "",
  valor: "",
  dataVencimento: "",
  dataPagamento: "",
  formaPagamento: "",
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function ContasAPagarPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<ContaPagarApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<ContaPagarApi | null>(null);

  const {
    data: contas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contas-a-pagar"],
    queryFn: () => apiFetch<ContaPagarApi[]>("/api/ContasPagar"),
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["contas-a-pagar"] });

  const criar = useMutation({
    mutationFn: (dados: Form) =>
      apiFetch("/api/ContasPagar", {
        method: "POST",
        body: JSON.stringify({
          descricao: dados.descricao,
          fornecedor: dados.fornecedor,
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
      apiFetch(`/api/ContasPagar/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          descricao: dados.descricao,
          fornecedor: dados.fornecedor,
          valor: Number(dados.valor.replace(",", ".")),
          dataVencimento: dados.dataVencimento,
          dataPagamento: dados.dataPagamento || null,
          formaPagamento: dados.dataPagamento ? dados.formaPagamento : null,
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
    mutationFn: (id: number) => apiFetch(`/api/ContasPagar/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      toast.success("Conta removida.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return contas;
    return contas.filter(
      (c) => c.descricao.toLowerCase().includes(q) || c.fornecedor.toLowerCase().includes(q),
    );
  }, [contas, busca]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(c: ContaPagarApi) {
    setEditando(c);
    setForm({
      descricao: c.descricao,
      fornecedor: c.fornecedor,
      valor: String(c.valor),
      dataVencimento: c.dataVencimento.slice(0, 10),
      dataPagamento: c.dataPagamento ? c.dataPagamento.slice(0, 10) : "",
      formaPagamento: c.formaPagamento ?? "",
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (form.dataPagamento && !form.formaPagamento) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-sm text-muted-foreground">
            Controle as contas da oficina: fornecedores, aluguel, consumo e outras despesas.
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
          placeholder="Buscar por descrição ou fornecedor"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Descrição</th>
              <th className="px-5 py-3 font-medium">Fornecedor</th>
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
                  <td className="px-5 py-3 font-medium">{c.descricao}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.fornecedor}</td>
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
                <Wallet className="h-5 w-5" />
              </span>
              <DialogTitle>{editando ? "Editar conta" : "Nova conta"}</DialogTitle>
            </div>
            <DialogDescription>
              {editando
                ? "Atualize os dados da conta a pagar."
                : "Preencha os dados da nova conta a pagar."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cp-descricao">Descrição</Label>
              <Input
                id="cp-descricao"
                required
                placeholder="Ex: Aluguel setembro/2026"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-fornecedor">Fornecedor</Label>
                <Input
                  id="cp-fornecedor"
                  required
                  value={form.fornecedor}
                  onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-valor">Valor</Label>
                <Input
                  id="cp-valor"
                  required
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-vencimento">Vencimento</Label>
                <Input
                  id="cp-vencimento"
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
                  <Label htmlFor="cp-pagamento">Data de pagamento</Label>
                  <Input
                    id="cp-pagamento"
                    type="date"
                    value={form.dataPagamento}
                    onChange={(e) => setForm({ ...form, dataPagamento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cp-forma-pagamento">Forma de pagamento</Label>
                  <Select
                    value={form.formaPagamento}
                    onValueChange={(v) => setForm({ ...form, formaPagamento: v })}
                  >
                    <SelectTrigger id="cp-forma-pagamento">
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
              <Button type="submit" disabled={salvando} className="rounded-full">
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
