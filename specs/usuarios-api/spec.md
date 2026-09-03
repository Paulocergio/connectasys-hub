# Especificação: Autenticação e Usuários via API real

**Pasta:** `specs/usuarios-api/` · **Status:** rascunho
**Data:** 2026-09-01 · **Fase seguinte:** `/planejar usuarios-api`

> Primeira feature migrada do mock local pra API real, conforme a emenda
> do Artigo I. Cobre login e o CRUD de usuários.

## 1. Visão Geral

Hoje o login e o cadastro de usuários do ConnectaSys rodam inteiramente
no navegador (dados salvos em `localStorage`, sem backend). Existe agora
uma API real (.NET) rodando localmente, com autenticação e CRUD de
usuários prontos. Esta feature troca a base de login e a tela de
Usuários pra usar essa API de verdade, em vez do mock.

## 2. Cenários de Uso

### Cenário 1: Login válido
- **Dado** um usuário já cadastrado na API
- **Quando** ele entra com e-mail e senha corretos na tela de login
- **Então** ele é autenticado pela API (recebe um token) e é levado pro
  dashboard

### Cenário 2: Login inválido
- **Dado** um usuário que digita e-mail ou senha errados
- **Quando** ele tenta entrar
- **Então** vê uma mensagem de erro clara, sem ser redirecionado

### Cenário 3: Sessão expira ou token é inválido
- **Dado** um usuário logado cujo token não é mais aceito pela API
- **Quando** ele tenta carregar uma tela protegida (dashboard, usuários)
- **Então** é levado de volta pra tela de login

### Cenário 4: Listar usuários
- **Dado** um usuário autenticado na tela de Usuários
- **Quando** a tela carrega
- **Então** vê a lista de usuários vinda da API (nome, e-mail, telefone,
  perfil), não mais dados fictícios

### Cenário 5: Criar usuário
- **Dado** um usuário autenticado preenchendo o formulário "Novo usuário"
- **Quando** ele salva com dados válidos
- **Então** o usuário é criado na API e aparece na lista

### Cenário 6: Editar usuário
- **Dado** um usuário existente sendo editado
- **Quando** os dados são salvos
- **Então** a API é atualizada e a lista reflete a mudança

### Cenário 7: Remover usuário
- **Dado** um usuário existente
- **Quando** a remoção é confirmada
- **Então** ele é removido via API e some da lista

## 3. Requisitos Funcionais

- **RF-01:** O login deve autenticar contra a API real, não mais contra
  dados locais.
- **RF-02:** A sessão autenticada deve ser mantida entre recarregamentos
  de página (o usuário não deve precisar logar de novo a cada F5).
- **RF-03:** Toda rota protegida (dashboard, usuários) deve verificar se
  existe uma sessão válida antes de renderizar.
- **RF-04:** A listagem, criação, edição e remoção de usuários devem
  usar a API real.
- **RF-05:** Erros da API (e-mail duplicado, campos inválidos, falha de
  rede) devem aparecer como mensagem legível pro usuário, não como tela
  quebrada.
- **RF-06:** O conceito de "usuário autorizado/bloqueado" deixa de
  existir na tela de Usuários — a API real não tem esse campo. Todo
  usuário cadastrado pode logar.
- **RF-07:** O cadastro de nova oficina (self-service, hoje na aba
  "Cadastrar oficina" do login) fica **fora do escopo** desta feature —
  ver seção 5.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento (login,
  salvar, remover), a interface deve indicar carregamento — sem permitir
  duplo clique/duplo envio.

## 5. Fora de Escopo

- Cadastro de nova oficina/tenant (aba "Cadastrar oficina") — a API
  disponível hoje não tem um endpoint de registro de tenant, só de
  usuário dentro de uma organização já existente. Fica pendente até
  existir esse endpoint.
- Multitenancy real (a API atual não expõe conceito de "oficina" por
  usuário) — a coluna "Oficina" da tela de Usuários é reavaliada quando
  esse campo existir na API.
- Módulos Dashboard (números), Agenda, Estoque, Financeiro, Ordens —
  continuam mockados; cada um migra em sua própria feature depois.
- Refresh automático de token expirado — se o token expirar, o usuário
  simplesmente é deslogado (RF-03), sem renovação silenciosa.

## 6. Suposições e Perguntas em Aberto

- Suposição: o login devolve um token (JWT) que deve ser enviado nas
  chamadas seguintes — formato exato do retorno confirmado durante o
  design, testando a API diretamente.
- Suposição: os campos `nome`, `email`, `telefone`, `role` da API cobrem
  o que a tela de Usuários precisa mostrar; o campo `senha` só é enviado
  na criação/edição, nunca voltará da API.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
