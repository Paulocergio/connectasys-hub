# Tarefas: Troca de Ícones para Lineicons

**Pasta:** `specs/troca-icones-lineicons/` · **Design:** `specs/troca-icones-lineicons/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Levantar o catálogo real da versão gratuita da
      Lineicons e mapear cada ícone usado no app pro equivalente mais
      próximo
  - Arquivo(s): nenhum (pesquisa)
  - Critério de pronto: mapeamento completo revisado com o usuário

- [x] **T002** — Instalar os pacotes e criar o módulo central de ícones
  - Arquivo(s): `package.json`, `src/components/icons.tsx`
  - Depende de: T001
  - Critério de pronto: todos os ícones usados no app exportados com o
    nome antigo

- [x] **T003** — Trocar o import em todas as telas do produto
  - Arquivo(s): 16 arquivos de rota/componente
  - Depende de: T002
  - Critério de pronto: nenhuma tela do produto importa da biblioteca
    anterior diretamente

## Verificação Final

- [x] `npx tsc --noEmit` e `npm run build` sem erros novos
- [x] Erro cosmético de dev server ("Failed to resolve entry") investigado
      e resolvido (reinício do processo, não era bug do pacote)
- [ ] Confirmação visual do usuário, especialmente as aproximações
      (Wrench → engrenagem) — pendente
