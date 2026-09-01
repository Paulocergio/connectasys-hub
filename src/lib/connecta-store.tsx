import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Papel = "admin" | "gerente" | "mecanico" | "atendente";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
  telefone: string;
  oficina: string;
  autorizado: boolean;
};

export type Sessao = { id: string; nome: string; email: string; papel: Papel; oficina: string };

const USERS_KEY = "connectasys.usuarios";
const SESSION_KEY = "connectasys.sessao";

const SEED: Usuario[] = [
  {
    id: "u-1",
    nome: "Rafael Moreira",
    email: "admin@connectasys.com",
    senha: "123456",
    papel: "admin",
    telefone: "(21) 99876-1122",
    oficina: "Oficina Central",
    autorizado: true,
  },
  {
    id: "u-2",
    nome: "Juliana Prado",
    email: "juliana@oficinacentral.com",
    senha: "123456",
    papel: "gerente",
    telefone: "(21) 98812-4477",
    oficina: "Oficina Central",
    autorizado: true,
  },
  {
    id: "u-3",
    nome: "Marcos Vinícius",
    email: "marcos@oficinacentral.com",
    senha: "123456",
    papel: "mecanico",
    telefone: "(21) 99120-8890",
    oficina: "Oficina Central",
    autorizado: false,
  },
];

function readUsers(): Usuario[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Usuario[];
  } catch {
    return SEED;
  }
}

export function getSessao(): Sessao | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Sessao) : null;
  } catch {
    return null;
  }
}

type Ctx = {
  usuarios: Usuario[];
  sessao: Sessao | null;
  login: (email: string, senha: string) => { ok: boolean; erro?: string };
  cadastrar: (dados: {
    nome: string;
    email: string;
    senha: string;
    oficina: string;
    telefone: string;
  }) => { ok: boolean; erro?: string };
  logout: () => void;
  criarUsuario: (u: Omit<Usuario, "id">) => void;
  atualizarUsuario: (id: string, u: Partial<Usuario>) => void;
  removerUsuario: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function ConnectaProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(SEED);
  const [sessao, setSessao] = useState<Sessao | null>(null);

  useEffect(() => {
    setUsuarios(readUsers());
    setSessao(getSessao());
  }, []);

  const persist = useCallback((next: Usuario[]) => {
    setUsuarios(next);
    if (typeof window !== "undefined")
      window.localStorage.setItem(USERS_KEY, JSON.stringify(next));
  }, []);

  const login: Ctx["login"] = useCallback((email, senha) => {
    const lista = readUsers();
    const found = lista.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.senha !== senha) return { ok: false, erro: "E-mail ou senha inválidos." };
    if (!found.autorizado)
      return { ok: false, erro: "Usuário sem autorização de acesso. Contate o administrador." };
    const s: Sessao = {
      id: found.id,
      nome: found.nome,
      email: found.email,
      papel: found.papel,
      oficina: found.oficina,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSessao(s);
    return { ok: true };
  }, []);

  const cadastrar: Ctx["cadastrar"] = useCallback(
    (dados) => {
      const lista = readUsers();
      if (lista.some((u) => u.email.toLowerCase() === dados.email.trim().toLowerCase()))
        return { ok: false, erro: "Já existe uma conta com este e-mail." };
      const novo: Usuario = {
        id: `u-${Date.now()}`,
        nome: dados.nome,
        email: dados.email.trim(),
        senha: dados.senha,
        papel: "admin",
        telefone: dados.telefone,
        oficina: dados.oficina,
        autorizado: true,
      };
      persist([...lista, novo]);
      return { ok: true };
    },
    [persist],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSessao(null);
  }, []);

  const criarUsuario: Ctx["criarUsuario"] = useCallback(
    (u) => persist([...readUsers(), { ...u, id: `u-${Date.now()}` }]),
    [persist],
  );

  const atualizarUsuario: Ctx["atualizarUsuario"] = useCallback(
    (id, patch) => persist(readUsers().map((u) => (u.id === id ? { ...u, ...patch } : u))),
    [persist],
  );

  const removerUsuario: Ctx["removerUsuario"] = useCallback(
    (id) => persist(readUsers().filter((u) => u.id !== id)),
    [persist],
  );

  const value = useMemo(
    () => ({
      usuarios,
      sessao,
      login,
      cadastrar,
      logout,
      criarUsuario,
      atualizarUsuario,
      removerUsuario,
    }),
    [usuarios, sessao, login, cadastrar, logout, criarUsuario, atualizarUsuario, removerUsuario],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useConnecta() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useConnecta precisa estar dentro de ConnectaProvider");
  return ctx;
}
