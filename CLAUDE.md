# Por Aqui Pelo Mundo: contexto do projeto

## O que é
Plataforma de planejamento de viagens baseada em curadoria humana (não em avaliações de multidão como TripAdvisor, nem em roteiros genéricos gerados por IA). O conteúdo vem da experiência real de quem visitou cada lugar. A IA (quando existir, em fase futura) organiza a curadoria existente, nunca inventa lugares ou roteiros do zero.

Público-alvo: famílias e casais que quantidade priorizam qualidade de planejamento.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (banco de dados, storage de fotos, e futuramente autenticação)

## Estrutura de dados
Hierarquia: País > Cidade > Atração. Atrações têm categoria (ponto turístico, restaurante, hotel, museu, natureza, compras, passeio, café, outro) e etiquetas (ex: ideal para famílias, crianças pequenas, alta temporada, gratuito, imperdível, reserva recomendada, etc). Cada atração tem uma nota de curadoria própria de 1 a 5 estrelas (não é média de usuários).

## Identidade visual: "Diário de bordo"
Tom editorial, atemporal, com cara de revista de viagem bem cuidada. Não deve parecer um site genérico de IA nem um app estilo TripAdvisor.

Paleta de cores:
- Terracota (cor de destaque / ações principais): #C1653A
- Verde oliva profundo (cor secundária / textos de apoio, etiquetas): #4A5D43
- Areia (fundo principal, cards): #F0E6D2
- Tinta escura (texto principal): #2B2620
- Branco (fundos alternativos): #FFFFFF

Tipografia:
- Títulos e nomes de atrações: sempre a fonte "Lora" (Google Fonts), em itálico, igual ao título "Rejane Abrantes" da home (o itálico vem de `h1` a `h6` no `app/globals.css`). É a fonte padrão de todos os títulos do site: usar `font-serif` (que aponta para a Lora no `tailwind.config.ts`). Não introduzir outra fonte serifada.
- Corpo de texto, botões, filtros, navegação: fonte sans-serif neutra e legível (ex: "Inter" ou "Work Sans")

Princípios visuais:
- Bastante espaço em branco, sem poluição visual
- Fotos grandes e de qualidade como protagonistas (não o texto)
- Cantos arredondados suaves (8-12px) em cards, nada muito quadrado nem muito bolha
- Sem gradientes, sombras pesadas ou elementos "estilo IA genérica"
- Estrelas de avaliação da curadoria em terracota, nunca em amarelo/dourado genérico de review de app
- Mobile-first sempre: a maioria dos usuários vai acessar pelo celular durante a viagem

## Regras gerais
- Nunca inventar dados de atrações, avaliações ou dicas: todo conteúdo vem da curadoria cadastrada no banco.
- Sempre construir mobile-first.
- Seguir a paleta e tipografia acima em toda nova página ou componente, sem introduzir cores fora dela sem perguntar.
- Ao criar componentes de UI, reutilizar componentes já existentes em vez de duplicar estilos.
- Proibido o uso de travessões (—) em qualquer texto do projeto (código, copy da interface, conteúdo do banco, documentação). Use dois pontos, vírgula ou ponto final no lugar.
- Toda imagem de conteúdo real (fotos de atrações, capas de país/cidade, fotos de viagem, fotos de roteiro) deve usar alt text descritivo (ex: nome da atração, da cidade, do país ou legenda da foto), nunca `alt=""`. `alt=""` só é permitido em imagens puramente decorativas (ícones, texturas de fundo) ou quando o mesmo texto já aparece visível ao lado da imagem (ex: nome do lugar num card, evitando leitor de tela anunciar duas vezes).

## Botões
Todo botão e link com cara de botão do site segue o mesmo estilo "diário de bordo": contorno fino de 1px, cantos de 8px (`rounded-lg`), fundo transparente, letra pequena (11px), leve (`font-light`), em caixa alta e com bastante espaço entre as letras (`tracking-[0.28em]`). Sem seta, sem sombra, sem preenchimento sólido (o preenchimento só aparece no hover, ou no estado ativo de filtros).
- Usar sempre as classes de `app/globals.css`: `btn` mais uma cor: `btn-terracota` (padrão), `btn-oliva` (ações secundárias e filtros) ou `btn-claro` (sobre foto ou fundo escuro: hero, faixas oliva/terracota). `btn-sm` para botões pequenos (filtros, ações dentro de cards).
- `btn-cheio` (junto com a cor) deixa o botão "recheado" e esvazia no hover. Usar nas chamadas principais que precisam chamar atenção (cards de afiliados como o do seguro viagem, enviar formulário, CTA de faixa). Ações secundárias ficam só no contorno.
- A cor pode variar conforme o fundo, mas traço, formato e letra não mudam. Não recriar o estilo com classes soltas.
- Filtro/aba ativo: `border-terracota bg-terracota text-white` por cima do `btn` (ver `PillButton`).
- Fora do padrão: botões só de ícone (menu, busca, mala, carrossel), links de texto e etiquetas/selos.

## Cards de fotos (destinos, países, estados, cidades e atrações)
Todo card de foto do site segue o mesmo formato: cantos retos (sem `rounded`), sem contorno (sem `border`) e sem sombra, proporção 4:3. O padrão vale para a home, países, estados, cidades, atrações e carrosséis de relacionados.
- Espaçamento entre os cards: `gap-5` no celular e `sm:gap-6` a partir de tablet. Em grades com texto abaixo da foto (atrações), `gap-x-5 sm:gap-x-6 gap-y-8`. Carrosséis usam o mesmo `gap-5 sm:gap-6`.
- No hover, além do leve zoom, a foto ganha um contorno branco fino interno (classe `foto-contorno` em `app/globals.css`, num `div` dentro do card com `group`). Todo card de foto novo deve ter.
- Reutilizar `DestinationCard` (países, estados, cidades) e `AttractionCard`; os cards "em breve" seguem o mesmo formato. Não criar variações com cantos arredondados ou borda.

## Fotos (limites da Vercel e do Supabase)
Em 14/10/2026 a cota de Image Optimization da Vercel (Hobby, 5 mil imagens por mês) estourou e as fotos quebraram. O processo fixo desde então:
- `images.unoptimized: true` em `next.config.ts`: as fotos vão direto do Supabase Storage, sem passar pelo otimizador da Vercel. Não remover sem trocar de plano.
- Em 31/10/2026 a cota de Egress do Supabase (Free, 5,5 GB) estourou e tudo (Storage, API REST, supabase-js) ficou bloqueado até 04/11. Só a conexão direta ao Postgres (`npm run sql`) e o dashboard continuam funcionando. Causa: fotos com `Cache-Control: max-age=3600`. Para não repetir:
  - Todo upload ao Storage leva `cacheControl: "31536000"` (os caminhos têm UUID, então é seguro). Nunca enviar sem isso.
  - O cabeçalho que o CDN entrega é o gravado no momento do upload. Atualizar `storage.objects.metadata` por SQL NÃO muda isso (testado em 05/11/2026: originais seguiram com `max-age=3600`). Reenviar a foto antiga com `cacheControl` (upsert ou remover e enviar de novo) também não mudou o cabeçalho nos testes; só uploads em caminho novo (ex: `thumbs/`) saem com cache de 1 ano. As originais antigas ficam com 1 hora até irem para o R2. Confira sempre com `curl -s -D - -o /dev/null <url>`.
  - Cartões e grades usam miniaturas de 800px em `media/thumbs/<mesmo caminho>` via `thumbUrl()` (`lib/thumb.ts`), só ativas com `NEXT_PUBLIC_USE_THUMBS=1`. Os uploaders já criam a miniatura; fotos antigas dependem de `scripts/make-thumbs.mjs --apply`. Nunca ligar a flag antes de rodar o script.
  - Nunca incluir foto acima de ~300 KB em página de listagem; manter a redução de 1600px/q82 e rodar `shrink-photos.mjs` nas fotos grandes (o script ainda ignora `.heic`).
  - Antes de qualquer carga em lote que baixe fotos (scripts, auditorias), lembrar que download conta como egress.
  - Ao sinal de 80% da cota (dashboard Supabase > Usage), avisar o usuário; opção final é upgrade para o Pro.
- Como a Vercel não reduz mais as fotos, **toda foto precisa ser reduzida antes de ir para o bucket `media`**: lado maior de no máximo 1600px (sem ampliar) e JPEG com qualidade 82 (PNG, WebP e HEIC viram JPEG). Se a versão reduzida não ficar menor que o original, mantém o original.
- Pelo admin, o `components/admin/PhotoUploader.tsx` já faz isso no navegador. Em scripts e cargas em lote (que gravam direto no Storage), aplicar o mesmo padrão com `sharp`.
- Fotos antigas grandes (acima de 600 KB) são reduzidas com `node --env-file=.env.local scripts/shrink-photos.mjs --apply`, que guarda o original em `~/Desktop/backup-fotos-supabase` antes de sobrescrever.
- Toda foto de atração leva legenda com o crédito da fonte (ex: "Foto: Walt Disney World."). Fotos do Wikimedia Commons levam autor e licença na legenda.

## Dicas de viagem (cards)
- Cards de dicas de países da Europa devem ficar todos agrupados juntos no mesmo capítulo "Europa".
- O nome do card deve sempre citar o país e/ou a cidade a que se refere.
- O nome do card deve chamar atenção e despertar vontade de clicar: destaque em negrito uma ou duas palavras, as mais importantes do título.
- Títulos devem ser sempre bem chamativos, com gancho que dê vontade de clicar (sem prometer o que o conteúdo não entrega).
- Toda categoria de dicas deve ter pelo menos 1 card travado como premium (`is_premium`), e esse deve ser o de título mais chamativo.

## Ao cadastrar atrações (sempre que o usuário pedir)
Pesquisar o máximo possível em fontes confiáveis (site oficial, órgãos de turismo, imprensa): é a parte que agrega valor ao site. Nunca inventar.
- **Dicas** (`important_tips`): sem negrito; preferencialmente sem link (já há no conteúdo), a não ser algo bem específico; cada dica com ✓; uma linha embaixo da outra, sem linha em branco.
- **Detalhes rápidos**: preencher tudo o que for possível (tempo de visita, melhor horário, época, público, flags de clima/ar-condicionado/reserva, coordenadas, etiquetas, faixa de preço só se for restaurante e verificada).
- **Conteúdo** (`description`): destacar em negrito algo relevante do lugar, linha em branco entre os parágrafos e indicar o site oficial no final.
- **Fotos**: no mínimo 3 fotos bonitas por atração, com crédito na legenda. Restaurante: só fotos de comida apetitosa, nunca prato feio ou nojento. Sem 3 fotos boas, a atração fica como rascunho (`draft`).
- Conferir as fotos visualmente antes de usar (miniaturas numeradas) e usar o Wikimedia Commons com autor e licença livre.

## Faixa de preço dos restaurantes (`price_range`, 1 a 4)
Só as 4 opções existentes: 1 = $ Econômico, 2 = $$ Moderado, 3 = $$$ Caro, 4 = $$$$ Muito caro. Não criar categorias nem renomear.
- Sempre o preço de uma refeição típica por adulto (nunca o total da família, nunca só o item mais barato ou mais caro). Buffet, restaurante com personagens e preço fechado: valor integral por adulto.
- Internacionais (referência: faixas da Disney, em US$ por adulto): 1 até 14,99; 2 de 15 a 34,99; 3 de 35 a 59,99; 4 a partir de 60. Fora dos EUA, converter para dólar só internamente (a conversão não aparece no site).
- Brasil (referência: Tripadvisor, adaptada): 1 = realmente econômico (pela análise dos preços); 2 = preços acessíveis, incluindo os $ do Tripadvisor quando adequado; 3 = $$-$$$ do Tripadvisor; 4 = $$$$ do Tripadvisor. Na dúvida, conferir o cardápio.
- Atrações que não são restaurantes: avaliar ingresso/experiência separadamente, sem aplicar estas faixas.
- Nunca chutar a faixa: só classificar com preço verificado em fonte (cardápio, site oficial, Tripadvisor).

## Banco de dados (Supabase)
- Autorização permanente do usuário: rodar SQL/migrations diretamente no banco Supabase de produção (`SUPABASE_DB_URL` em `.env.local`) sem pedir confirmação antes, usando `npm run sql -- <arquivo.sql>` (script em `scripts/run-sql.mjs`, conecta via `pg`). Não é necessário pausar para perguntar antes desse tipo de execução.
- Toda alteração de schema deve continuar sendo registrada como um novo arquivo em `supabase/migrations/`, seguindo o padrão de nomenclatura `YYYYMMDDHHMMSS_descricao.sql` já usado no projeto: a autorização acima é sobre não perguntar antes de aplicar, não sobre pular o registro da migration.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
