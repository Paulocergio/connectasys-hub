import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessao } from "@/lib/connecta-store";
import { podeAcessar } from "@/lib/permissoes";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Contact } from "@/components/icons";
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

export const Route = createFileRoute("/_app/clientes")({
  ssr: false,
  beforeLoad: () => {
    if (!podeAcessar(getSessao()?.papel, "clientes")) throw redirect({ to: "/dashboard" });
  },
  component: ClientesPage,
});

type ClienteApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string | null;
  cnpj: string | null;
  razaoSocial: string | null;
  cep: string | null;
  logradouro: string | null;
  bairro: string | null;
  municipio: string | null;
  uf: string | null;
  dataCadastro: string;
};

type Form = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  razaoSocial: string;
  cep: string;
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
};

const vazio: Form = {
  nome: "",
  email: "",
  telefone: "",
  documento: "",
  razaoSocial: "",
  cep: "",
  logradouro: "",
  bairro: "",
  municipio: "",
  uf: "",
};

type BrasilApiCnpj = {
  razao_social?: string;
  logradouro?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
};

type ViaCepEndereco = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

function formatarDocumento(c: ClienteApi) {
  if (c.cnpj) return c.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  if (c.cpf) return c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return "—";
}

function formatarCidade(c: ClienteApi) {
  if (c.municipio && c.uf) return `${c.municipio}/${c.uf}`;
  return c.municipio ?? "—";
}

function apenasDigitos(v: string) {
  return v.replace(/\D/g, "");
}

function ClientesPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<ClienteApi | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<ClienteApi | null>(null);
  const [consultando, setConsultando] = useState(false);

  const {
    data: clientes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => apiFetch<ClienteApi[]>("/api/Clientes"),
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["clientes"] });

  const tipoDocumento =
    form.documento.length === 14 ? "cnpj" : form.documento.length === 11 ? "cpf" : null;

  async function consultarCnpj(cnpj: string) {
    setConsultando(true);
    try {
      const resp = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!resp.ok) {
        toast.error("CNPJ não encontrado. Preencha o endereço manualmente.");
        return;
      }
      const dados: BrasilApiCnpj = await resp.json();
      setForm((f) => ({
        ...f,
        razaoSocial: dados.razao_social ?? f.razaoSocial,
        logradouro: dados.logradouro ?? f.logradouro,
        bairro: dados.bairro ?? f.bairro,
        municipio: dados.municipio ?? f.municipio,
        uf: dados.uf ?? f.uf,
        cep: dados.cep ? apenasDigitos(dados.cep) : f.cep,
        telefone: dados.ddd_telefone_1 || f.telefone,
      }));
    } catch {
      toast.error("Não foi possível consultar o CNPJ agora. Preencha o endereço manualmente.");
    } finally {
      setConsultando(false);
    }
  }

  async function consultarCep(cep: string) {
    setConsultando(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados: ViaCepEndereco = await resp.json();
      if (!resp.ok || dados.erro) {
        toast.error("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }
      setForm((f) => ({
        ...f,
        logradouro: dados.logradouro ?? f.logradouro,
        bairro: dados.bairro ?? f.bairro,
        municipio: dados.localidade ?? f.municipio,
        uf: dados.uf ?? f.uf,
      }));
    } catch {
      toast.error("Não foi possível consultar o CEP agora. Preencha o endereço manualmente.");
    } finally {
      setConsultando(false);
    }
  }

  function montarPayload(dados: Form) {
    return {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cpf: tipoDocumento === "cpf" ? dados.documento : null,
      cnpj: tipoDocumento === "cnpj" ? dados.documento : null,
      razaoSocial: tipoDocumento === "cnpj" ? dados.razaoSocial || null : null,
      cep: dados.cep || null,
      logradouro: dados.logradouro || null,
      bairro: dados.bairro || null,
      municipio: dados.municipio || null,
      uf: dados.uf || null,
    };
  }

  const criar = useMutation({
    mutationFn: (dados: Form) =>
      apiFetch("/api/Clientes", { method: "POST", body: JSON.stringify(montarPayload(dados)) }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Cliente cadastrado.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
      apiFetch(`/api/Clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...montarPayload(dados) }),
      }),
    onSuccess: () => {
      invalidar();
      setAberto(false);
      toast.success("Cliente atualizado.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const remover = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/Clientes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidar();
      setExcluir(null);
      toast.success("Cliente removido.");
    },
    onError: (erro: Error) => toast.error(erro.message),
  });

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.cpf ?? "").includes(q) ||
        (c.cnpj ?? "").includes(q),
    );
  }, [clientes, busca]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(c: ClienteApi) {
    setEditando(c);
    setForm({
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      documento: c.cnpj ?? c.cpf ?? "",
      razaoSocial: c.razaoSocial ?? "",
      cep: c.cep ?? "",
      logradouro: c.logradouro ?? "",
      bairro: c.bairro ?? "",
      municipio: c.municipio ?? "",
      uf: c.uf ?? "",
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (form.documento && tipoDocumento === null) {
      toast.error("Documento inválido. Use um CPF (11 dígitos) ou CNPJ (14 dígitos).");
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
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Clientes cadastrados da oficina.</p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo cliente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, documento ou email"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">Documento</th>
              <th className="px-5 py-3 font-medium">Telefone</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Cidade/UF</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Carregando clientes...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-destructive">
                  Não foi possível carregar os clientes. Confira se a API está no ar.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              lista.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium">{c.nome}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatarDocumento(c)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.telefone}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatarCidade(c)}</td>
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
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
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
                <Contact className="h-5 w-5" />
              </span>
              <DialogTitle>{editando ? "Editar cliente" : "Novo cliente"}</DialogTitle>
            </div>
            <DialogDescription>
              {editando
                ? "Atualize os dados do cliente."
                : "Informe o documento para preencher o endereço automaticamente."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-documento">Documento (CPF ou CNPJ)</Label>
                <Input
                  id="c-documento"
                  inputMode="numeric"
                  maxLength={18}
                  placeholder="Só números (aceita colar com máscara)"
                  value={form.documento}
                  onChange={(e) => {
                    const digitos = apenasDigitos(e.target.value).slice(0, 14);
                    setForm((f) => ({ ...f, documento: digitos }));
                    if (digitos.length === 14) consultarCnpj(digitos);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-nome">Nome</Label>
                <Input
                  id="c-nome"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
            </div>
            {tipoDocumento === "cnpj" && (
              <div className="space-y-2">
                <Label htmlFor="c-razao">Razão Social</Label>
                <Input
                  id="c-razao"
                  value={form.razaoSocial}
                  onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
                />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-telefone">Telefone</Label>
                <Input
                  id="c-telefone"
                  required
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
            </div>
            {tipoDocumento === "cpf" && (
              <div className="space-y-2 sm:max-w-[calc(50%-0.5rem)]">
                <Label htmlFor="c-cep">CEP</Label>
                <Input
                  id="c-cep"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Só números (aceita colar com máscara)"
                  value={form.cep}
                  onChange={(e) => {
                    const digitos = apenasDigitos(e.target.value).slice(0, 8);
                    setForm((f) => ({ ...f, cep: digitos }));
                    if (digitos.length === 8) consultarCep(digitos);
                  }}
                />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-logradouro">Logradouro</Label>
                <Input
                  id="c-logradouro"
                  value={form.logradouro}
                  onChange={(e) => setForm({ ...form, logradouro: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-bairro">Bairro</Label>
                <Input
                  id="c-bairro"
                  value={form.bairro}
                  onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="c-municipio">Município</Label>
                <Input
                  id="c-municipio"
                  value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-uf">UF</Label>
                <Input
                  id="c-uf"
                  maxLength={2}
                  className="w-16 uppercase"
                  value={form.uf}
                  onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })}
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
              <Button type="submit" disabled={salvando || consultando} className="rounded-full">
                {salvando ? "Salvando..." : consultando ? "Consultando..." : "Salvar"}
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
