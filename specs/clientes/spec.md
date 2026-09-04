# Especificação: Clientes

**Pasta:** `specs/clientes/` · **Status:** rascunho
**Data:** 2026-09-04 · **Fase seguinte:** `/planejar clientes`

> Módulo de Clientes migrado do mock pra API real (Artigo I). O
> backend (`connectasys_api`) já tem o CRUD completo, incluindo os
> campos de documento (CPF/CNPJ) e endereço (ver
> `specs/specs/clientes-documento/` naquele repositório). Esta spec
> cobre a tela do hub, incluindo o preenchimento automático de
> endereço/razão social a partir do documento informado.

## 1. Visão Geral

A oficina precisa cadastrar os clientes donos dos veículos atendidos.
Hoje a tela de Veículos já depende de uma lista de clientes vinda da
API (`/api/Clientes`), mas não existe nenhuma tela para cadastrar,
editar ou remover clientes — o cadastro só é possível hoje via
Swagger. Esta feature cria a tela de Clientes, com um diferencial:
como o documento do cliente pode ser CPF (pessoa física) ou CNPJ
(pessoa jurídica), a tela detecta automaticamente qual é qual pelo
tamanho do número digitado e preenche o resto do cadastro sozinha
sempre que possível.

## 2. Cenários de Uso

### Cenário 1: Listar clientes
- **Dado** um usuário autenticado na tela de Clientes
- **Quando** a tela carrega
- **Então** ele vê a lista de clientes (nome, documento, telefone,
  email, cidade/UF), vinda da API

### Cenário 2: Cadastrar cliente pessoa jurídica (CNPJ)
- **Dado** um usuário preenchendo o formulário "Novo cliente"
- **Quando** ele digita um CNPJ (14 dígitos) no campo de documento
- **Então** o sistema identifica que é um CNPJ, consulta os dados
  públicos da empresa e preenche automaticamente razão social,
  endereço (logradouro, bairro, município, UF, CEP) e telefone —
  o usuário só precisa completar nome (de contato) e email antes de
  salvar

### Cenário 3: Cadastrar cliente pessoa física (CPF)
- **Dado** um usuário preenchendo o formulário "Novo cliente"
- **Quando** ele digita um CPF (11 dígitos) no campo de documento e em
  seguida um CEP
- **Então** o sistema identifica que é um CPF e, a partir do CEP,
  preenche automaticamente logradouro, bairro, município e UF — o
  usuário completa nome, email, telefone e salva

### Cenário 4: Documento ou CEP não encontrado
- **Dado** um CNPJ ou CEP que a consulta externa não reconhece
- **Quando** a consulta retorna "não encontrado"
- **Então** o usuário vê um aviso (toast) e pode preencher os campos
  de endereço manualmente — o cadastro não fica bloqueado

### Cenário 5: Editar cliente
- **Dado** um cliente existente
- **Quando** o usuário altera qualquer campo (inclusive documento) e
  salva
- **Então** a lista reflete a mudança

### Cenário 6: Remover cliente
- **Dado** um cliente existente
- **Quando** o usuário confirma a remoção
- **Então** ele é removido via API e some da lista

### Cenário 7: Buscar cliente
- **Dado** a lista de clientes carregada
- **Quando** o usuário digita na busca
- **Então** a lista é filtrada por nome, documento ou email

### Cenário 8: Erro da API
- **Dado** qualquer ação (criar/editar/remover) que falhe na API do
  ConnectaSys
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível (toast), sem tela
  quebrada e sem entrada fantasma na lista

## 3. Requisitos Funcionais

- **RF-01:** A tela deve listar os clientes vindos da API real,
  mostrando nome, documento (CPF ou CNPJ, formatado), telefone, email
  e cidade/UF.
- **RF-02:** O usuário deve poder cadastrar um novo cliente informando
  nome, email, telefone e, opcionalmente, um documento (CPF ou CNPJ).
- **RF-03:** Ao digitar um documento de 14 dígitos, a tela identifica
  CNPJ e consulta automaticamente os dados públicos da empresa,
  preenchendo razão social, endereço e telefone.
- **RF-04:** Ao digitar um documento de 11 dígitos, a tela identifica
  CPF; o usuário informa o CEP separadamente e a tela preenche
  automaticamente o endereço a partir dele.
- **RF-05:** Os campos preenchidos automaticamente continuam editáveis
  — o preenchimento automático é um atalho, não uma trava.
- **RF-06:** O usuário deve poder editar um cliente existente,
  incluindo repetir o fluxo de preenchimento automático.
- **RF-07:** O usuário deve poder remover um cliente, com confirmação
  antes de efetivar.
- **RF-08:** O usuário deve poder buscar/filtrar a lista por nome,
  documento ou email.
- **RF-09:** A tela deve ter uma entrada própria no menu de navegação
  lateral do app.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma consulta de CNPJ/CEP ou uma chamada de
  salvar/remover está em andamento, a interface indica carregamento e
  evita duplo envio.
- **RNF-02:** Uma falha na consulta externa de CNPJ/CEP nunca impede o
  cadastro manual — é sempre um atalho best-effort.

## 5. Fora de Escopo

- Validação de dígito verificador de CPF/CNPJ — a API não valida isso
  hoje (ver `specs/specs/clientes-documento/spec.md` no
  `connectasys_api`), então a tela também não.
- Campo de número/complemento do endereço — não existe na API hoje.
- Múltiplos contatos/endereços por cliente.
- Vínculo direto entre a tela de Clientes e a tela de Veículos (ex.:
  criar veículo direto da tela de cliente) — cada tela continua
  independente.

## 6. Suposições e Perguntas em Aberto

- Suposição: a consulta de CNPJ usa a BrasilAPI
  (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`) e a consulta de CEP
  usa o ViaCEP (`https://viacep.com.br/ws/{cep}/json/`), ambas
  públicas e sem autenticação, chamadas direto do navegador (não
  passam pela API do ConnectaSys).
- Suposição: a detecção de CPF vs. CNPJ é só pela quantidade de
  dígitos do documento (11 ou 14) — não há alternância manual entre
  "pessoa física"/"pessoa jurídica" na interface.
- Suposição: a rota da tela segue o padrão já usado
  (`_app.clientes.tsx`).

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
