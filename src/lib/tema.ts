import { useState } from "react";

export type Tema = "dark" | "light";

export const CHAVE_TEMA = "connectasys-tema";

// O tema só se aplica dentro da área logada (ver _app.tsx) — landing e
// login sempre ficam no tema escuro fixo, sem essa classe.
export function getTemaInicial(): Tema {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(CHAVE_TEMA) === "dark" ? "dark" : "light";
}

export function useTema() {
  const [tema, setTemaState] = useState<Tema>(getTemaInicial);

  function setTema(novo: Tema) {
    window.localStorage.setItem(CHAVE_TEMA, novo);
    setTemaState(novo);
  }

  return { tema, setTema };
}
