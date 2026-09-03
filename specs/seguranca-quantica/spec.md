# Especificação: Segurança de Transporte e Postura Pós-Quântica

**Pasta:** `specs/seguranca-quantica/` · **Status:** rascunho
**Data:** 2026-09-03 · **Fase seguinte:** `/planejar seguranca-quantica`

> Feature espelhada na spec equivalente do `connectasys_api`. Nasceu de um
> pedido de revisão de segurança contra ataques quânticos; o levantamento
> mostrou que o frontend não usa nenhuma criptografia própria (delega
> tudo ao transporte HTTPS e ao token emitido pela API), então o foco
> aqui é garantir que a comunicação com a API nunca trafegue sem cifra.

## 1. Visão Geral

O hub hoje se comunica com a API em `http://localhost:5283` — texto puro,
sem TLS. Isso significa que, independente de qualquer discussão sobre
computação quântica, o tráfego entre o navegador e a API pode ser lido
por qualquer um na mesma rede hoje, com hardware comum. Esta feature
garante que o frontend só se comunique com a API por uma conexão cifrada
(HTTPS), condição necessária para que qualquer proteção de transporte —
inclusive contra um futuro ataque quântico de "capturar agora, decifrar
depois" — faça sentido.

## 2. Cenários de Uso

### Cenário 1: Uso normal em produção
- **Dado** o ConnectaSys Hub publicado e um usuário acessando
- **Quando** ele faz login ou qualquer chamada à API (listar/criar/editar
  usuários, etc.)
- **Então** toda a comunicação entre o navegador e a API acontece por uma
  conexão cifrada (HTTPS) — nunca em texto puro

### Cenário 2: Desenvolvimento local
- **Dado** um desenvolvedor rodando o hub e a API na própria máquina
- **Quando** ele testa login ou qualquer tela que chama a API
- **Então** a comunicação também acontece por HTTPS (certificado de
  desenvolvimento local), sem exigir configuração manual complexa

### Cenário 3: Tentativa de interceptação de tráfego
- **Dado** alguém capturando o tráfego de rede entre o navegador e a API
- **Quando** essa pessoa tenta ler o conteúdo capturado
- **Então** o conteúdo está cifrado e ilegível — hoje contra qualquer
  interceptação comum; a resistência a um futuro computador quântico
  passa a depender só da configuração de TLS da hospedagem, não mais da
  ausência total de cifra

## 3. Requisitos Funcionais

- **RF-01:** O frontend deve se comunicar com a API exclusivamente por
  HTTPS, tanto em desenvolvimento local quanto em produção — nunca por
  HTTP puro.
- **RF-02:** Nenhum segredo (chave de API, credencial) pode ser
  hardcoded no código do cliente além do necessário para apontar o
  endereço da API.
- **RF-03:** Se a API rejeitar a conexão por certificado inválido ou
  problema de HTTPS, o usuário deve ver uma mensagem de erro legível, não
  uma tela quebrada.

## 4. Requisitos Não Funcionais

- **RNF-01:** A mudança não pode quebrar o fluxo de desenvolvimento local
  já existente (rodar hub + API localmente sem exigir configuração manual
  de certificado a cada `npm run dev`).
- **RNF-02:** Não é necessário introduzir nenhuma biblioteca de
  criptografia pós-quântica no frontend — o app não guarda nem gera
  nenhuma chave assimétrica própria; toda a superfície criptográfica
  relevante está no transporte (HTTPS) e no backend.

## 5. Fora de Escopo

- Configurar troca de chaves híbrida pós-quântica (ex. X25519+ML-KEM) no
  provedor de hospedagem/CDN de produção do hub — decisão operacional de
  infraestrutura, fora do código deste repositório.
- Trocar onde o token de sessão é guardado (`localStorage`) — é um
  problema de exposição a XSS, não relacionado a ataque quântico; fica
  registrado como achado separado, fora desta feature.
- Qualquer criptografia adicional no cliente (cifrar dados antes de
  enviar, etc.) — não há necessidade identificada; a API já recebe tudo
  sobre um canal cifrado (RF-01).

## 6. Suposições e Perguntas em Aberto

- Suposição: a API local vai expor HTTPS via certificado de
  desenvolvimento do .NET (`dotnet dev-certs https --trust`), então o
  hub local só precisa apontar para `https://localhost:<porta>` em vez
  de `http://localhost:5283`.
- Pergunta em aberto: onde o hub será hospedado em produção? A maioria
  dos provedores de hospedagem de frontend (Vercel, Netlify, Cloudflare
  Pages etc.) já fornece HTTPS por padrão — sem essa definição, o
  `design.md` registra a exigência de forma genérica.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [ ] Suposições/perguntas em aberto foram revisadas com o usuário
