# Especificações de Features (SDD)

- `constitution.md` — a constituição do projeto. **Imutável.** Ver regras
  completas de governança nela mesma (Artigo X).
- `<slug>/` — uma pasta por feature (ex.: `landingpage/`), contendo:
  - `spec.md` — o quê e por quê (comando `/especificar`)
  - `design.md` — decisões técnicas (comando `/planejar`)
  - `tasks.md` — lista de tarefas verificáveis (comando `/implementar` executa)

Fluxo completo:

```
/especificar <descrição da feature>   → specs/<slug>/spec.md
/planejar <slug>                       → specs/<slug>/design.md
/tarefas <slug>                        → specs/<slug>/tasks.md
/implementar <slug>                    → código em src/ + tasks.md atualizado
```

Regras completas do fluxo: `constitution.md`, Artigo VII.
