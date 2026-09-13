import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, clearSessao, setToken, SESSION_KEY } from "@/lib/api";
import type { Tema } from "@/lib/tema";

export type Sessao = {
  id: string;
  nome: string;
  email: string;
  papel: string;
  tema: Tema;
  trialExpiraEmUtc: string;
};

type LoginResponse = {
  token: string;
  expiraEmUtc: string;
  usuarioId: string;
  nome: string;
  role: string;
  tema: string;
  trialExpiraEmUtc: string;
};

export type RegistrarDados = {
  nomeEmpresa: string;
  nomeUsuario: string;
  email: string;
  telefone: string;
  senha: string;
};

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
  sessao: Sessao | null;
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  registrar: (dados: RegistrarDados) => Promise<{ ok: boolean; erro?: string }>;
  logout: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function ConnectaProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);

  useEffect(() => {
    setSessao(getSessao());
  }, []);

  function aplicarSessao(resposta: LoginResponse, email: string) {
    const s: Sessao = {
      id: resposta.usuarioId,
      nome: resposta.nome,
      email,
      papel: resposta.role,
      tema: resposta.tema === "dark" ? "dark" : "light",
      trialExpiraEmUtc: resposta.trialExpiraEmUtc,
    };
    setToken(resposta.token);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSessao(s);
  }

  const login: Ctx["login"] = useCallback(async (email, senha) => {
    try {
      const resposta = await apiFetch<LoginResponse>("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });
      aplicarSessao(resposta, email);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro instanceof Error ? erro.message : "Falha no login." };
    }
  }, []);

  const registrar: Ctx["registrar"] = useCallback(async (dados) => {
    try {
      const resposta = await apiFetch<LoginResponse>("/api/Auth/registrar", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      aplicarSessao(resposta, dados.email);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro instanceof Error ? erro.message : "Falha no cadastro." };
    }
  }, []);

  const logout = useCallback(() => {
    clearSessao();
    setSessao(null);
  }, []);

  const value = useMemo(
    () => ({ sessao, login, registrar, logout }),
    [sessao, login, registrar, logout],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useConnecta() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useConnecta precisa estar dentro de ConnectaProvider");
  return ctx;
}
