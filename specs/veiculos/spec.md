# Especificação: Veículos

**Pasta:** `specs/veiculos/` · **Status:** rascunho
**Data:** 2026-09-04 · **Fase seguinte:** `/planejar veiculos`

> Módulo de Estoque/Clientes migrado do mock pra API real (Artigo I). O
> backend (`connectasys_api`) já tem o CRUD completo de Veículos e de
> Clientes. Esta spec cobre só a tela do hub que lista e cadastra
> veículos.

## 1. Visão Geral

A oficina cadastra os veículos de cada cliente para poder abrir ordens
de serviço, histórico de manutenção etc. Hoje não existe nenhuma tela
pra isso no hub. Esta feature cria a tela de Veículos, consumindo a
API real já pronta (`/api/Veiculos`), com o veículo sempre vinculado a
um cliente já cadastrado (`/api/Clientes`).

## 2. Cenários de Uso

### Cenário 1: Listar veículos
- **Dado** um usuário autenticado na tela de Veículos
- **Quando** a tela carrega
- **Então** ele vê a lista de veículos (placa, marca, modelo, ano, cor
  e nome do cliente dono), vinda da API

### Cenário 2: Cadastrar veículo
- **Dado** um usuário preenchendo o formulário "Novo veículo"
- **Quando** ele seleciona um cliente já cadastrado e informa placa,
  marca, modelo, ano e cor, e salva
- **Então** o veículo é criado na API e aparece na lista

### Cenário 3: Editar veículo
- **Dado** um veículo existente
- **Quando** o usuário altera cliente, placa, marca, modelo, ano ou cor
  e salva
- **Então** a lista reflete a mudança

### Cenário 4: Remover veículo
- **Dado** um veículo existente
- **Quando** o usuário confirma a remoção
- **Então** ele é removido via API e some da lista

### Cenário 5: Buscar veículo
- **Dado** a lista de veículos carregada
- **Quando** o usuário digita na busca
- **Então** a lista é filtrada por placa, marca ou modelo

### Cenário 6: Erro da API
- **Dado** qualquer ação (criar/editar/remover) que falhe na API
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível (toast), sem tela quebrada
  e sem entrada fantasma na lista

### Cenário 7: Nenhum cliente cadastrado
- **Dado** a base ainda não tem nenhum cliente cadastrado
- **Quando** o usuário abre o formulário "Novo veículo"
- **Então** o campo de cliente indica que não há clientes disponíveis,
  e o formulário não permite salvar sem um cliente selecionado

## 3. Requisitos Funcionais

- **RF-01:** A tela deve listar os veículos vindos da API real,
  mostrando placa, marca, modelo, ano, cor e o nome do cliente dono.
- **RF-02:** O usuário deve poder cadastrar um novo veículo, escolhendo
  o cliente dono a partir dos clientes já cadastrados.
- **RF-03:** O usuário deve poder editar um veículo existente,
  incluindo trocar o cliente vinculado.
- **RF-04:** O usuário deve poder remover um veículo, com confirmação
  antes de efetivar.
- **RF-05:** O usuário deve poder buscar/filtrar a lista por placa,
  marca ou modelo.
- **RF-06:** A tela deve ter uma entrada própria no menu de navegação
  lateral do app.
- **RF-07:** O campo de placa deve aceitar apenas os dois padrões
  vigentes no Brasil — antigo (3 letras + 4 números, ex.: `ABC1234`) ou
  Mercosul (3 letras + 1 número + 1 letra + 2 números, ex.: `ABC1D23`)
  — e ser sempre armazenado/exibido em maiúsculo, independente de como
  o usuário digitou.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento (salvar,
  remover), a interface indica carregamento e evita duplo envio.

## 5. Fora de Escopo

- Cadastro/edição/remoção de clientes — feature própria, futura (a API
  já tem o CRUD pronto; esta tela só consome a lista de clientes para
  o vínculo do veículo).
- Histórico de manutenção, ordens de serviço vinculadas ao veículo —
  não existe na API hoje.

## 6. Suposições e Perguntas em Aberto

- Suposição: a rota da tela segue o padrão já usado
  (`_app.veiculos.tsx`), consistente com `_app.contas-a-pagar.tsx` e
  `_app.usuarios.tsx`.
- Suposição: o campo de cliente no formulário lista todos os clientes
  cadastrados (sem paginação/busca própria) — aceitável para o volume
  atual da base; se a lista de clientes crescer muito, isso pode
  precisar de busca no próprio select (fora de escopo aqui).

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
