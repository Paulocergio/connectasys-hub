import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessao } from "@/lib/connecta-store";
import { podeAcessar } from "@/lib/permissoes";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Car } from "@/components/icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/_app/veiculos")({
  ssr: false,
  beforeLoad: () => {
    if (!podeAcessar(getSessao()?.papel, "veiculos")) throw redirect({ to: "/dashboard" });
  },
  component: VeiculosPage,
});

const TIPOS_VEICULO = ["Carro", "Moto", "Caminhão", "Outros"] as const;
type TipoVeiculo = (typeof TIPOS_VEICULO)[number];

type VeiculoApi = {
  id: number;
  clienteId: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  tipo: TipoVeiculo;
  dataCadastro: string;
};

type ClienteApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataCadastro: string;
};

type Form = {
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  tipo: TipoVeiculo;
};

const vazio: Form = {
  clienteId: "",
  placa: "",
  marca: "",
  modelo: "",
  ano: "",
  cor: "",
  tipo: "Carro",
};

// Placa antiga (AAA9999) ou Mercosul (AAA9A99), sempre em maiúsculo.
const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

function VeiculosPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<VeiculoApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<VeiculoApi | null>(null);

  const {
    data: veiculos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["veiculos"],
    queryFn: () => apiFetch<VeiculoApi[]>("/api/Veiculos"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const nomeCliente = (clienteId: number) => clientes.find((c) => c.id === clienteId)?.nome ?? "—";

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["veiculos"] });

  const criar = useMutation({
    mutationFn: (dados: Form) =>
      apiFetch("/api/Veiculos", {
        method: "POST",
        body: JSON.stringify({
          clienteId: Number(dados.clienteId),
          placa: dados.placa,
          marca: dados.marca,
          modelo: dados.modelo,
          ano: Number(dados.ano),
          cor: dados.cor,
          tipo: dados.tipo,
        }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Veículo cadastrado.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
      apiFetch(`/api/Veiculos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          clienteId: Number(dados.clienteId),
          placa: dados.placa,
          marca: dados.marca,
          modelo: dados.modelo,
          ano: Number(dados.ano),
          cor: dados.cor,
          tipo: dados.tipo,
        }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Veículo atualizado.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const remover = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/Veiculos/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      toast.success("Veículo removido.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return veiculos;
    return veiculos.filter(
      (v) =>
        v.placa.toLowerCase().includes(q) ||
        v.marca.toLowerCase().includes(q) ||
        v.modelo.toLowerCase().includes(q) ||
        v.tipo.toLowerCase().includes(q),
    );
  }, [veiculos, busca]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(v: VeiculoApi) {
    setEditando(v);
    setForm({
      clienteId: String(v.clienteId),
      placa: v.placa.toUpperCase(),
      marca: v.marca,
      modelo: v.modelo,
      ano: String(v.ano),
      cor: v.cor,
      tipo: v.tipo,
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clienteId) {
      toast.error("Selecione o cliente.");
      return;
    }
    if (!PLACA_REGEX.test(form.placa)) {
      toast.error("Placa inválida. Use o padrão antigo (ABC1234) ou Mercosul (ABC1D23).");
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
          <h1 className="text-2xl font-bold tracking-tight">Veículos</h1>
          <p className="text-sm text-muted-foreground">
            Veículos cadastrados dos clientes da oficina.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo veículo
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por placa, marca ou modelo"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Placa</th>
              <th className="px-5 py-3 font-medium">Tipo</th>
              <th className="px-5 py-3 font-medium">Marca</th>
              <th className="px-5 py-3 font-medium">Modelo</th>
              <th className="px-5 py-3 font-medium">Ano</th>
              <th className="px-5 py-3 font-medium">Cor</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando veículos...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar os veículos. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((v) => (
                <tr key={v.id}>
                  <td className="px-5 py-3 font-medium">{v.placa.toUpperCase()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.tipo}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.marca}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.modelo}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.ano}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.cor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{nomeCliente(v.clienteId)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(v)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExcluir(v)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && !isError && lista.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhum veículo encontrado.
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
                <Car className="h-5 w-5" />
              </span>
              <DialogTitle>{editando ? "Editar veículo" : "Novo veículo"}</DialogTitle>
            </div>
            <DialogDescription>
              {editando ? "Atualize os dados do veículo." : "Preencha os dados do novo veículo."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="v-cliente">Cliente</Label>
              {clientes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum cliente cadastrado. Cadastre um cliente antes de adicionar um veículo.
                </p>
              ) : (
                <Select
                  value={form.clienteId}
                  onValueChange={(v) => setForm({ ...form, clienteId: v })}
                >
                  <SelectTrigger id="v-cliente">
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
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-placa">Placa</Label>
                <Input
                  id="v-placa"
                  required
                  maxLength={7}
                  placeholder="ABC1234 ou ABC1D23"
                  value={form.placa}
                  onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-cor">Cor</Label>
                <Input
                  id="v-cor"
                  required
                  value={form.cor}
                  onChange={(e) => setForm({ ...form, cor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-marca">Marca</Label>
                <Input
                  id="v-marca"
                  required
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-modelo">Modelo</Label>
                <Input
                  id="v-modelo"
                  required
                  value={form.modelo}
                  onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="v-ano">Ano</Label>
                <Input
                  id="v-ano"
                  required
                  inputMode="numeric"
                  placeholder="2024"
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-tipo">Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => setForm({ ...form, tipo: v as TipoVeiculo })}
                >
                  <SelectTrigger id="v-tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_VEICULO.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button
                type="submit"
                disabled={salvando || clientes.length === 0}
                className="rounded-full"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {excluir?.placa}?</AlertDialogTitle>
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
