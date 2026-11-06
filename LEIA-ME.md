# Cafés Gelados TOSTES

Vitrine e cardápio dos gelados da TOSTES&CO. É um site estático (HTML, CSS e JavaScript puro, sem build), pronto para o GitHub Pages.

## Arquivos
- `index.html`: estrutura da página e o link das fontes do Google Fonts
- `styles.css`: visual (vitrine, abas, anatomia, carrinho, abertura, homenagem)
- `app.js`: carrossel 3D, categorias, efeitos do fundo, anatomia, carrinho e WhatsApp
- `bebidas.js`: **o arquivo que você edita no dia a dia**. Tem preços, nomes, fontes, cores, efeitos, anatomia, ordem das categorias e o número do WhatsApp.
- `img/`: fotos recortadas com fundo transparente (.webp, 900 px de altura)

## Antes de publicar
1. **WhatsApp:** em `bebidas.js`, troque `whatsapp: "5541999999999"` pelo número da cafeteria (55 + DDD + número, só dígitos).
2. **Fotos:** as fotos em `img/` são de teste (internet e bancos de imagem, uma delas com marca d'água do Freepik). Troque pelas fotos reais da casa, recortadas com fundo transparente e com o **mesmo nome de arquivo**. Depois confira os pontos da anatomia (campos `y` e `x`) de cada bebida.
3. **Pink Girl e Mango Matcha** usam a mesma foto de teste, uma delas recolorida. Use fotos diferentes.

## Publicar no GitHub Pages
1. Envie todos os arquivos desta pasta para o repositório, mantendo a pasta `img/`.
2. No GitHub, vá em Settings > Pages, escolha a branch `main` e a pasta raiz (`/`).

## Como editar uma bebida (bebidas.js)
- `preco`: valor com centavos (ex.: `17.00`)
- `nome`: uma ou mais linhas, cada uma com texto, fonte, cor e tamanho. Opcionais: `shadow`, `coroa: true`, `enfeite: "laco"`, `ls` (espaçamento) e `caps` (maiúsculas). Toda fonte nova precisa entrar no link do Google Fonts do `index.html`.
- `fundo`: `topo`, `base` (clara, é onde fica o texto), `luz` (cor viva atrás do copo) e `escuro: true` para fundos escuros.
- `efeito`: um efeito ou uma lista deles: `bolhas`, `brilho-dourado`, `po`, `gotas`, `neve`, `coracoes`, `brilhinhos`, `graos`, `folhas`, `sakura`, `floquinhos`, `especiarias`, `avelas`, `morangos`, `lacos`.
- `anatomia`: ingredientes que aparecem ao tocar no copo, com `y`/`x` (posição no copo, de 0 a 1), `lado` (`l` ou `r`), `cor` da camada e `nota` curta.
- `destaque`: selo acima do nome (ex.: `"Mais pedido"`).
- `opcoes`: escolha extra que vai junto no pedido (ex.: Sem café / Com café).
- `homenagem`: tag e cartãozinho de dedicatória (usado no My Lady Latte).
- A ordem das bebidas em cada aba fica no campo `ordem` da categoria.

## Abertura
A abertura com a nevasca aparece só na primeira visita de cada celular. Para ver de novo, abra o link com `#abertura` no final.
