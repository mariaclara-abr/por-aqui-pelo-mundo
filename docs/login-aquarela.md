# Login em aquarela

A rota `/entrar` usa a fotografia de praia enviada pela usuária, reinterpretada como aquarela no mesmo estilo das ilustrações do site. A pintura cobre toda a tela e o formulário ocupa um card central levemente translúcido. O formulário continua usando `/api/auth/login`, o OAuth do Google e o redirecionamento seguro de `?next=`.

O cabeçalho e rodapé compartilhados ficam ocultos apenas enquanto o elemento desta rota está presente, por um seletor CSS com `:has()`. A página mantém rolagem natural para acomodar telas pequenas, zoom e mensagens de erro. O enquadramento móvel da imagem e do canvas usa o mesmo `object-position`.

## Arte

- Arquivo servido: `public/login-praia-aquarela.webp` (1536 × 1024, aproximadamente 505 KiB).
- Geração: ferramenta integrada ImageGen, edição com a fotografia original e duas aquarelas do projeto como referências.
- Otimização: conversão para WebP, qualidade 90, sem mudança de composição.
- As máscaras de movimento em `lib/animate-beach.ts` correspondem a esta composição. Ao substituir a arte, revisar coordenadas das copas, troncos, horizonte e praia.

Prompt utilizado:

> Use case: style-transfer. Asset type: finished watercolor background illustration for the login page of Por Aqui Pelo Mundo, a warm editorial travel website. Input images: the tropical BEACH PHOTOGRAPH supplied by the user is the edit target (the palm tree leaning from the lower right across the beach towards the center, taller palms on the right, blue sky, clear turquoise sea, fine sand); the waterfall watercolor and cream botanical paper are STYLE references only, do not copy their subjects. Transform the beach photograph faithfully into an exquisite traditional transparent watercolor painting on warm ivory cotton paper, consistent with those two style references. Preserve the recognizable composition and location of the curved foreground palm, right-hand tall palms, calm turquoise ocean horizontal horizon around 62% of height and gently curving sandy shore. Finely painted expressive olive and sage fronds, layered translucent turquoise washes, dry-brush details in trunks, subtle granulated paper texture, soft atmospheric distant shore. Bright yet softly muted natural palette with sea glass turquoise, olive greens, pale sky blue, warm sand. Landscape 1536x1024 composition. Fade the outer edges organically into unpainted warm ivory paper, especially the left 10% and the bottom 5%, like an illustration in a beautiful travel sketchbook. The scene should occupy most of the canvas, with all principal palm fronds visible and space around their edges. Sky is pale watercolor blue, not oversaturated. No added objects, no people, no buildings, no UI, no lettering, no text, no logos, no border, no watermark. Deliver the painting itself, not a photographed book or a website mockup.

## Referências de movimento

Foram observadas sequências de dez quadros, um por segundo, extraídas de cada vídeo real:

- [Windy Day on the Beach, Peggy Anke](https://www.pexels.com/video/windy-day-on-the-beach-5087948/).
- [Tropical Beach with Palm Trees and Waves, Roong Thongwichien](https://www.pexels.com/video/tropical-beach-with-palm-trees-and-waves-32002998/).

As pontas das folhas flexionam mais que as bases, com fases diferentes; os troncos permanecem quase imóveis. Ondas pequenas avançam em direção à areia sem mover o horizonte. A implementação traduz essas observações em deslocamentos discretos da própria pintura, sem carregar vídeos no site.

## Comportamento e verificação

- A animação para fora da área visível e em abas ocultas, com limite de 30 quadros por segundo.
- `prefers-reduced-motion` mantém a imagem estática, inclusive se a preferência mudar com a página aberta.
- A imagem permanece disponível sem JavaScript, sem WebGL ou se o contexto gráfico for perdido.
- O vento desloca as pontas das palmeiras; ondulações percorrem a água. Troncos e horizonte continuam imóveis.
- Verificado no Chrome em 320 × 740, 390 × 844, 768 × 1024, 1024 × 768, 1366 × 768 e 1440 × 900, sem transbordamento horizontal.
- Verificados mostrar/ocultar senha, erro HTTP e falha de conexão, foco de teclado, redução de movimento inicial e dinâmica, perda do contexto WebGL e imagem sem JavaScript.
- Verificados centralização e transparência do card, além da restauração do cabeçalho e rodapé ao navegar para recuperação de senha.
- O teste do formulário usa requisições interceptadas, sem enviar credenciais reais. O fluxo completo com uma conta real não faz parte dessa validação visual.
