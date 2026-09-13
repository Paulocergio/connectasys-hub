# Especificação: Multitenant (cadastro self-service + trial de 3 dias)

**Pasta:** `specs/multitenant/` · **Status:** implementado
**Data:** 2026-09-13 · **Fase seguinte:** `/planejar multitenant`

> Backend (`connectasys_api`) ganha isolamento completo de dados por
> empresa (tenant) — ver `specs/specs/multitenant/` naquele
> repositório. Esta spec cobre o lado do hub: a aba "Cadastrar
> oficina" em `/auth`, que hoje só mostra "em breve", vira um
> formulário de verdade.

## 1. Visão Geral

Cada oficina que usa o ConnectaSys é isolada das outras — dados de uma
nunca aparecem pra outra, garantido inteiramente pelo backend (nenhuma
tela existente precisa mudar pra isso funcionar, é transparente via
token). O que muda no hub é só a porta de entrada: a aba "Cadastrar
oficina" em `/auth`, que hoje é um texto dizendo "em breve", vira o
formulário real de autocadastro — cria a conta e já loga, com um
período de teste grátis.

> **Revisão 2026-09-13 (correção do usuário):** o teste **não** dura
> 72 horas corridas a partir do horário do cadastro — expira no início
> do 2º dia seguinte ao cadastro, contado por dia calendário
> (cadastrar hoje dia 13 → bloqueado a partir do dia 15). Além disso,
> ao vencer, **todos os dados da empresa são apagados automaticamente
> e sem backup** (não é só um bloqueio de acesso — ver
> `specs/specs/multitenant/spec.md` do `connectasys_api`). Por isso o
> cadastro agora exige aceitar explicitamente um contrato antes de
> enviar o formulário (RF-06).

## 2. Cenários de Uso

### Cenário 1: Cadastrar uma oficina nova
- **Dado** um visitante na aba "Cadastrar oficina" de `/auth`
- **Quando** ele preenche nome da oficina, seu nome, e-mail, telefone
  e senha (com confirmação), e envia
- **Então** a conta é criada, ele é logado automaticamente (sem
  precisar entrar de novo) e vai direto pro `/dashboard`

### Cenário 2: E-mail já cadastrado
- **Dado** o formulário de cadastro
- **Quando** o e-mail informado já pertence a uma conta existente
- **Então** o formulário mostra um erro claro, sem criar nada

### Cenário 3: Senhas não coincidem
- **Dado** o formulário de cadastro
- **Quando** "Senha" e "Confirmar senha" são diferentes
- **Então** o formulário recusa antes mesmo de chamar a API, com
  mensagem clara

### Cenário 4: Login com teste expirado
- **Dado** um usuário de uma empresa cujo teste já passou
- **Quando** ele tenta entrar com email/senha corretos
- **Então** o login é recusado com uma mensagem clara (o mesmo card de
  erro já usado pra "e-mail ou senha inválidos", reaproveitando o
  fluxo genérico de erro do formulário de login — sem tela nova); os
  dados da empresa já foram apagados nesse momento pelo backend, então
  uma segunda tentativa de login (mesmo com a senha certa) recusa como
  credencial inválida — a conta genuinamente não existe mais

### Cenário 5: Tentar cadastrar sem aceitar o contrato
- **Dado** o formulário de cadastro preenchido corretamente
- **Quando** o visitante clica em enviar sem marcar a caixa de aceite
  dos termos
- **Então** o formulário recusa antes mesmo de chamar a API, com
  mensagem pedindo pra aceitar os termos primeiro, e o botão de
  cadastro fica desabilitado até a caixa ser marcada

## 3. Requisitos Funcionais

- **RF-01:** A aba "Cadastrar oficina" tem um formulário real: nome da
  oficina, nome do usuário, e-mail, telefone, senha, confirmar senha.
- **RF-02:** Enviar o formulário com sucesso loga automaticamente
  (mesmo efeito de um login bem-sucedido) e navega pro `/dashboard`.
- **RF-03:** Erros da API (e-mail em uso, etc.) aparecem no mesmo card
  de erro já usado na aba de login.
- **RF-04:** Confirmação de senha é validada no front antes de chamar
  a API.
- **RF-05:** O card de erro do login também cobre o caso de teste
  expirado — sem UI nova, a mensagem que a API manda já é clara o
  suficiente pro card genérico existente.
- **RF-06:** O formulário de cadastro só pode ser enviado depois de
  marcar uma caixa de aceite de um contrato de termos do período de
  teste. Um link abre um modal com o texto completo do contrato,
  explicando em linguagem simples: (a) o prazo exato do teste (exemplo
  de dia calendário), (b) que o acesso é bloqueado automaticamente ao
  vencer, (c) que **todos os dados da oficina são apagados
  permanentemente** nesse momento, de forma **definitiva e sem
  backup**, e (d) que é preciso entrar em contato antes do vencimento
  pra evitar a exclusão. O botão "Entendi e aceito" do modal marca a
  caixa e fecha o modal; o botão de envio do formulário fica desabilitado
  até a caixa estar marcada.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto a chamada à API está em andamento, o botão
  indica carregamento e evita duplo envio (mesmo padrão do login).

## 5. Fora de Escopo

- Qualquer contador/aviso de "faltam X dias de teste" na interface —
  a API devolve `trialExpiraEmUtc` na resposta de login/cadastro
  (guardado na sessão), mas nenhuma tela usa isso ainda.
- Tela de upgrade/pagamento — não existe cobrança automatizada; se o
  teste expirar, a mensagem só orienta a entrar em contato.
- Convite de novos usuários por e-mail — adicionar alguém à equipe
  continua sendo feito por um Admin já logado, na tela de Usuários
  (sem mudança nessa tela).
- Landing page: os textos "14 dias" foram atualizados pra "3 dias"
  nos dois lugares que existiam (botão do hero e seção de CTA final) —
  não é uma feature nova, só consistência com o trial real. (O texto
  segue dizendo "3 dias" como forma coloquial de descrever o prazo —
  a regra exata de vencimento por dia calendário está só no contrato
  do modal, RF-06, e no backend.)
- Contador visual regressivo dos dias restantes de teste dentro do
  contrato/modal — o modal só explica a regra com um exemplo fixo, não
  calcula em tempo real quantos dias faltam pra sessão atual.

## 6. Suposições e Perguntas em Aberto

- Suposição: o formulário de cadastro pede confirmação de senha (a
  API não exige isso, é só validação de UX no front).
- Decidido com o usuário: depois do teste expirar, login é bloqueado
  por completo (não uma versão só-leitura) — ver
  `specs/specs/multitenant/spec.md` do `connectasys_api`.
- Decidido com o usuário (revisão 2026-09-13): a exclusão dos dados ao
  vencer o teste é automática e imediata (não uma ação manual
  posterior), e por isso o cadastro exige aceite explícito de um
  contrato avisando disso — RF-06.
- Decidido com o usuário: o vencimento do teste é contado por dia
  calendário a partir da data do cadastro (+2 dias, não 72h corridas) —
  o modal usa um exemplo concreto (dia 13 → dia 15) em vez de tentar
  explicar a regra em abstrato.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
