import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessao } from "@/lib/connecta-store";
import { podeAcessar } from "@/lib/permissoes";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Package } from "@/components/icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/_app/estoque")({
  ssr: false,
  beforeLoad: () => {
    if (!podeAcessar(getSessao()?.papel, "estoque")) throw redirect({ to: "/dashboard" });
  },
  component: EstoquePage,
});

type EstoqueApi = {
  id: number;
  nome: string;
  descricao: string | null;
  quantidade: number;
  precoCompra: number;
  precoVenda: number;
  dataCadastro: string;
};

type Form = {
  nome: string;
  descricao: string;
  quantidade: string;
  precoCompra: string;
  precoVenda: string;
  margemMarkup: string;
};

const vazio: Form = {
  nome: "",
  descricao: "",
  quantidade: "",
  precoCompra: "",
  precoVenda: "",
  margemMarkup: "",
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function paraNumero(valor: string) {
  return Number(valor.replace(",", ".")) || 0;
}

function formatarPercentual(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Margem de Markup: lucro como percentual sobre o preço de COMPRA (custo).
function calcularMargemMarkup(precoCompra: number, precoVenda: number) {
  if (precoCompra <= 0) return 0;
  return ((precoVenda - precoCompra) / precoCompra) * 100;
}

// Margem de Venda: lucro como percentual sobre o preço de VENDA.
function calcularMargemVenda(precoCompra: number, precoVenda: number) {
  if (precoVenda <= 0) return 0;
  return ((precoVenda - precoCompra) / precoVenda) * 100;
}

function EstoquePage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<EstoqueApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<EstoqueApi | null>(null);

  const {
    data: itens = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["estoque"],
    queryFn: () => apiFetch<EstoqueApi[]>("/api/Estoque"),
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["estoque"] });

  function montarPayload(dados: Form) {
    return {
      nome: dados.nome,
      descricao: dados.descricao || null,
      quantidade: paraNumero(dados.quantidade),
      precoCompra: paraNumero(dados.precoCompra),
      precoVenda: paraNumero(dados.precoVenda),
    };
  }

  const criar = useMutation({
    mutationFn: (dados: Form) =>
      apiFetch("/api/Estoque", { method: "POST", body: JSON.stringify(montarPayload(dados)) }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Peça cadastrada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
      apiFetch(`/api/Estoque/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...montarPayload(dados) }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Peça atualizada.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const remover = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/Estoque/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      toast.success("Peça removida.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return itens;
    return itens.filter((e) => e.nome.toLowerCase().includes(q));
  }, [itens, busca]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(e: EstoqueApi) {
    setEditando(e);
    setForm({
      nome: e.nome,
      descricao: e.descricao ?? "",
      quantidade: String(e.quantidade),
      precoCompra: String(e.precoCompra),
      precoVenda: String(e.precoVenda),
      margemMarkup: formatarPercentual(calcularMargemMarkup(e.precoCompra, e.precoVenda)),
    });
    setAberto(true);
  }

  // Preço de compra ou de venda mudou: recalcula a Margem de Markup exibida.
  function onPrecoChange(campo: "precoCompra" | "precoVenda", valor: string) {
    const novoForm = { ...form, [campo]: valor };
    const compra = paraNumero(novoForm.precoCompra);
    const venda = paraNumero(novoForm.precoVenda);
    novoForm.margemMarkup = formatarPercentual(calcularMargemMarkup(compra, venda));
    setForm(novoForm);
  }

  // Margem de Markup editada manualmente: recalcula o preço de venda a
  // partir do preço de compra (que fica fixo).
  function onMargemMarkupChange(valor: string) {
    const compra = paraNumero(form.precoCompra);
    const margem = paraNumero(valor);
    const novoPrecoVenda =
      compra > 0 ? (compra * (1 + margem / 100)).toFixed(2).replace(".", ",") : form.precoVenda;
    setForm({ ...form, margemMarkup: valor, precoVenda: novoPrecoVenda });
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
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
          <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
          <p className="text-sm text-muted-foreground">
            Controle as peças e materiais disponíveis na oficina.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Nova peça
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">Quantidade</th>
              <th className="px-5 py-3 font-medium">Preço de compra</th>
              <th className="px-5 py-3 font-medium">Preço de venda</th>
              <th className="px-5 py-3 font-medium">Margem de Venda</th>
              <th className="px-5 py-3 font-medium">Margem de Markup</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando estoque...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar o estoque. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((e) => (
                <tr key={e.id}>
                  <td className="px-5 py-3 font-medium">
                    <div>{e.nome}</div>
                    {e.descricao && (
                      <div className="text-xs text-muted-foreground">{e.descricao}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.quantidade}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatarMoeda(e.precoCompra)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatarMoeda(e.precoVenda)}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatarPercentual(calcularMargemVenda(e.precoCompra, e.precoVenda))}%
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatarPercentual(calcularMargemMarkup(e.precoCompra, e.precoVenda))}%
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(e)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExcluir(e)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && !isError && lista.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma peça encontrada.
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
                <Package className="h-5 w-5" />
              </span>
              <DialogTitle>{editando ? "Editar Peça" : "Nova Peça"}</DialogTitle>
            </div>
            <DialogDescription>
              {editando
                ? "Atualize os dados da peça em estoque."
                : "Preencha os dados da nova peça em estoque."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="es-nome">Nome</Label>
                <Input
                  id="es-nome"
                  required
                  placeholder="Ex: Filtro de óleo"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="es-descricao">Descrição (opcional)</Label>
                <Input
                  id="es-descricao"
                  placeholder="Ex: Marca, especificação"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="es-quantidade">Quantidade</Label>
              <Input
                id="es-quantidade"
                required
                inputMode="decimal"
                placeholder="0"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="es-compra">Preço de compra</Label>
                <Input
                  id="es-compra"
                  required
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.precoCompra}
                  onChange={(e) => onPrecoChange("precoCompra", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="es-venda">Preço de venda</Label>
                <Input
                  id="es-venda"
                  required
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.precoVenda}
                  onChange={(e) => onPrecoChange("precoVenda", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="es-margem-markup">Margem de Markup (%)</Label>
                <Input
                  id="es-margem-markup"
                  inputMode="decimal"
                  placeholder="0,0"
                  value={form.margemMarkup}
                  onChange={(e) => onMargemMarkupChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="es-margem-venda">Margem de Venda (%)</Label>
                <Input
                  id="es-margem-venda"
                  disabled
                  value={formatarPercentual(
                    calcularMargemVenda(paraNumero(form.precoCompra), paraNumero(form.precoVenda)),
                  )}
                />
              </div>
            </div>
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
            <AlertDialogTitle>Remover {excluir?.nome}?</AlertDialogTitle>
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
