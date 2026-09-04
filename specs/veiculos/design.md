# Design: Veículos

**Pasta:** `specs/veiculos/` · **Spec:** `specs/veiculos/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas veiculos`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Router, React 19,
      Tailwind v4, shadcn/ui, TanStack Query) — mesmo padrão de
      `_app.contas-a-pagar.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Todas as cores usam os tokens semânticos do Artigo V
- [x] Dados mockados isolados — não aplicável, tela consome API real
      diretamente (mesmo padrão de Contas a Pagar)
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.veiculos.tsx`, réplica do padrão já usado em
`_app.contas-a-pagar.tsx`: tabela + busca, modal (`Dialog`) de
criar/editar, `AlertDialog` de confirmação de remoção, dados via
`useQuery`/`useMutation` chamando `apiFetch` (`src/lib/api.ts`) em
`/api/Veiculos`. O formulário também busca `/api/Clientes` (somente
leitura) para popular um `Select` de cliente dono do veículo. Entrada
nova no menu lateral (`_app.tsx`, array `itens`).

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/veiculos` | `src/routes/_app.veiculos.tsx` | Nova | Lista + CRUD de veículos |

## 4. Componentes

Nenhum componente novo — tudo na própria rota, usando primitivas de
`src/components/ui`: `Button`, `Input`, `Label`, `Select`, `Dialog`,
`AlertDialog`. Sem badge de status (veículo não tem status, ao
contrário de Contas a Pagar/Receber).

## 5. Modelo de Dados

Tipos TypeScript espelhando `VeiculoDto` e `ClienteDto` da API
(`connectasys_api`):

```ts
type VeiculoApi = {
  id: number;
  clienteId: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
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
  clienteId: string; // value do Select, convertido pra number ao enviar
  placa: string;
  marca: string;
  modelo: string;
  ano: string; // input controlado como texto, convertido pra number ao enviar
  cor: string;
};
```

Não há mock — dado vem sempre da API. `clientes` é buscado com
`useQuery(["clientes"], () => apiFetch<ClienteApi[]>("/api/Clientes"))`
e usado tanto pra montar o `Select` do formulário quanto pra resolver o
nome do cliente na coluna da tabela (`clientes.find(c => c.id ===
veiculo.clienteId)`).

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** `Placa` é normalizada em maiúsculo no próprio
  `onChange` do campo (`.toUpperCase()`) e validada no `submit` contra
  `/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/`, que cobre tanto o padrão antigo
  (`ABC1234`) quanto o Mercosul (`ABC1D23`) — a 5ª posição é o único
  ponto que varia entre os dois formatos (dígito no antigo, letra no
  Mercosul). Regra aplicada só no frontend, pois a API não valida isso
  hoje (ver `VeiculoDto`/`CreateVeiculoCommand`).
- **Decisão:** `Ano` é editado como texto (`type="text"`,
  `inputMode="numeric"`), convertido para `number` só no momento de
  montar o payload — mesmo racional de `Valor` em Contas a Pagar
  (evita fricção do `<input type="number">` nativo).
- **Decisão:** o `Select` de cliente usa o `id` (como string, exigência
  do componente `Select`) como `value`; convertido de volta pra
  `number` ao montar `ClienteId` no payload.
- **Risco:** se a API de Clientes retornar lista vazia, o formulário
  deve bloquear o salvar e mostrar aviso no lugar do `Select` (Cenário
  7 da spec) — não deixar submeter com `clienteId` inválido.
- **Risco:** `VeiculosController.Create`/`Update` retornam
  `400 BadRequest("ClienteId inválido.")` quando o cliente não existe
  — tratado pelo fluxo genérico de erro (`extrairMensagemErro` em
  `api.ts`), sem tratamento especial na tela.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (`https://localhost:7074`), testar
  manualmente em `npm run dev`:
  - Com pelo menos um cliente cadastrado (via Swagger, se não houver
    tela própria ainda): criar veículo escolhendo esse cliente →
    aparece na lista com o nome do cliente certo
  - Editar veículo trocando marca/modelo/ano/cor/cliente → lista
    reflete a mudança
  - Buscar por placa, marca e modelo → filtro funciona
  - Remover veículo → confirma modal, some da lista
  - Desligar a API e tentar criar → toast de erro, sem tela quebrada
  - Base sem nenhum cliente: abrir "Novo veículo" → aviso de "nenhum
    cliente cadastrado", sem permitir salvar
