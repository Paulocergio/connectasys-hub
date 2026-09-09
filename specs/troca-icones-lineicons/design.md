# Design: Troca de Ícones para Lineicons

**Pasta:** `specs/troca-icones-lineicons/` · **Spec:** `specs/troca-icones-lineicons/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas troca-icones-lineicons`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (React/TanStack/Tailwind
      inalterados)
- [~] **Dependência nova** — `@lineiconshq/react-lineicons` +
      `@lineiconshq/free-icons`. O Artigo II não lista biblioteca de
      ícones entre as peças fixas da stack (framework, UI, formulários,
      estado, build, gerenciador de pacotes), então não interpretei
      isso como emenda constitucional — mas é uma dependência nova
      real, registrada aqui pra transparência.
- [x] Segue a organização de pastas do Artigo IV (`src/components/icons.tsx`)
- [x] Não introduz cor nova
- [x] Textos de UI em português (não se aplica — mudança é só visual)

## 2. Resumo da Abordagem

`src/components/icons.tsx` (novo) exporta componentes com os mesmos
nomes dos ícones anteriores (`Wrench`, `Users`, `Package`, `Plus` etc.),
cada um envolvendo `<Lineicons icon={X} />`. Isso permite trocar só a
linha de `import` em cada arquivo, sem tocar em nenhum JSX que já
consumia esses ícones.

`src/components/ui/*` (shadcn) continua na biblioteca anterior, de
propósito — não é "ícone do produto", é peça do kit de UI.

## 3. Rotas e Telas

Nenhuma rota nova — mudança em 16 arquivos de rota/componente
existentes.

## 4. Componentes

- `src/components/icons.tsx` (novo): módulo central de mapeamento.

## 5. Modelo de Dados

Não se aplica.

## 6. Dependências Novas

- `@lineiconshq/react-lineicons`
- `@lineiconshq/free-icons`

## 7. Riscos e Decisões

- **Levantamento feito antes de decidir:** a versão gratuita da
  Lineicons (~450 ícones) não cobre tudo que o app usava. Faltam, por
  exemplo, `Wrench` (usado em Ordens de Serviço, a tela mais central do
  sistema), `ChevronRight`, `Package`, `TriangleAlert`, `Contact`,
  `Clock`.
- **Decisão tomada com o usuário:** usar o ícone mais próximo
  disponível em cada caso (ex.: engrenagem no lugar da chave de boca),
  em vez de manter duas bibliotecas ativas ou pagar pela versão Pro. O
  mapeamento completo está documentado como comentário no topo de
  `icons.tsx`.
- **Risco assumido:** algumas aproximações (principalmente
  `Wrench` → engrenagem) mudam a identidade visual de telas centrais do
  sistema — vale confirmação visual do usuário.
- Instalado via `npm` (não `bun`) porque o `bun` não estava disponível
  na máquina usada nesta sessão — consistente com o Artigo II, que já
  define `npm` como gerenciador de pacotes do projeto.

## 8. Estratégia de Verificação

- `npm run lint` e `npm run build` limpos.
- Navegar pelas telas principais (menu lateral, Ordens de Serviço,
  Dashboard, badges de status) e confirmar visualmente que os ícones
  aparecem e fazem sentido.
