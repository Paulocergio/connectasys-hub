import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnecta, type Papel, type Usuario } from "@/lib/connecta-store";

export const Route = createFileRoute("/app/usuarios")({
  ssr: false,
  component: UsuariosPage,
});

const papeis: Papel[] = ["admin", "gerente", "mecanico", "atendente"];

type Form = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  papel: Papel;
  autorizado: boolean;
};

const vazio: Form = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  papel: "mecanico",
  autorizado: true,
};

function UsuariosPage() {
  const { usuarios, sessao, criarUsuario, atualizarUsuario, removerUsuario } = useConnecta();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<Form>(vazio);
  const [excluir, setExcluir] = useState<Usuario | null>(null);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return usuarios.filter(
      (u) =>
        u.oficina === sessao?.oficina &&
        (!q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
  }, [usuarios, busca, sessao]);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(u: Usuario) {
    setEditando(u);
    setForm({
      nome: u.nome,
      email: u.email,
      senha: u.senha,
      telefone: u.telefone,
      papel: u.papel,
      autorizado: u.autorizado,
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (editando) {
      atualizarUsuario(editando.id, form);
      toast.success("Usuário atualizado.");
    } else {
      criarUsuario({ ...form, oficina: sessao?.oficina ?? "Minha Oficina" });
      toast.success("Usuário criado.");
    }
    setAberto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a equipe da oficina e quem está autorizado a acessar o sistema.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo usuário
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">E-mail</th>
              <th className="px-5 py-3 font-medium">Telefone</th>
              <th className="px-5 py-3 font-medium">Perfil</th>
              <th className="px-5 py-3 font-medium">Acesso</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {lista.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium">{u.nome}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.telefone}</td>
                <td className="px-5 py-3 capitalize text-muted-foreground">{u.papel}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.autorizado
                        ? "bg-primary/15 text-primary"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {u.autorizado ? "Autorizado" : "Bloqueado"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => abrirEdicao(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={u.id === sessao?.id}
                      onClick={() => setExcluir(u)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar usuário" : "Novo usuário"}</DialogTitle>
            <DialogDescription>
              Os dados ficam vinculados à oficina {sessao?.oficina}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="u-nome">Nome</Label>
              <Input
                id="u-nome"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="u-email">E-mail</Label>
                <Input
                  id="u-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-tel">Telefone</Label>
                <Input
                  id="u-tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="u-senha">Senha</Label>
                <Input
                  id="u-senha"
                  type="text"
                  required
                  minLength={6}
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Perfil</Label>
                <Select
                  value={form.papel}
                  onValueChange={(v) => setForm({ ...form, papel: v as Papel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {papeis.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Autorizado a acessar</p>
                <p className="text-xs text-muted-foreground">
                  Usuários bloqueados não conseguem fazer login.
                </p>
              </div>
              <Switch
                checked={form.autorizado}
                onCheckedChange={(v) => setForm({ ...form, autorizado: v })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
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
              onClick={() => {
                if (excluir) removerUsuario(excluir.id);
                setExcluir(null);
                toast.success("Usuário removido.");
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
