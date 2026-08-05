# Por Aqui Pelo Mundo — contexto do projeto

## O que é
Plataforma de planejamento de viagens baseada em curadoria humana (não em avaliações de multidão como TripAdvisor, nem em roteiros genéricos gerados por IA). O conteúdo vem da experiência real de quem visitou cada lugar. A IA (quando existir, em fase futura) organiza a curadoria existente, nunca inventa lugares ou roteiros do zero.

Público-alvo: famílias e casais que quantidade priorizam qualidade de planejamento.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (banco de dados, storage de fotos, e futuramente autenticação)

## Estrutura de dados
Hierarquia: País > Cidade > Atração. Atrações têm categoria (ponto turístico, restaurante, hotel, museu, natureza, compras, passeio, café, outro) e etiquetas (ex: ideal para famílias, crianças pequenas, alta temporada, gratuito, imperdível, reserva necessária, etc). Cada atração tem uma nota de curadoria própria de 1 a 5 estrelas (não é média de usuários).

## Identidade visual — "Diário de bordo"
Tom editorial, atemporal, com cara de revista de viagem bem cuidada. Não deve parecer um site genérico de IA nem um app estilo TripAdvisor.

Paleta de cores:
- Terracota (cor de destaque / ações principais): #C1653A
- Verde oliva profundo (cor secundária / textos de apoio, etiquetas): #4A5D43
- Areia (fundo principal, cards): #F0E6D2
- Tinta escura (texto principal): #2B2620
- Branco (fundos alternativos): #FFFFFF

Tipografia:
- Títulos e nomes de atrações: fonte serifada editorial (ex: "Fraunces", "Playfair Display" ou "Lora" via Google Fonts)
- Corpo de texto, botões, filtros, navegação: fonte sans-serif neutra e legível (ex: "Inter" ou "Work Sans")

Princípios visuais:
- Bastante espaço em branco, sem poluição visual
- Fotos grandes e de qualidade como protagonistas (não o texto)
- Cantos arredondados suaves (8-12px) em cards, nada muito quadrado nem muito bolha
- Sem gradientes, sombras pesadas ou elementos "estilo IA genérica"
- Estrelas de avaliação da curadoria em terracota, nunca em amarelo/dourado genérico de review de app
- Mobile-first sempre — a maioria dos usuários vai acessar pelo celular durante a viagem

## Regras gerais
- Nunca inventar dados de atrações, avaliações ou dicas — todo conteúdo vem da curadoria cadastrada no banco.
- Sempre construir mobile-first.
- Seguir a paleta e tipografia acima em toda nova página ou componente, sem introduzir cores fora dela sem perguntar.
- Ao criar componentes de UI, reutilizar componentes já existentes em vez de duplicar estilos.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
