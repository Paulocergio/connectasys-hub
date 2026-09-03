# Tarefas: {NOME_DA_FEATURE}

**Pasta:** `specs/{slug}/` · **Design:** `specs/{slug}/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar {slug}`

> Cada tarefa deve ser pequena o suficiente para ser concluída e verificada
> isoladamente. Marcar `[x]` somente depois que o critério de pronto for
> checado de fato (lint passando, tela verificada no navegador quando
> aplicável).

- [ ] **T001** — {descrição da tarefa}
  - Arquivo(s): `{caminho}`
  - Critério de pronto: {o que precisa ser verdade para marcar como feita}

- [ ] **T002** — {descrição da tarefa}
  - Arquivo(s): `{caminho}`
  - Depende de: T001
  - Critério de pronto: {...}

- [ ] **T003** — {descrição da tarefa}
  - Arquivo(s): `{caminho}`
  - Critério de pronto: {...}

## Verificação Final

- [ ] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em `npm run dev`
- [ ] Nenhum item da checklist constitucional do design ficou pendente
- [ ] Nenhuma cor Tailwind literal (`orange-500` etc.) foi introduzida fora dos tokens semânticos
