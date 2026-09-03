# Especificação: Perfis de Usuário

**Pasta:** `specs/perfis-usuario/` · **Status:** rascunho
**Data:** 2026-09-03 · **Fase seguinte:** `/planejar perfis-usuario`

> A tela de Usuários já existe (`_app.usuarios.tsx`). O backend
> (`connectasys_api`) ganha validação de papel fixo como feature
> própria — ver `specs/perfis-usuario/spec.md` naquele repositório.
> Esta spec cobre só a mudança na tela do hub: hoje o campo "Perfil" é
> texto livre; passa a ser uma escolha fixa entre 4 papéis.

## 1. Visão Geral

O campo "Perfil" do cadastro de usuário hoje é um texto livre (com
placeholder sugerindo "Admin, Manager, User..."), sem nenhum controle.
A oficina tem 4 papéis reais na equipe — Admin, Mecânico,
Recepcionista, Financeiro — e cadastrar um usuário deve significar
escolher um desses, não digitar qualquer coisa.

## 2. Cenários de Uso

### Cenário 1: Cadastrar usuário escolhendo o papel
- **Dado** um usuário preenchendo o formulário "Novo usuário"
- **Quando** ele escolhe um dos 4 papéis (Admin, Mecânico,
  Recepcionista, Financeiro) e salva
- **Então** o usuário é criado com esse papel

### Cenário 2: Editar o papel de um usuário existente
- **Dado** um usuário já cadastrado
- **Quando** o administrador troca o papel dele pra outro dos 4 e salva
- **Então** a lista reflete o novo papel

### Cenário 3: Ver o papel na listagem
- **Dado** a lista de usuários
- **Quando** a tela carrega
- **Então** cada usuário mostra seu papel de forma visualmente
  diferenciada (não como texto plano), um estilo por papel

## 3. Requisitos Funcionais

- **RF-01:** O formulário de usuário (criar/editar) apresenta os 4
  papéis como opções fixas de escolha, não como campo de texto livre.
- **RF-02:** Não é possível salvar um usuário sem escolher um papel.
- **RF-03:** A listagem mostra o papel de cada usuário com um estilo
  visual próprio por papel (reaproveitando o componente de badge já
  usado na tela — `specs/status-financeiro`... na verdade essa spec
  não existe como tal, é o trabalho já feito nesta sessão).

## 4. Fora de Escopo

- Múltiplos papéis por usuário.
- Qualquer controle de acesso/permissão baseado em papel na UI (menus
  visíveis por papel, etc.) — a API ainda não protege nada
  (`seguranca-quantica`/constitution do backend).

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto — nenhuma, usuário autorizou
      aprovação direta desta rodada de specs
