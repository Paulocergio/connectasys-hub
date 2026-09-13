// Controle de acesso por perfil (ver navegação em _app.tsx e o beforeLoad de
// cada rota protegida). Isso é só a camada de UX — a API também restringe as
// operações de escrita (POST/PUT/DELETE) por perfil nos mesmos módulos;
// leitura fica aberta pra qualquer usuário logado (o Dashboard agrega dados
// dos 4 módulos e precisa ler de todos, independente do perfil de quem olha).
export const PAPEIS_POR_PAGINA = {
  dashboard: ["Admin", "Mecânico", "Recepcionista", "Financeiro"],
  "contas-a-pagar": ["Admin", "Financeiro"],
  "contas-a-receber": ["Admin", "Financeiro"],
  clientes: ["Admin"],
  veiculos: ["Admin", "Recepcionista"],
  "ordens-servico": ["Admin", "Mecânico", "Recepcionista"],
  calendario: ["Admin", "Mecânico", "Recepcionista"],
  estoque: ["Admin"],
  usuarios: ["Admin"],
} as const;

export type Pagina = keyof typeof PAPEIS_POR_PAGINA;

export function podeAcessar(papel: string | undefined | null, pagina: Pagina): boolean {
  if (!papel) return false;
  return (PAPEIS_POR_PAGINA[pagina] as readonly string[]).includes(papel);
}
