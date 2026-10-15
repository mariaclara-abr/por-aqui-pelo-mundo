# Política de ajustes do roteiro Premium

Aprovada em 15/10/2026. Vale para o roteiro completo gerado pela IA (script em `docs/script-roteiro-internacional-oficial.md`), depois de pronto.

## Quanto o Premium inclui

- **3 ajustes com IA por roteiro**, incluídos no preço do roteiro.
- Ao usar os 3, o cliente escolhe entre:
  - **ajustes extras pagos**;
  - **gerar um roteiro novo**, comprando crédito pelos pacotes que já existem (R$ 89,90 por país);
  - ou desistir das alterações.

## Preço dos ajustes extras

| Produto | Preço |
|---|---|
| 3 ajustes extras | R$ 9,90 |
| 6 ajustes extras | R$ 14,90 |

Referência de custo: um ajuste custa de US$ 0,03 a 0,08 na API (R$ 0,15 a 0,45). Mesmo com a taxa do Stripe, a margem é grande.

## O que o cliente pode pedir

### 1. Grátis e ilimitado, sem IA (nenhum token, não conta como ajuste)

- remover uma atração;
- reordenar arrastando, dentro do dia;
- renomear o roteiro;
- marcar um lugar como "já fiz".

### 2. Ajuste com IA (consome 1 dos 3)

Mudanças dentro das cidades, datas e viajantes que já existem no roteiro:

- trocar uma atração por outra do catálogo da mesma cidade;
- adicionar uma atração (a IA reorganiza só aquele dia);
- mover atrações entre dias, ou trocar dois dias de lugar;
- deixar um dia mais leve ou mais cheio (ritmo);
- mudar horário ou foco de um dia ("começar mais tarde", "mais pausa");
- encaixar um compromisso fixo novo (jantar, ingresso comprado);
- informar o hotel escolhido ou trocar o bairro recomendado (a IA replaneja só os dias dessa cidade);
- corrigir horário de voo (a IA replaneja só o dia de chegada, o de voo e o último);
- pedir um lugar que não está no catálogo (entra como "Opcional (fora do roteiro principal)", com no máximo 1 consulta web).

**Limite de cada pedido:** um assunto só, no máximo 1 cidade e 3 dias. Pedidos maiores caem no item 3.

### 3. Fora do escopo (pede roteiro novo ou ajuste pago)

- mudar cidades, países, datas, número de dias, viajantes ou orçamento;
- adicionar uma cidade nova;
- "refazer tudo";
- perguntas gerais de viagem (vão para as perguntas à autora, que já existem no site).

Pedido recusado não consome ajuste.

## Regras técnicas e de proteção

- **Pedido curto:** no máximo 500 caracteres.
- **Sem histórico de conversa:** cada pedido recebe só o estado atual dos dias afetados (e a lista do catálogo da cidade, quando for troca). O custo não cresce com a conversa.
- **Resposta só com os dias alterados** (patch), com teto de tokens. O código aplica e gera o documento de novo.
- **Prévia antes de aplicar:** o cliente vê o antes e o depois, e só gasta o ajuste ao clicar em "Aplicar". Pode descartar a prévia até 2 vezes por roteiro sem custo.
- **Limites por conta:** 1 pedido por minuto e 10 por dia. Até 5 recusas por roteiro.
- **Acesso:** só Premium ativo, e só o dono do roteiro.
- **Contador visível**, por exemplo "2 de 3 ajustes restantes".
- **Registro no banco** dos tokens gastos em cada ajuste, para acompanhar o custo real.
- **Correção de erro da própria IA** (atração fechada no dia, horário conflitante) não consome ajuste, com limite de 2 por roteiro.
- **Sem pesquisa web** nos ajustes, exceto 1 consulta quando o cliente pede um lugar fora do catálogo.

## Situação atual do código

O chat atual ([app/api/itinerary-chat/route.ts](../app/api/itinerary-chat/route.ts) e `lib/itinerary-chat.ts`) não tem limite de ajustes, e a checagem de Premium continua como pendência no código. Na construção do fluxo Premium, ele é substituído por este desenho: as ações do item 1 viram botões grátis, e a IA passa a fazer só o item 2.
