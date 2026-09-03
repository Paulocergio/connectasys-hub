const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7074";

export const TOKEN_KEY = "connectasys.token";
export const SESSION_KEY = "connectasys.sessao";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSessao() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

async function extrairMensagemErro(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.title) return data.detail ? `${data.title}: ${data.detail}` : data.title;
    if (data?.errors) {
      const primeiro = Object.values(data.errors).flat()[0];
      if (typeof primeiro === "string") return primeiro;
    }
  } catch {
    // resposta sem corpo JSON
  }
  return `Erro ${response.status} ao comunicar com a API.`;
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearSessao();
    window.location.href = "/auth";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error(await extrairMensagemErro(response));
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
