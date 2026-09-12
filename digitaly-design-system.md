# Digitaly Design System

Versão 1.0 · Setembro de 2026
Engenharia de IA para Transformação de Negócios

Fundamentos, componentes e linguagem visual para tudo que a Digitaly publica: sites, produtos, decks e peças sociais. Um só sistema para a marca institucional e para o ecossistema Aline.

Princípios: futurista com base sóbria, liquid glass como assinatura, celeste como único acento cromático, tipografia contida e números sempre acompanhados de contexto.

Tagline: "Inteligência em Produção". Divisão de papéis: "A Digitaly projeta, a Aline opera."

## 1. Marca e logotipo

Arquivos oficiais hospedados em digitaly.tech. Duas versões do logotipo horizontal. Não recriar, redesenhar ou vetorizar por conta própria.

### Arquivos

| Versão | Uso | URL |
|---|---|---|
| Logotipo branco | Fundos grafite, gradiente, fotografia escura | https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_branca-scaled.png |
| Logotipo cinza | Fundos brancos e claros | https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_cinza-scaled.png |

### Tamanhos mínimos

- Altura mínima de 22px em interface (topbar, rodapé).
- Largura mínima de 120px em qualquer aplicação.
- Avatares e favicons apenas com recorte oficial fornecido pela marca.

### Área de proteção

- Margem mínima igual à altura do logotipo (1x) em todos os lados.
- Largura mínima do logotipo horizontal: 120px em tela, 30mm em impresso.

### Uso correto

- Branca em grafite, gradiente e fotografia escura. Cinza em branco e tons claros. Em fotografia clara, aplicar sobre placa de liquid glass.
- Usar sempre os PNGs oficiais ou o vetor original. Sem recorte, sem reconstrução.
- Escalar com proporção travada. Em texto corrido, "Digitaly" com inicial maiúscula.

### Uso incorreto

- Recolorir. Nenhuma cor fora das duas versões oficiais.
- Distorcer, rotacionar, aplicar sombra, contorno ou efeito 3D.
- Redesenhar o logotipo em tipografia do sistema ou gerar símbolos alternativos.

### Alternância por tema (HTML)

```html
<img class="logo-branca" src="https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_branca-scaled.png" alt="Digitaly Technology">
<img class="logo-cinza" src="https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_cinza-scaled.png" alt="Digitaly Technology">
```

```css
[data-theme="dark"] .logo-cinza{display:none}
[data-theme="light"] .logo-branca{display:none}
```

## 2. Cores

Duas famílias: Grafite para estrutura e Celeste para marca. Celeste 500 (#009FFF) é o único acento; tudo que não for ação, marca ou estado usa Grafite. Semânticas aparecem só em feedback.

### Grafite

| Token | Hex |
|---|---|
| grafite-950 | #0B0D10 |
| grafite-900 | #121417 |
| grafite-800 | #1B1E23 |
| grafite-700 | #262A31 |
| grafite-600 | #3A3F48 |
| grafite-500 | #5B6270 |
| grafite-400 | #7D8494 |
| grafite-300 | #A5ACB8 |
| grafite-200 | #CFD4DC |
| grafite-100 | #E6E9EE |
| grafite-50 | #F5F7FA |

### Celeste

| Token | Hex |
|---|---|
| celeste-700 | #0069AB |
| celeste-600 | #0084D6 |
| celeste-500 (marca) | #009FFF |
| celeste-400 | #33B3FF |
| celeste-300 | #66C6FF |
| celeste-200 | #A8DEFF |
| celeste-100 | #D9F0FF |
| celeste-50 | #EEF8FF |

### Semânticas

| Token | Hex |
|---|---|
| sucesso | #22C55E |
| alerta | #F59E0B |
| erro | #EF4444 |
| info | #009FFF |

### Gradientes

Direção fixa em 135°.

- grad-marca: #009FFF → #4CC9FF. Botões primários, símbolo, destaques.
- grad-marca-profundo: #0069AB → #009FFF (60%) → #4CC9FF. Fundos hero e cards de destaque.

### Contraste (WCAG, texto sobre fundo sólido)

| Combinação | Razão | Nível |
|---|---|---|
| Grafite 50 sobre 950 | 17,4:1 | AAA |
| Grafite 300 sobre 950 | 8,1:1 | AAA |
| Branco sobre Celeste 500 | 2,7:1 | Só UI grande (botão Medium a partir de 13px) |
| Celeste 600 sobre branco | 4,6:1 | AA |

### Temas

| Papel | Escuro (padrão) | Claro |
|---|---|---|
| bg | grafite-950 | #FFFFFF |
| bg-elev | grafite-900 | grafite-50 |
| bg-elev-2 | grafite-800 | grafite-100 |
| borda | rgba(255,255,255,.08) | rgba(18,20,23,.08) |
| borda-forte | rgba(255,255,255,.16) | rgba(18,20,23,.16) |
| texto | grafite-50 | grafite-900 |
| texto-2 | grafite-300 | grafite-500 |
| texto-3 | grafite-500 | grafite-400 |
| vidro | rgba(255,255,255,.05) | rgba(255,255,255,.55) |
| vidro-borda | rgba(255,255,255,.12) | rgba(18,20,23,.08) |

## 3. Tipografia

Duas famílias. Inter cobre display, títulos e texto; IBM Plex Sans cobre números e apoio. Display em Inter Thin 100, texto em Regular 400, subtítulos e botões em Medium 500. Bold não faz parte do sistema; hierarquia vem de peso leve, tamanho, cor e espaço.

| Família | Papel | Pesos |
|---|---|---|
| Inter Thin | Display e títulos principais (h1, h2), tracking 0, a partir de 32px | 100 |
| Inter | Texto corrido, subtítulos (h3, h4), interface e peças sociais | 400, 500 |
| IBM Plex Sans | Números, datas, códigos, tokens e elementos de apoio em páginas web | 400, 500 |

### Escala

Razão aproximada 1,22, base 15px. Nenhum título de conteúdo acima de 40px. Inter Thin só a partir de 32px; abaixo disso, Medium 500.

| Estilo | Família / peso | Tamanho | Altura de linha |
|---|---|---|---|
| Display / h1 | Inter Thin 100 | 40px | 1.2 |
| h2 | Inter Thin 100 | 32px | 1.2 |
| h3 | Inter Medium 500 | 21px | 1.3 |
| h4 | Inter Medium 500 | 17px | 1.3 |
| Lead | Inter 400 | 17px | 1.6 |
| Corpo | Inter 400 | 15px | 1.6 |
| Pequeno | Inter 400 | 13px | 1.5 |
| Dados | IBM Plex Sans 500 | 32px | 1 |
| Meta | IBM Plex Sans 400 | 12px | 1.5 |

Largura máxima de texto corrido: 68 caracteres por linha.

## 4. Espaçamento e raio

Grade de 4px.

- Espaço: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px.
- Raios: sm 8px, md 12px, lg 16px, xl 24px, pill 999px.

| Elemento | Raio |
|---|---|
| Botões, inputs, badges, tabs | pill (alturas 32, 40 ou 48px) |
| Cards e painéis | lg 16px; destaque em hero pode usar xl 24px |
| Imagens e vídeos | md 12px em linha; lg quando ocupam a largura total |

## 5. Botões

Um primário por tela. Texto em Inter Medium, sentence case, verbo no imperativo que descreve o que acontece ("Agendar demonstração", "Salvar alterações").

| Variante | Fundo | Borda | Texto | Hover |
|---|---|---|---|---|
| Primário | grad-marca | nenhuma | branco | glow celeste |
| Secundário | transparente | borda-forte | texto | borda Celeste 500 |
| Fantasma | transparente | nenhuma | texto-2 | bg-elev-2 |
| Vidro | vidro + blur 14px | vidro-borda | texto | sem alteração |
| Desabilitado | herda | herda | opacidade 45% | nenhum |

Tamanhos: pequeno 32px (12px de fonte), padrão 40px (13px), grande 48px (15px). Ícones de 16px com gap de 8px.

## 6. Formulários

- Campos pill, borda de 1px em borda-forte, padding 11px 16px.
- Textarea usa raio lg, altura mínima 96px.
- Foco: borda Celeste 500 com halo de 3px a 20% de opacidade.
- Erro: borda e texto de ajuda em erro (#EF4444). Mensagem aponta o problema e a correção.
- Toggle: 52x30px, pill, fundo grafite-600 desligado e Celeste 500 ligado.

## 7. Cards e liquid glass

Liquid glass é a assinatura visual da marca: blur de 20px, saturação 140%, borda de 1px semi-transparente.

| Variante | Uso |
|---|---|
| Sólido | Padrão. Fundo bg-elev, borda 1px, raio lg |
| Vidro | Sobre gradiente ou imagem. Fundo vidro, borda vidro-borda, backdrop-filter |
| Destaque | grad-marca-profundo, sem borda, texto branco |

```css
.glass{
  background:var(--vidro);
  border:1px solid var(--vidro-borda);
  backdrop-filter:blur(20px) saturate(140%);
  -webkit-backdrop-filter:blur(20px) saturate(140%);
}
```

## 8. Navegação

- Barra superior fixa em liquid glass (blur 18px), borda inferior de 1px.
- Sidebar off-canvas de 280px, itens pill, item ativo em Celeste 500 com texto branco.
- Tabs pill dentro de um contêiner pill com padding de 4px.
- Tema escuro como padrão, alternância para claro no canto direito.
- Avatares: 56, 40 e 28px, fundo grad-marca, iniciais em Inter Medium.

## 9. Badges e alertas

Badges sempre pill, 12px Medium, padding 4px 12px, ponto opcional de 6px para status vivo.

| Badge | Fundo | Texto |
|---|---|---|
| marca | rgba(0,159,255,.14) | marca-texto |
| sucesso | rgba(34,197,94,.14) | #22C55E |
| alerta | rgba(245,158,11,.14) | #F59E0B |
| erro | rgba(239,68,68,.14) | #EF4444 |
| neutro | bg-elev-2 | texto-2 |
| contorno | transparente, borda-forte | texto-2 |

Alertas: raio lg, borda 1px na cor semântica a 35%, fundo a 8%, ícone de 18px. Título em Medium, corpo diz o que aconteceu e o que fazer em seguida.

## 10. Tabelas e dados

- Números em IBM Plex Sans, alinhados à direita.
- Cabeçalho em 12px, texto-3, borda inferior em borda-forte.
- Células com padding 14px 16px, hover em bg-elev-2.
- Todo número exibido traz sua condição geradora: período, base de comparação ou unidade.

## 11. Motivos visuais

Seis motivos para fundos, capas e peças sociais. Direção futurista, liquid glass sempre presente, Celeste como única cor de luz. Fundo branco permitido em até 30% das peças de uma série.

1. Placa de vidro sobre gradiente profundo
2. Luz celeste em grafite
3. Névoa celeste em branco
4. Grade com foco desfocado
5. Linhas de fluxo sobre gradiente
6. Vidro com núcleo luminoso

### Peças sociais

- Formato 1024x1024, margem interna mínima de 64px, logotipo em um dos cantos inferiores.
- Tipografia só Inter: títulos Medium 500, texto Regular 400. Sem Bold, sem Inter Tight.
- Grafite 900 como base, tons de azul celeste como luz. Cores de acento por perfil (Alyson, Aline, Digitaly) apenas em detalhes.

## 12. Iconografia

Ícones de linha, traço de 2px, cantos arredondados, grade de 24px. Fonte recomendada: Lucide. Sem ícones preenchidos, sem duotone.

## 13. Tom de voz

Escopo internacional, corporativo e horizontal. A Digitaly fala como engenharia que entrega, com números verificáveis e sem promessa vaga.

### Fazer

- Posicionar como "Engenharia de IA para Transformação de Negócios".
- Todo número vem com a condição que o gerou (período, base, unidade).
- Frases curtas, voz ativa, verbos concretos.
- Sentence case em títulos e botões.
- "Digitaly" e "Aline" com inicial maiúscula em texto corrido.

### Evitar

- Travessões e construções de antítese do tipo "não é X, é Y".
- Fechar o posicionamento em "empresa brasileira" ou "soluções financeiras".
- Adjetivos de intensidade sem dado por trás ("revolucionário", "disruptivo").
- Caixa alta em rótulos e títulos.
- Citar publicamente as referências internas de posicionamento.

## 14. Tokens

### CSS

```css
:root{
  --grafite-950:#0B0D10; --grafite-900:#121417; --grafite-800:#1B1E23;
  --grafite-700:#262A31; --grafite-600:#3A3F48; --grafite-500:#5B6270;
  --grafite-400:#7D8494; --grafite-300:#A5ACB8; --grafite-200:#CFD4DC;
  --grafite-100:#E6E9EE; --grafite-50:#F5F7FA;

  --celeste-700:#0069AB; --celeste-600:#0084D6; --celeste-500:#009FFF;
  --celeste-400:#33B3FF; --celeste-300:#66C6FF; --celeste-200:#A8DEFF;
  --celeste-100:#D9F0FF; --celeste-50:#EEF8FF;

  --grad-marca:linear-gradient(135deg,#009FFF 0%,#4CC9FF 100%);
  --grad-marca-profundo:linear-gradient(135deg,#0069AB 0%,#009FFF 60%,#4CC9FF 100%);

  --sucesso:#22C55E; --alerta:#F59E0B; --erro:#EF4444; --info:#009FFF;

  --fonte-display:'Inter',system-ui,sans-serif;
  --fonte-texto:'Inter',system-ui,sans-serif;
  --fonte-dados:'IBM Plex Sans',system-ui,sans-serif;

  --t-xs:12px; --t-sm:13px; --t-md:15px; --t-lg:17px;
  --t-xl:21px; --t-2xl:26px; --t-3xl:32px; --t-4xl:40px;

  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:20px; --s-6:24px;
  --s-8:32px; --s-10:40px; --s-12:48px; --s-16:64px; --s-20:80px;

  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px; --r-pill:999px;

  --dur-rapida:120ms; --dur-base:200ms; --dur-lenta:320ms;
  --ease:cubic-bezier(.2,.8,.2,1);
}
[data-theme="dark"]{
  --bg:var(--grafite-950); --bg-elev:var(--grafite-900); --bg-elev-2:var(--grafite-800);
  --borda:rgba(255,255,255,.08); --borda-forte:rgba(255,255,255,.16);
  --texto:var(--grafite-50); --texto-2:var(--grafite-300); --texto-3:var(--grafite-500);
  --vidro:rgba(255,255,255,.05); --vidro-borda:rgba(255,255,255,.12);
}
[data-theme="light"]{
  --bg:#FFFFFF; --bg-elev:var(--grafite-50); --bg-elev-2:var(--grafite-100);
  --borda:rgba(18,20,23,.08); --borda-forte:rgba(18,20,23,.16);
  --texto:var(--grafite-900); --texto-2:var(--grafite-500); --texto-3:var(--grafite-400);
  --vidro:rgba(255,255,255,.55); --vidro-borda:rgba(18,20,23,.08);
}
```

### JSON

```json
{
  "name": "Digitaly Design System",
  "version": "1.0.0",
  "color": {
    "grafite": { "950":"#0B0D10","900":"#121417","800":"#1B1E23","700":"#262A31","600":"#3A3F48","500":"#5B6270","400":"#7D8494","300":"#A5ACB8","200":"#CFD4DC","100":"#E6E9EE","50":"#F5F7FA" },
    "celeste": { "700":"#0069AB","600":"#0084D6","500":"#009FFF","400":"#33B3FF","300":"#66C6FF","200":"#A8DEFF","100":"#D9F0FF","50":"#EEF8FF" },
    "semantic": { "success":"#22C55E","warning":"#F59E0B","error":"#EF4444","info":"#009FFF" },
    "gradient": {
      "brand": { "angle":135, "stops":["#009FFF","#4CC9FF"] },
      "brandDeep": { "angle":135, "stops":["#0069AB","#009FFF","#4CC9FF"] }
    }
  },
  "typography": {
    "display": { "family":"Inter", "weights":[100], "letterSpacing":"0", "minSizePx":32 },
    "body": { "family":"Inter", "weights":[400,500], "headings":{"h3":500,"h4":500} },
    "data": { "family":"IBM Plex Sans", "weights":[400,500] },
    "scale": { "xs":12,"sm":13,"md":15,"lg":17,"xl":21,"2xl":26,"3xl":32,"4xl":40 },
    "social": { "family":"Inter", "title":500, "text":400, "bold":false }
  },
  "spacing": [4,8,12,16,20,24,32,40,48,64,80],
  "radius": { "sm":8,"md":12,"lg":16,"xl":24,"pill":999 },
  "motion": { "fast":120,"base":200,"slow":320,"ease":"cubic-bezier(.2,.8,.2,1)" },
  "glass": { "blur":20,"saturate":1.4,"border":1 },
  "logo": {
    "white":"https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_branca-scaled.png",
    "gray":"https://digitaly.tech/wp-content/uploads/2026/06/logo_digitaly_cinza-scaled.png",
    "minWidthPx":120,
    "minHeightPx":22,
    "clearSpace":"1x logo height",
    "backgrounds":{"white":["grafite-950","gradient.brand","dark photo"],"gray":["white","light"]}
  },
  "social": { "format":"1024x1024","margin":64,"mode":"futurista","glass":true }
}
```
