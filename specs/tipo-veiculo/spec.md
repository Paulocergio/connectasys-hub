# Especificação: Tipo de Veículo

**Pasta:** `specs/tipo-veiculo/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar tipo-veiculo`

## 1. Visão Geral

O cadastro de veículo (placa, marca, modelo, ano, cor) não diferencia o
tipo de veículo. Uma oficina atende carro, moto e caminhão, cada um com
implicações diferentes de serviço e peças. O cadastro passa a exigir
escolher o tipo.

## 2. Cenários de Uso

### Cenário 1: Cadastrar veículo com tipo
- **Dado** um usuário preenchendo "Novo veículo"
- **Quando** ele escolhe um dos tipos (Carro, Moto, Caminhão, Outros) e
  salva
- **Então** o veículo é criado com esse tipo

### Cenário 2: Editar o tipo de um veículo existente
- **Dado** um veículo já cadastrado
- **Quando** o usuário troca o tipo e salva
- **Então** a lista reflete o novo tipo

### Cenário 3: Ver o tipo na listagem
- **Dado** a lista de veículos
- **Quando** a tela carrega
- **Então** cada veículo mostra seu tipo numa coluna própria

### Cenário 4: Veículos cadastrados antes da feature
- **Dado** um veículo cadastrado antes de o tipo existir
- **Quando** a feature entra no ar
- **Então** esse veículo aparece com o tipo "Carro" por padrão, sem
  precisar de ação manual

### Cenário 5: Buscar por tipo
- **Dado** a lista de veículos carregada
- **Quando** o usuário digita o nome de um tipo na busca
- **Então** a lista é filtrada incluindo esse critério

## 3. Requisitos Funcionais

- **RF-01:** O formulário de veículo deve exigir a escolha de um dos 4
  tipos fixos (Carro, Moto, Caminhão, Outros), com "Carro" como padrão.
- **RF-02:** A listagem deve mostrar o tipo de cada veículo numa coluna
  própria.
- **RF-03:** A busca da listagem deve considerar o tipo, além de placa,
  marca e modelo.
- **RF-04:** Não deve ser possível gravar um tipo fora da lista fixa,
  nem pela tela nem por chamada direta à API.

## 4. Fora de Escopo

- Filtro dedicado por tipo (só busca por texto).
- Tipos customizados além dos 4 fixos.

## 5. Suposições e Perguntas em Aberto

- Nenhuma — mudança aditiva, sem impacto em dado existente além do
  preenchimento automático do padrão.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
