import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Sessao } from "@/lib/connecta-store";

export type Tema = "dark" | "light";

export const CHAVE_TEMA = "connectasys-tema";

// O tema só se aplica dentro da área logada (ver _app.tsx) — landing e
// login sempre ficam no tema escuro fixo, sem essa classe.
//
// A preferência é salva no cadastro do usuário e volta no login (ver
// connecta-store.tsx). O localStorage aqui serve só de fallback antes da
// sessão carregar e para sessões antigas em cache sem o campo `tema`.
export function getTemaInicial(sessao?: Sessao | null): Tema {
  if (sessao?.tema === "dark" || sessao?.tema === "light") return sessao.tema;
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(CHAVE_TEMA) === "dark" ? "dark" : "light";
}

export function useTema(sessao: Sessao | null) {
  const [tema, setTemaState] = useState<Tema>(() => getTemaInicial(sessao));

  useEffect(() => {
    setTemaState(getTemaInicial(sessao));
  }, [sessao?.id, sessao?.tema]);

  function setTema(novo: Tema) {
    window.localStorage.setItem(CHAVE_TEMA, novo);
    setTemaState(novo);
    apiFetch("/api/Usuarios/me/tema", {
      method: "PATCH",
      body: JSON.stringify({ tema: novo }),
    }).catch(() => {
      // Falha ao salvar no servidor: o tema muda na tela mesmo assim,
      // só não vai persistir para o próximo login.
    });
  }

  return { tema, setTema };
}
