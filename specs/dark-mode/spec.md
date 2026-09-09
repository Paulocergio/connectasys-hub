# Especificação: Dark Mode com Persistência

**Pasta:** `specs/dark-mode/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar dark-mode`

> O toggle de tema claro/escuro e os tokens de cor de cada tema já
> existiam (`src/lib/tema.ts`, `.light` em `styles.css`). Esta feature
> cobre só a persistência da escolha entre sessões/dispositivos.

## 1. Visão Geral

O usuário pode trocar entre tema claro e escuro pelo menu lateral, mas
a escolha só ficava salva no navegador atual (`localStorage`). Ao
logar em outro navegador ou dispositivo, o tema voltava ao padrão. A
preferência deve ficar salva no cadastro do usuário e valer em
qualquer lugar em que ele logue.

## 2. Cenários de Uso

### Cenário 1: Trocar de tema
- **Dado** um usuário logado na área interna
- **Quando** ele clica no botão de trocar tema no menu lateral
- **Então** a tela muda de tema imediatamente e a escolha é salva pro
  usuário

### Cenário 2: Persistência entre sessões
- **Dado** um usuário que já trocou de tema antes
- **Quando** ele faz logout e loga de novo (mesmo navegador ou outro)
- **Então** o tema volta exatamente como ele deixou

### Cenário 3: Usuário sem preferência salva
- **Dado** um usuário cadastrado antes desta feature existir
- **Quando** ele loga pela primeira vez depois da mudança
- **Então** ele vê o tema padrão (claro), sem erro

### Cenário 4: Falha ao salvar a preferência
- **Dado** um usuário trocando de tema
- **Quando** a chamada de salvar a preferência falha (rede, API fora)
- **Então** a tela troca de tema normalmente mesmo assim — só a
  persistência pro próximo login é que fica pendente, sem travar a
  interface nem mostrar erro bloqueante

## 3. Requisitos Funcionais

- **RF-01:** O usuário deve poder alternar entre tema claro e escuro a
  qualquer momento dentro da área logada.
- **RF-02:** A escolha de tema deve ser salva associada ao usuário, não
  ao navegador.
- **RF-03:** No login, o tema salvo do usuário deve ser aplicado
  automaticamente, sem precisar trocar de novo manualmente.
- **RF-04:** Landing page e tela de login não são afetadas — continuam
  com tema fixo, por não fazerem parte da área logada.

## 4. Requisitos Não Funcionais

- **RNF-01:** Salvar a preferência não pode bloquear a troca visual do
  tema — a tela responde ao clique antes de a chamada de rede
  terminar.

## 5. Fora de Escopo

- Tema "automático" seguindo a configuração do sistema operacional.
- Temas customizados além de claro/escuro.

## 6. Suposições e Perguntas em Aberto

- Suposição: usuários cadastrados antes da feature recebem o tema
  claro como padrão, sem precisar de ação manual.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
