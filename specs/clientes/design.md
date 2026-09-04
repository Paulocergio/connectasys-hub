# Design: Clientes

**Pasta:** `specs/clientes/` · **Spec:** `specs/clientes/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas clientes`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Router, React 19,
      Tailwind v4, shadcn/ui, TanStack Query) — mesmo padrão de
      `_app.veiculos.tsx`
- [x] Nenhuma dependência nova — consultas a BrasilAPI/ViaCEP usam
      `fetch` nativo, sem SDK/cliente HTTP extra
- [x] Segue a organização de pastas do Artigo IV
- [x] Todas as cores usam os tokens semânticos do Artigo V
- [x] Dados mockados isolados — não aplicável, tela consome API real
      diretamente
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.clientes.tsx`, réplica do padrão já usado em
`_app.veiculos.tsx`: tabela + busca, modal (`Dialog`) de criar/editar,
`AlertDialog` de confirmação de remoção, dados via `useQuery`/
`useMutation` chamando `apiFetch` (`src/lib/api.ts`) em
`/api/Clientes`.

O diferencial é o campo "Documento": um único `Input` onde o usuário
digita CPF ou CNPJ (só dígitos). O tamanho do valor decide o tipo:

- 14 dígitos → CNPJ. Dispara `fetch` direto pra
  `https://brasilapi.com.br/api/cnpj/v1/{cnpj}` (sem passar por
  `apiFetch`, que é só pra API do ConnectaSys). Resposta preenche
  `razaoSocial`, `logradouro`, `bairro`, `municipio`, `uf`, `cep` e
  `telefone` (de `ddd_telefone_1`) no formulário.
- 11 dígitos → CPF. Não dispara nada sozinho — o usuário digita o CEP
  num campo separado, que ao atingir 8 dígitos dispara `fetch` pra
  `https://viacep.com.br/ws/{cep}/json/`, preenchendo `logradouro`,
  `bairro`, `municipio` (campo `localidade` na resposta) e `uf`.
- Qualquer outro tamanho → nem CPF nem CNPJ reconhecido ainda; nenhuma
  consulta é feita, campos de endereço continuam manuais.

Entrada nova no menu lateral (`_app.tsx`, array `itens`), antes de
Veículos (ordem lógica: cliente existe antes do veículo dele).

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/clientes` | `src/routes/_app.clientes.tsx` | Nova | Lista + CRUD de clientes, com autofill de CNPJ/CEP |

## 4. Componentes

Nenhum componente novo — tudo na própria rota, usando primitivas de
`src/components/ui`: `Button`, `Input`, `Label`, `Dialog`,
`AlertDialog`.

## 5. Modelo de Dados

```ts
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
  documento: string; // só dígitos; length decide cpf (11) vs cnpj (14)
  razaoSocial: string;
  cep: string;
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
};
```

Ao montar o payload de `POST`/`PUT`, `documento` (só dígitos) vira
`cpf` quando tem 11 caracteres, `cnpj` quando tem 14, ou os dois `""`
→ `null` em qualquer outro caso (documento incompleto/vazio não é
enviado como CPF nem CNPJ).

### Respostas externas usadas (só os campos que interessam)

```ts
// BrasilAPI: GET /api/cnpj/v1/{cnpj}
type BrasilApiCnpj = {
  razao_social: string;
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
};

// ViaCEP: GET /ws/{cep}/json/
type ViaCepEndereco = {
  logradouro: string;
  bairro: string;
  localidade: string; // vira "municipio" no Form
  uf: string;
  erro?: boolean; // true quando o CEP não existe
};
```

Não há mock — dado vem sempre da API/consultas externas.

## 6. Dependências Novas

Nenhuma — `fetch` nativo do browser.

## 7. Riscos e Decisões

- **Decisão:** o campo "Documento" é sempre digitado como texto livre
  (`inputMode="numeric"`), com máscara mínima (só filtra não-dígitos
  no `onChange`) — sem biblioteca de máscara, consistente com "nenhuma
  dependência nova".
- **Decisão:** a consulta de CNPJ/CEP dispara no próprio `onChange`
  (não no `onBlur`) assim que a contagem de dígitos bate 14 (CNPJ) ou
  8 (CEP) — dispara exatamente uma vez nesse ponto, tanto digitando
  quanto colando. A primeira versão disparava só no `onBlur`, o que
  não funcionava ao colar um documento com máscara (`17.184.037/0001-
  10`): o atributo `maxLength` do `<input>` conta caracteres brutos
  (incluindo pontuação), então colar um valor mascarado já cortava o
  texto antes do `onChange` conseguir extrair os dígitos. Correção:
  `maxLength` generoso (18 pro documento, 9 pro CEP — cabe o texto
  mascarado inteiro) e a extração/corte pros 14 ou 8 dígitos reais
  acontece em código (`apenasDigitos(...).slice(0, n)`), não pelo
  `maxLength` do input.
- **Decisão:** `RazaoSocial` só aparece no formulário quando o
  documento tem 14 dígitos (CNPJ) — pessoa física não tem razão
  social.
- **Risco:** BrasilAPI e ViaCEP são serviços públicos de terceiros,
  sem SLA garantido — RNF-02 cobre isso (falha nunca bloqueia o
  cadastro manual). Timeout do `fetch` não é tratado explicitamente
  (aceitável pro volume de uso da oficina); erro de rede cai no mesmo
  toast de "não encontrado".
- **Risco:** `ddd_telefone_1` da BrasilAPI pode vir vazio para algumas
  empresas — nesse caso o campo Telefone simplesmente não é
  sobrescrito, o usuário preenche manualmente.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (`https://localhost:7074`), testar
  manualmente em `npm run dev`:
  - Digitar um CNPJ válido conhecido → razão social e endereço
    preenchidos
  - Digitar um CNPJ inexistente (ex.: `00000000000000`) → toast de
    aviso, formulário continua editável
  - Digitar um CPF (11 dígitos) + CEP válido → endereço preenchido,
    sem razão social no formulário
  - Digitar um CEP inexistente → toast de aviso
  - Editar cliente existente, trocar o documento → autofill dispara de
    novo
  - Buscar por nome, documento e email → filtro funciona
  - Remover cliente → confirma modal, some da lista
  - Desligar a API do ConnectaSys (mantendo internet) e tentar criar →
    toast de erro da API, sem tela quebrada
