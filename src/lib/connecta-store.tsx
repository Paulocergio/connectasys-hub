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

export type Sessao = { id: string; nome: string; email: string; papel: string; tema: Tema };

type LoginResponse = {
  token: string;
  expiraEmUtc: string;
  usuarioId: string;
  nome: string;
  role: string;
  tema: string;
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
  logout: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function ConnectaProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);

  useEffect(() => {
    setSessao(getSessao());
  }, []);

  const login: Ctx["login"] = useCallback(async (email, senha) => {
    try {
      const resposta = await apiFetch<LoginResponse>("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });
      const s: Sessao = {
        id: resposta.usuarioId,
        nome: resposta.nome,
        email,
        papel: resposta.role,
        tema: resposta.tema === "dark" ? "dark" : "light",
      };
      setToken(resposta.token);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSessao(s);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro instanceof Error ? erro.message : "Falha no login." };
    }
  }, []);

  const logout = useCallback(() => {
    clearSessao();
    setSessao(null);
  }, []);

  const value = useMemo(() => ({ sessao, login, logout }), [sessao, login, logout]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useConnecta() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useConnecta precisa estar dentro de ConnectaProvider");
  return ctx;
}
