/*
  CARDÁPIO GELADO — TOSTES
  Edite aqui preços, textos e bebidas. Não precisa mexer em outro arquivo.

  Para adicionar uma bebida:
  1. Coloque a foto recortada (fundo transparente, .webp ou .png) na pasta img/
  2. Copie um bloco de bebida, troque id, categoria, foto, nome, preço, frase e ingredientes.
  3. "fundo" define as cores da tela dessa bebida:
       topo  = cor do alto da tela
       base  = cor de baixo (onde fica o texto, deixe clara)
       luz   = cor viva que brilha atrás do copo
       escuro: true  se o fundo for escuro (o texto fica claro)
  Opcional: destaque: "Mais pedido" (com coroa: true na linha do nome, aparece a coroinha; enfeite: "laco" põe um lacinho)
  e opcoes: { nome, valores } para escolhas como com ou sem café.
  4. "efeito" escolhe o detalhe animado do fundo:
       "bolhas", "brilho-dourado", "po", "gotas", "neve", "coracoes", "brilhinhos", "graos",
       "folhas", "sakura", "floquinhos", "especiarias", "avelas", "morangos", "lacos" (dá para combinar vários numa lista [ ... ])
     e "cores" são as cores dele.
  5. As fontes do nome precisam estar no link do Google Fonts do index.html.
*/
window.TOSTES = {
  config: {
    // Número do WhatsApp que recebe os pedidos: 55 + DDD + número, só dígitos.
    whatsapp: "5541999999999",
    mesas: 6,
    nomeLoja: "TOSTES&CO"
  },

  categorias: [
    { id: "lattes",  nome: "Lattes",  sobre: "Com leite",
      // ordem em que aparecem (os mais pedidos primeiro, depois dos clássicos aos mais doces)
      ordem: ["caramel-latte", "iced-latte", "vanilla-latte", "avela-latte", "caramelo-macchiato", "sweet-latte",
              "strawberry-latte", "lady-latte", "latte-vietnamita", "vietnamita-chocolate", "moka-tostes", "white-moka", "chococoffee", "chocolatte", "chocochoco"],
      fundo: { topo: "#E9D7C0", base: "#F7EEE3", luz: "#D9B48A" } },
    { id: "matchas", nome: "Matchas", sobre: "Matcha gelado",
      ordem: ["matcha-latte", "vanilla-matcha", "matchantilly", "mango-matcha", "strawberry-matcha-latte", "pink-girl-matcha"],
      fundo: { topo: "#D5E3C0", base: "#F1F5E8", luz: "#A9C47F" } },
    { id: "coffees", nome: "Coffees", sobre: "Sem leite",
      fundo: { topo: "#2C1B14", base: "#140C09", luz: "#6B3A26", escuro: true },
},
    { id: "chai",    nome: "Chai",    sobre: "Especiarias",
      fundo: { topo: "#F1CFA3", base: "#FBF0E2", luz: "#E39A55" },
      breve: "Os chais gelados estão chegando ao cardápio." }
  ],

  bebidas: [
    /* ---------------- LATTES (com leite) ---------------- */
    {
      id: "caramel-latte",
      categoria: "lattes",
      foto: "img/caramel-latte.webp",
      escala: 0.92,
      preco: 16.00,
      destaque: "Mais pedido",
      fundo: { topo: "#EFC48A", base: "#FFF6EA", luz: "#E8A24A" },
      efeito: { tipo: "brilhinhos", cores: ["#F7D486", "#FFFFFF", "#E8A24A", "#FFE9B8"] },
      nome: [
        { t: "Caramel", font: "'Playfair Display', Georgia, serif", weight: 800, color: "#B5651D", size: 1, shadow: "2px 2px 0 #FFF3DC", coroa: true },
        { t: "Latte", font: "'Playfair Display', Georgia, serif", weight: 800, color: "#4A3426", size: 0.55 }
      ],
      frase: "Espresso, leite gelado e calda de caramelo escorrendo pelo copo.",
      ingredientes: ["Espresso", "Leite", "Calda de caramelo", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.05, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Por cima, douradinho", y: 0.22, x: 0.32, lado: "l", cor: "#B87A3A" },
        { t: "Calda de caramelo", nota: "Escorrendo pelo copo", y: 0.45, x: 0.42, lado: "r", cor: "#C9761E" },
        { t: "Leite", nota: "Gelado, na base", y: 0.82, x: 0.35, lado: "l", cor: "#F6F2EA" }
      ]
    },
    {
      id: "iced-latte",
      categoria: "lattes",
      foto: "img/iced-latte.webp",
      escala: 0.9,
      preco: 14.00,
      fundo: { topo: "#E6D2B8", base: "#F8F0E5", luz: "#D7A979" },
      efeito: { tipo: "bolhas", cores: ["#FFFFFF", "#F3E2CC"] },
      nome: [
        { t: "Iced Latte", font: "'DM Serif Display', Georgia, serif", color: "#2F3B2A", size: 1 }
      ],
      frase: "O clássico: espresso e leite gelado, simples e equilibrado.",
      ingredientes: ["Espresso", "Leite", "Gelo"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca do copo", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Descendo em redemoinho", y: 0.36, x: 0.32, lado: "l", cor: "#8A4A1E" },
        { t: "Leite", nota: "Gelado, na base", y: 0.8, x: 0.62, lado: "r", cor: "#F4EDE3" }
      ]
    },
    {
      id: "caramelo-macchiato",
      categoria: "lattes",
      foto: "img/caramelo-macchiato.webp",
      escala: 1,
      preco: 18.00,
      fundo: { topo: "#F1C88F", base: "#FCF1E1", luz: "#EE9A3F" },
      efeito: { tipo: "brilho-dourado", cores: ["#FFD38A", "#F7B65A", "#FFF1D6"] },
      nome: [
        { t: "Caramelo", font: "'Alfa Slab One', Georgia, serif", color: "#A0521D", size: 1, shadow: "2px 2px 0 #4A3426" },
        { t: "Macchiato", font: "'Alfa Slab One', Georgia, serif", color: "#4A3426", size: 0.55 }
      ],
      frase: "Caramelo e espresso em dose intensa, com baunilha e chantilly por cima.",
      ingredientes: ["Espresso", "Caramelo", "Baunilha", "Chantilly"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Chantilly", nota: "Alto, com grade de caramelo", y: 0.13, x: 0.35, lado: "l", cor: "#FFFFFF" },
        { t: "Baunilha", nota: "Perfuma o creme", y: 0.42, x: 0.62, lado: "r", cor: "#F1DDB3" },
        { t: "Caramelo", nota: "Escorrendo pelo copo", y: 0.62, x: 0.16, lado: "l", cor: "#C46A1C" },
        { t: "Espresso", nota: "Dose intensa no fundo", y: 0.88, x: 0.6, lado: "r", cor: "#7A4316" }
      ]
    },
    {
      id: "moka-tostes",
      categoria: "lattes",
      foto: "img/moka-tostes.webp",
      escala: 1,
      preco: 17.00,
      assinatura: true,
      fundo: { topo: "#4A1C17", base: "#1E0D0A", luz: "#8E3A2C", escuro: true },
      efeito: { tipo: "po", cores: ["#E8C3A0", "#C98B5A", "#F6E2CC"] },
      nome: [
        { t: "Moka", font: "'Abril Fatface', Georgia, serif", color: "#F3E2CF", size: 1.1, shadow: "3px 3px 0 #6B1E1E" },
        { t: "Tostes", font: "'Darumadrop One', system-ui, sans-serif", color: "#B9CBA3", size: 0.5 }
      ],
      frase: "A moka da casa: espresso e chocolate com um toque de baunilha.",
      ingredientes: ["Espresso", "Calda de chocolate", "Baunilha", "Chantilly", "Cacau"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Cacau", nota: "Polvilhado no topo", y: 0.05, x: 0.55, lado: "r", cor: "#7A4428" },
        { t: "Chantilly", nota: "Com fios de chocolate", y: 0.18, x: 0.3, lado: "l", cor: "#FFFFFF" },
        { t: "Espresso", nota: "Batido com a bebida", y: 0.42, x: 0.66, lado: "r", cor: "#B08A66" },
        { t: "Calda de chocolate", nota: "Em ondas por dentro", y: 0.62, x: 0.18, lado: "l", cor: "#3A1D10" },
        { t: "Baunilha", nota: "Um toque suave", y: 0.85, x: 0.62, lado: "r", cor: "#E8D3B0" }
      ]
    },
    {
      id: "chococoffee",
      categoria: "lattes",
      foto: "img/chococoffee.webp",
      escala: 1,
      preco: 18.00,
      fundo: { topo: "#5A3524", base: "#24150E", luz: "#9C6440", escuro: true },
      efeito: { tipo: "gotas", cores: ["#C98B5A", "#7A4A2E", "#E7B48A"] },
      nome: [
        { t: "Chococoffee", font: "'Sniglet', system-ui, sans-serif", weight: 800, color: "#F2C49B", size: 0.95, shadow: "3px 3px 0 #8A4B2A" }
      ],
      frase: "Chocolate cremoso e espresso, gelado, com chantilly e cacau por cima.",
      ingredientes: ["Leite", "Creme de chocolate", "Espresso", "Chantilly", "Cacau"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Cacau", nota: "Por cima do chantilly", y: 0.06, x: 0.55, lado: "r", cor: "#7A4428" },
        { t: "Chantilly", nota: "Alto e macio", y: 0.18, x: 0.3, lado: "l", cor: "#FFFFFF" },
        { t: "Espresso", nota: "A espuma clarinha", y: 0.36, x: 0.66, lado: "r", cor: "#C9A27E" },
        { t: "Creme de chocolate", nota: "Dá a cor e a cremosidade", y: 0.62, x: 0.28, lado: "l", cor: "#6A3E26" },
        { t: "Leite", nota: "Gelado, na mistura", y: 0.86, x: 0.62, lado: "r", cor: "#EADBC8" }
      ]
    },

    {
      id: "chocolatte",
      categoria: "lattes",
      foto: "img/chocolatte.webp",
      escala: 0.95,
      preco: 18.00,
      fundo: { topo: "#9A6A4C", base: "#F8F0E6", luz: "#5A3424" },
      efeito: { tipo: "po", cores: ["#3A1D10", "#FFFFFF", "#8A5A3A"] },
      nome: [
        { t: "Choco", font: "'Gloock', Georgia, serif", color: "#3A1D10", size: 1 },
        { t: "latte", font: "'Gloock', Georgia, serif", color: "#FFFFFF", size: 0.8, shadow: "1px 1px 0 #3A1D10, -1px -1px 0 #3A1D10, 1px -1px 0 #3A1D10, -1px 1px 0 #3A1D10, 3px 3px 0 #3A1D10" }
      ],
      frase: "Leite com chocolate branco e espresso com chocolate preto, em duas camadas.",
      ingredientes: ["Espresso com chocolate preto", "Leite com chocolate branco", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "No topo, escurinho", y: 0.05, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso com chocolate preto", nota: "A camada escura de cima", y: 0.3, x: 0.3, lado: "l", cor: "#3A1D10" },
        { t: "Leite com chocolate branco", nota: "A base clarinha", y: 0.8, x: 0.62, lado: "r", cor: "#F7F0DC" }
      ]
    },
    {
      id: "chocochoco",
      categoria: "lattes",
      foto: "img/chocochoco.webp",
      escala: 0.86,
      preco: 17.00,
      opcoes: { nome: "Café", valores: ["Sem café", "Com café"] },
      fundo: { topo: "#D8B394", base: "#FBF1E7", luz: "#A86E4A" },
      efeito: { tipo: "gotas", cores: ["#5A3524", "#8A5A3A", "#FFF6EA"] },
      nome: [
        { t: "Chocochoco", font: "'Fredoka', system-ui, sans-serif", weight: 700, color: "#6B3F27", size: 0.95, shadow: "3px 3px 0 #FFF3E6" }
      ],
      frase: "Três chocolates batidos com leite gelado. Com ou sem café.",
      ingredientes: ["Chocolate branco", "Chocolate preto", "Chocolate meio amargo", "Leite", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos no topo", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Chocolate branco", nota: "Deixa tudo cremoso", y: 0.3, x: 0.3, lado: "l", cor: "#F7F0DC" },
        { t: "Chocolate preto", nota: "Dá a cor", y: 0.45, x: 0.66, lado: "r", cor: "#3A1D10" },
        { t: "Chocolate meio amargo", nota: "O toque intenso", y: 0.62, x: 0.32, lado: "l", cor: "#5A3424" },
        { t: "Leite", nota: "Gelado, na mistura", y: 0.84, x: 0.62, lado: "r", cor: "#C9A48A" }
      ]
    },

    {
      id: "white-moka",
      categoria: "lattes",
      foto: "img/white-moka.webp",
      escala: 1,
      preco: 18.00,
      fundo: { topo: "#E9E0D0", base: "#FFFDF8", luz: "#E6D4B2" },
      efeito: [
        { tipo: "neve", cores: ["#FFF8E6", "#F3E6C8", "#FFFFFF"], n: 34 },
        { tipo: "brilhinhos", cores: ["#E9C98A", "#FFFFFF"], n: 12 }
      ],
      nome: [
        { t: "White", font: "'Great Vibes', cursive", color: "#B08A55", size: 0.75 },
        { t: "Moka", font: "'Cormorant Garamond', Georgia, serif", weight: 700, color: "#4A3426", size: 1.15, overlap: true }
      ],
      frase: "Chocolate branco, espresso e leite gelado, com chantilly.",
      ingredientes: ["Chocolate branco", "Leite", "Espresso", "Chantilly"],
      anatomia: [
        { t: "Chantilly", nota: "Alto e macio", y: 0.08, x: 0.4, lado: "l", cor: "#FFFFFF" },
        { t: "Chocolate branco", nota: "Em raspas por cima", y: 0.17, x: 0.62, lado: "r", cor: "#F3E3B8" },
        { t: "Espresso", nota: "Dá o tom bege", y: 0.5, x: 0.32, lado: "l", cor: "#C9A884" },
        { t: "Leite", nota: "Gelado, na base", y: 0.82, x: 0.62, lado: "r", cor: "#F6F0E4" }
      ]
    },
    {
      id: "vanilla-latte",
      categoria: "lattes",
      foto: "img/vanilla-latte.webp",
      escala: 0.92,
      preco: 16.00,
      fundo: { topo: "#F1E2BA", base: "#FFFBF0", luz: "#EFCF7E" },
      efeito: [
        { tipo: "po", cores: ["#2B1A10", "#4A2E1A"], n: 38 },
        { tipo: "brilho-dourado", cores: ["#FFE7A6", "#FFF4D2"], n: 10 }
      ],
      nome: [
        { t: "Vanilla", font: "'Dancing Script', cursive", weight: 700, color: "#A07A2C", size: 1.05 },
        { t: "Latte", font: "'DM Serif Display', Georgia, serif", color: "#4A3426", size: 0.55 }
      ],
      frase: "Espresso, leite gelado e baunilha.",
      ingredientes: ["Espresso", "Leite", "Xarope de baunilha", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.07, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Descendo pelo leite", y: 0.32, x: 0.62, lado: "r", cor: "#B87A3A" },
        { t: "Xarope de baunilha", nota: "Perfuma a bebida", y: 0.45, x: 0.3, lado: "l", cor: "#EFCF7E" },
        { t: "Leite", nota: "Gelado, na base", y: 0.78, x: 0.3, lado: "l", cor: "#F6F2EA" }
      ]
    },
    {
      id: "sweet-latte",
      categoria: "lattes",
      foto: "img/sweet-latte.webp",
      escala: 0.92,
      preco: 19.00,
      fundo: { topo: "#E9B676", base: "#FFF4E4", luz: "#D08A3A" },
      efeito: [
        { tipo: "brilho-dourado", cores: ["#FFD08A", "#F2A94E", "#FFF0D2"], n: 14 },
        { tipo: "graos", cores: ["#C8893F", "#B5752E", "#D9A35E"], n: 10 }
      ],
      nome: [
        { t: "Sweet", font: "'Chewy', system-ui, sans-serif", color: "#8A4A1E", size: 1.1, shadow: "3px 3px 0 #FFE7C2" },
        { t: "Latte", font: "'Chewy', system-ui, sans-serif", color: "#C8893F", size: 0.55 }
      ],
      frase: "Doce de leite, paçoca, espresso, leite e chantilly. Bem brasileiro.",
      ingredientes: ["Doce de leite", "Paçoca", "Leite", "Chantilly", "Espresso"],
      anatomia: [
        { t: "Paçoca", nota: "Esfarelada no topo", y: 0.05, x: 0.5, lado: "r", cor: "#C8893F" },
        { t: "Chantilly", nota: "Entre as camadas", y: 0.27, x: 0.3, lado: "l", cor: "#FFFFFF" },
        { t: "Doce de leite", nota: "Em ondas pelo copo", y: 0.45, x: 0.66, lado: "r", cor: "#B5752E" },
        { t: "Leite", nota: "Gelado, cremoso", y: 0.65, x: 0.3, lado: "l", cor: "#F6EEE0" },
        { t: "Espresso", nota: "No fundo", y: 0.9, x: 0.55, lado: "r", cor: "#5A3218" }
      ]
    },

    {
      id: "avela-latte",
      categoria: "lattes",
      foto: "img/avela-latte.webp",
      escala: 0.9,
      preco: 17.00,
      fundo: { topo: "#D7B089", base: "#FBF2E6", luz: "#A86A3A" },
      efeito: [
        { tipo: "avelas", cores: ["#9A5E32", "#B5753F", "#7E4A26"] },
        { tipo: "po", cores: ["#8A5230", "#C9965E"], n: 24 }
      ],
      nome: [
        { t: "Avelã", font: "'Bree Serif', Georgia, serif", color: "#7A4426", size: 1.1, shadow: "3px 3px 0 #F6E2C8" },
        { t: "Latte", font: "'Bree Serif', Georgia, serif", color: "#B5753F", size: 0.5 }
      ],
      frase: "Espresso, leite gelado e creme de avelã.",
      ingredientes: ["Creme de avelã", "Espresso", "Leite", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.05, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Com o creme de avelã", y: 0.3, x: 0.3, lado: "l", cor: "#6B3A1E" },
        { t: "Leite", nota: "Gelado, cremoso", y: 0.75, x: 0.35, lado: "l", cor: "#F3EFE8" },
        { t: "Creme de avelã", nota: "No fundo do copo", y: 0.96, x: 0.55, lado: "r", cor: "#7A4426" }
      ]
    },
    {
      id: "latte-vietnamita",
      categoria: "lattes",
      foto: "img/latte-vietnamita.webp",
      escala: 0.95,
      preco: 16.00,
      fundo: { topo: "#E3CDAE", base: "#FFFAF0", luz: "#9A6236" },
      efeito: [
        { tipo: "gotas", cores: ["#FFF6E0", "#F6E6C2", "#FFFFFF"], n: 14 },
        { tipo: "brilho-dourado", cores: ["#F2C14E", "#FFE29A"], n: 8 }
      ],
      nome: [
        { t: "Latte", font: "'Be Vietnam Pro', system-ui, sans-serif", weight: 500, color: "#4A3426", size: 0.45 },
        { t: "Vietnamita", font: "'Be Vietnam Pro', system-ui, sans-serif", weight: 800, color: "#B3261E", size: 0.82, shadow: "2px 2px 0 #F2C14E" }
      ],
      frase: "Iced latte adoçado com leite condensado, do jeito vietnamita.",
      ingredientes: ["Espresso", "Leite", "Leite condensado", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.05, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Por cima, forte", y: 0.2, x: 0.3, lado: "l", cor: "#3A1A0C" },
        { t: "Leite", nota: "Gelado", y: 0.55, x: 0.64, lado: "r", cor: "#F6F2EA" },
        { t: "Leite condensado", nota: "No fundo, adoça tudo", y: 0.88, x: 0.35, lado: "l", cor: "#FFF1D0" }
      ]
    },
    {
      id: "vietnamita-chocolate",
      categoria: "lattes",
      foto: "img/vietnamita-chocolate.webp",
      escala: 0.92,
      preco: 17.00,
      fundo: { topo: "#8E5E48", base: "#F8EFE8", luz: "#5A3424" },
      efeito: [
        { tipo: "gotas", cores: ["#FFF6E0", "#5A3424", "#8A5A3A"], n: 16 },
        { tipo: "po", cores: ["#3A1D10", "#8A5A3A"], n: 22 }
      ],
      nome: [
        { t: "Vietnamita", font: "'Be Vietnam Pro', system-ui, sans-serif", weight: 800, color: "#5A2E1A", size: 0.82, shadow: "2px 2px 0 #F3DCC8" },
        { t: "com chocolate", font: "'Be Vietnam Pro', system-ui, sans-serif", weight: 500, color: "#8A5A3A", size: 0.4 }
      ],
      frase: "Leite condensado, leite com chocolate, leite e espresso.",
      ingredientes: ["Leite condensado", "Leite com chocolate", "Leite", "Espresso", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.05, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Leite com chocolate", nota: "A camada de cima", y: 0.28, x: 0.3, lado: "l", cor: "#6B4436" },
        { t: "Espresso", nota: "Misturado ao chocolate", y: 0.5, x: 0.64, lado: "r", cor: "#4A2A1A" },
        { t: "Leite", nota: "Escorrendo pelo copo", y: 0.72, x: 0.3, lado: "l", cor: "#F4F0EA" },
        { t: "Leite condensado", nota: "No fundo, bem docinho", y: 0.92, x: 0.55, lado: "r", cor: "#FFF3D6" }
      ]
    },

    {
      id: "strawberry-latte",
      categoria: "lattes",
      foto: "img/strawberry-latte.webp",
      escala: 0.92,
      preco: 18.00,
      fundo: { topo: "#F3C3BD", base: "#FFF6F2", luz: "#E2505A" },
      efeito: [
        { tipo: "morangos", cores: ["#E2414F", "#D23A4A", "#F0606B"] },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 10 }
      ],
      nome: [
        { t: "Strawberry", font: "'Baloo 2', system-ui, sans-serif", weight: 800, color: "#D23A4A", size: 0.85, shadow: "3px 3px 0 #FFE3E3" },
        { t: "Latte", font: "'Baloo 2', system-ui, sans-serif", weight: 800, color: "#6B3A2A", size: 0.5 }
      ],
      frase: "Iced latte com geleia de morango no fundo.",
      ingredientes: ["Geleia de morango", "Espresso", "Leite", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Escorrendo pelo leite", y: 0.32, x: 0.3, lado: "l", cor: "#B07A3A" },
        { t: "Leite", nota: "Gelado e cremoso", y: 0.55, x: 0.64, lado: "r", cor: "#FFFFFF" },
        { t: "Geleia de morango", nota: "Na base, com pedacinhos", y: 0.85, x: 0.35, lado: "l", cor: "#C8283A" }
      ]
    },
    {
      id: "lady-latte",
      categoria: "lattes",
      foto: "img/lady-latte.webp",
      escala: 0.95,
      // homenagem: aparece no lugar da categoria e num cartãozinho ao tocar em "A história deste latte"
      homenagem: {
        tag: "Para Priscila Tostes",
        titulo: "Para Priscila",
        texto: [
          "O My Lady Latte nasceu de uma homenagem à minha prima Priscila Tostes, escritora de <em>Filha da Alquimia</em>, que sempre esteve presente aqui no café.",
          "Se ela fosse uma bebida da casa, seria esta: doce, de morango e fofa."
        ],
        assinatura: "Com carinho, Fabrício"
      },
      preco: 22.00,
      fundo: { topo: "#F8C4D2", base: "#FFF5F8", luz: "#F28BA8" },
      efeito: [
        { tipo: "lacos", cores: ["#F48FB1", "#F8BBD0", "#E05A8A"] },
        { tipo: "coracoes", cores: ["#F4AEB8", "#FFFFFF", "#E57E8E"], n: 12 },
        { tipo: "brilhinhos", cores: ["#FFFFFF", "#FFD1E6", "#F7D486"], n: 16 }
      ],
      nome: [
        { t: "My Lady", font: "'Imperial Script', cursive", color: "#D6336C", size: 1.3, shadow: "0 2px 0 #FFFFFF, 0 6px 18px rgba(214,51,108,.25)", enfeite: "laco" },
        { t: "Latte", font: "'Cormorant Garamond', Georgia, serif", weight: 700, color: "#8A2B48", size: 0.3, ls: "0.42em", caps: true }
      ],
      frase: "Geleia de morango, chocolate branco, creme de morango e chantilly com morango desidratado.",
      ingredientes: ["Geleia de morango", "Chocolate branco", "Creme de morango", "Leite", "Chantilly", "Morango desidratado"],
      anatomia: [
        { t: "Morango desidratado", nota: "Picadinho por cima", y: 0.05, x: 0.6, lado: "r", cor: "#E2505A" },
        { t: "Chantilly", nota: "Rosinha e fofinho", y: 0.1, x: 0.35, lado: "l", cor: "#FFD6DE" },
        { t: "Creme de morango", nota: "Deixa tudo cor-de-rosa", y: 0.42, x: 0.64, lado: "r", cor: "#F4A5B5" },
        { t: "Chocolate branco", nota: "Cremoso, no meio", y: 0.68, x: 0.32, lado: "l", cor: "#FFF6E6" },
        { t: "Geleia de morango", nota: "No fundo do copo", y: 0.93, x: 0.55, lado: "r", cor: "#C8283A" }
      ]
    },

    /* ---------------- MATCHÁS ---------------- */
    {
      id: "matcha-latte",
      categoria: "matchas",
      foto: "img/matcha-latte.webp",
      escala: 0.82,
      preco: 18.00,
      fundo: { topo: "#CFE0B6", base: "#F2F6EA", luz: "#8DB25E" },
      efeito: [
        { tipo: "folhas", cores: ["#6E9A3C", "#8DB25E", "#4F7A2A", "#A9C77B"] },
        { tipo: "floquinhos", cores: ["#FFFFFF"] },
        { tipo: "po", cores: ["#7FA34E", "#A9C77B"], n: 30 }
      ],
      nome: [
        { t: "Matcha Latte", font: "'Shippori Mincho', Georgia, serif", weight: 700, color: "#2F3B2A", size: 0.92 }
      ],
      frase: "Matcha e leite gelado, leve e equilibrado.",
      ingredientes: ["Matcha", "Leite", "Gelo"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Gelo", nota: "Aparecendo no topo", y: 0.08, x: 0.45, lado: "r", cor: "#E3F0E6" },
        { t: "Matcha", nota: "A camada verde", y: 0.36, x: 0.28, lado: "l", cor: "#4E7A2A" },
        { t: "Leite", nota: "A base branquinha", y: 0.8, x: 0.62, lado: "r", cor: "#F6F3EA" }
      ]
    },
    {
      id: "matchantilly",
      categoria: "matchas",
      foto: "img/matchantilly.webp",
      escala: 1,
      preco: 19.00,
      fundo: { topo: "#DCE9C6", base: "#F8FAF2", luz: "#B4D28A" },
      efeito: [
        { tipo: "folhas", cores: ["#6E9A3C", "#8DB25E", "#A9C77B"], n: 11 },
        { tipo: "neve", cores: ["#FFFFFF", "#F4F8EA"], n: 26 },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 12 }
      ],
      nome: [
        { t: "Matchantilly", font: "'Cherry Bomb One', system-ui, sans-serif", color: "#567A2A", size: 0.95, shadow: "2px 2px 0 #FFFFFF" }
      ],
      frase: "Matcha cremoso com baunilha, coberto de chantilly.",
      ingredientes: ["Matcha", "Leite", "Baunilha", "Chantilly"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Chantilly", nota: "Polvilhado de matcha", y: 0.14, x: 0.36, lado: "l", cor: "#FFFFFF" },
        { t: "Matcha", nota: "Batido e cremoso", y: 0.45, x: 0.66, lado: "r", cor: "#8DB25E" },
        { t: "Leite", nota: "Deixa tudo clarinho", y: 0.68, x: 0.28, lado: "l", cor: "#DDE8C8" },
        { t: "Baunilha", nota: "Um toque suave", y: 0.88, x: 0.62, lado: "r", cor: "#F3E6C4" }
      ]
    },
    {
      id: "strawberry-matcha-latte",
      categoria: "matchas",
      foto: "img/strawberry-matcha-latte.webp",
      escala: 0.88,
      preco: 20.00,
      fundo: { topo: "#F5CACB", base: "#FFF4F1", luz: "#EC8E9A" },
      efeito: [
        { tipo: "coracoes", cores: ["#E57E8E", "#F4AEB8", "#C9566B", "#FFFFFF"], n: 16 },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 12 }
      ],
      nome: [
        { t: "Strawberry", font: "'Fraunces', Georgia, serif", weight: 600, color: "#3F5A22", size: 0.95 },
        { t: "Matcha Latte", font: "'Pinyon Script', cursive", color: "#A23B52", size: 0.72, overlap: true }
      ],
      frase: "Geleia de morango, leite e matcha em três camadas.",
      ingredientes: ["Geleia de morango", "Leite", "Matcha", "Gelo"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Gelo", nota: "No topo, com matcha", y: 0.06, x: 0.55, lado: "r", cor: "#E3F0E6" },
        { t: "Matcha", nota: "A camada verde", y: 0.38, x: 0.28, lado: "l", cor: "#4E7A2A" },
        { t: "Leite", nota: "O meio branquinho", y: 0.63, x: 0.66, lado: "r", cor: "#FFFFFF" },
        { t: "Geleia de morango", nota: "No fundo, com pedacinhos", y: 0.87, x: 0.3, lado: "l", cor: "#D8323A" }
      ]
    },
    {
      id: "pink-girl-matcha",
      categoria: "matchas",
      foto: "img/pink-girl-matcha.webp",
      escala: 0.86,
      preco: 20.00,
      fundo: { topo: "#FAC7DE", base: "#FFF5FA", luz: "#F57DB8" },
      efeito: [
        { tipo: "sakura", cores: ["#FFC1D9", "#FFD6E5", "#F7A8C4", "#FFFFFF"] },
        { tipo: "brilhinhos", cores: ["#FFFFFF", "#FF9CCB", "#F7D486"], n: 18 },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 10 }
      ],
      nome: [
        { t: "Pink Girl", font: "'Pacifico', cursive", color: "#C92A76", size: 0.95, shadow: "2px 2px 0 #FFFFFF" },
        { t: "Matcha", font: "'Pacifico', cursive", color: "#3F5A22", size: 0.5 }
      ],
      frase: "Chocolate de morango, leite e matcha, doce e divertido.",
      ingredientes: ["Chocolate de morango", "Leite", "Matcha"],
      // anatomia: y e x = ponto no copo (0 a 1, de cima para baixo / da esquerda para a direita), lado da etiqueta, cor da camada
      anatomia: [
        { t: "Matcha", nota: "Por cima de tudo", y: 0.3, x: 0.3, lado: "l", cor: "#3F7A2A" },
        { t: "Leite", nota: "O meio cremoso", y: 0.58, x: 0.66, lado: "r", cor: "#F4F1EC" },
        { t: "Chocolate de morango", nota: "A base rosa", y: 0.85, x: 0.32, lado: "l", cor: "#E06A9A" }
      ]
    },
    {
      id: "vanilla-matcha",
      categoria: "matchas",
      foto: "img/vanilla-matcha.webp",
      escala: 0.86,
      preco: 19.00,
      fundo: { topo: "#D9E4C0", base: "#FBF9F0", luz: "#C3D795" },
      efeito: [
        { tipo: "po", cores: ["#2B1A10", "#4A2E1A"], n: 26 },
        { tipo: "brilho-dourado", cores: ["#FFF1C4", "#F6E6A8"], n: 8 },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 12 }
      ],
      nome: [
        { t: "Vanilla", font: "'Dancing Script', cursive", weight: 700, color: "#8C7A34", size: 1 },
        { t: "Matcha", font: "'Shippori Mincho', Georgia, serif", weight: 700, color: "#2F3B2A", size: 0.6 }
      ],
      frase: "Matcha sobre leite gelado com baunilha.",
      ingredientes: ["Matcha", "Leite", "Xarope de baunilha", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Aparecendo no topo", y: 0.06, x: 0.5, lado: "r", cor: "#E3F0E6" },
        { t: "Matcha", nota: "A camada verde", y: 0.32, x: 0.3, lado: "l", cor: "#7FA34E" },
        { t: "Xarope de baunilha", nota: "Perfuma o leite", y: 0.6, x: 0.66, lado: "r", cor: "#EFCF7E" },
        { t: "Leite", nota: "A base cremosa", y: 0.82, x: 0.32, lado: "l", cor: "#F4EEDC" }
      ]
    },
    {
      id: "mango-matcha",
      categoria: "matchas",
      foto: "img/mango-matcha.webp",
      escala: 0.88,
      preco: 20.00,
      fundo: { topo: "#F8D27C", base: "#FFF8E8", luz: "#F5A623" },
      efeito: [
        { tipo: "brilho-dourado", cores: ["#FFC94D", "#FFA62B", "#FFE7A6"], n: 16 },
        { tipo: "floquinhos", cores: ["#FFFFFF"], n: 12 }
      ],
      nome: [
        { t: "Mango", font: "'Paytone One', system-ui, sans-serif", color: "#E8861A", size: 1.05, shadow: "3px 3px 0 #FFFFFF" },
        { t: "Matcha", font: "'Paytone One', system-ui, sans-serif", color: "#3F5A22", size: 0.5 }
      ],
      frase: "Manga, leite e matcha em três camadas. Tropical e refrescante.",
      ingredientes: ["Purê de manga", "Leite", "Matcha", "Gelo"],
      anatomia: [
        { t: "Matcha", nota: "Por cima de tudo", y: 0.28, x: 0.3, lado: "l", cor: "#3F7A2A" },
        { t: "Gelo", nota: "No topo, com o matcha", y: 0.2, x: 0.66, lado: "r", cor: "#E3F0E6" },
        { t: "Leite", nota: "O meio branquinho", y: 0.55, x: 0.66, lado: "r", cor: "#F4F1EC" },
        { t: "Purê de manga", nota: "A base, com pedacinhos", y: 0.85, x: 0.32, lado: "l", cor: "#F5A623" }
      ]
    },

    /* ---------------- COFFEES (sem leite) ---------------- */
    {
      id: "iced-americano",
      categoria: "coffees",
      foto: "img/iced-americano.webp",
      escala: 0.95,
      preco: 12.00,
      opcoes: { nome: "Açúcar", valores: ["Sem açúcar", "Com açúcar"] },
      fundo: { topo: "#3E281B", base: "#140C08", luz: "#8F5A34", escuro: true },
      efeito: { tipo: "graos", cores: ["#A0704A", "#8A5A3A", "#C08A5E"] },
      nome: [
        { t: "Iced", font: "'Bebas Neue', Impact, sans-serif", color: "#D9A86C", size: 0.5 },
        { t: "Americano", font: "'Bebas Neue', Impact, sans-serif", color: "#F3E6D6", size: 1.2 }
      ],
      frase: "Espresso, água gelada e gelo. Simples e refrescante.",
      ingredientes: ["Espresso", "Água", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Dose cheia", y: 0.4, x: 0.3, lado: "l", cor: "#5A2E14" },
        { t: "Água", nota: "Gelada, alonga o café", y: 0.78, x: 0.62, lado: "r", cor: "#B98B62" }
      ]
    },
    {
      id: "espanhol",
      categoria: "coffees",
      foto: "img/espanhol.webp",
      escala: 0.88,
      preco: 12.00,
      fundo: { topo: "#E6C49A", base: "#FBF2E6", luz: "#C98A4E" },
      efeito: { tipo: "po", cores: ["#FFFFFF", "#F6E3BF", "#E8C48C"] },
      nome: [
        { t: "Espanhol", font: "'Lobster', cursive", color: "#A3361B", size: 1.05, shadow: "2px 2px 0 #F2C46B" }
      ],
      frase: "Americano batido com açúcar até virar creme.",
      ingredientes: ["Espresso", "Açúcar", "Água", "Gelo"],
      anatomia: [
        { t: "Espuma", nota: "Do café batido com açúcar", y: 0.07, x: 0.5, lado: "r", cor: "#C9A272" },
        { t: "Açúcar", nota: "Bate junto e vira creme", y: 0.22, x: 0.3, lado: "l", cor: "#FFFFFF" },
        { t: "Espresso", nota: "Batido até espumar", y: 0.45, x: 0.3, lado: "l", cor: "#3A1A0C" },
        { t: "Gelo", nota: "Pedrinhas no meio", y: 0.55, x: 0.68, lado: "r", cor: "#DDEBF1" },
        { t: "Água", nota: "Gelada, na base", y: 0.84, x: 0.62, lado: "r", cor: "#B98B62" }
      ]
    },
    {
      id: "long-black",
      categoria: "coffees",
      foto: "img/long-black.webp",
      escala: 0.9,
      preco: 13.00,
      opcoes: { nome: "Açúcar", valores: ["Sem açúcar", "Com açúcar"] },
      fundo: { topo: "#21170F", base: "#070504", luz: "#7A3A20", escuro: true },
      efeito: { tipo: "po", cores: ["#D9A86C", "#F2D3A2", "#B07A45"] },
      nome: [
        { t: "Long Black", font: "'Syne', system-ui, sans-serif", weight: 800, color: "#F3E6D6", size: 0.86, shadow: "3px 3px 0 #6B1E1E" }
      ],
      frase: "Espresso duplo sobre água gelada. Mais intenso, com a crema por cima.",
      ingredientes: ["Espresso duplo", "Água", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Por cima", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso duplo", nota: "Dois shots, mais intenso", y: 0.36, x: 0.3, lado: "l", cor: "#3A1A0C" },
        { t: "Água", nota: "Vai primeiro no copo", y: 0.78, x: 0.62, lado: "r", cor: "#B98B62" }
      ]
    },
    {
      id: "espresso-tonica",
      categoria: "coffees",
      foto: "img/espresso-tonica.webp",
      escala: 0.92,
      preco: 14.00,
      opcoes: { nome: "Açúcar", valores: ["Sem açúcar", "Com açúcar"] },
      fundo: { topo: "#2C2A25", base: "#0E0D0B", luz: "#C98A3E", escuro: true },
      efeito: { tipo: "bolhas", cores: ["#FFFFFF", "#F6DFA8"] },
      nome: [
        { t: "Espresso", font: "'Unbounded', system-ui, sans-serif", weight: 700, color: "#F3E6D6", size: 0.6 },
        { t: "Tônica", font: "'Unbounded', system-ui, sans-serif", weight: 300, color: "#F2C46B", size: 0.95 }
      ],
      frase: "Espresso sobre água tônica gelada, com laranja.",
      ingredientes: ["Água tônica", "Gelo", "Espresso", "Rodela de laranja"],
      anatomia: [
        { t: "Gelo", nota: "Segurando o espresso", y: 0.07, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "Flutuando por cima", y: 0.3, x: 0.3, lado: "l", cor: "#3A1A0C" },
        { t: "Rodela de laranja", nota: "Dentro do copo", y: 0.62, x: 0.55, lado: "r", cor: "#F29A2E" },
        { t: "Água tônica", nota: "Na base, borbulhando", y: 0.9, x: 0.35, lado: "l", cor: "#EFE3C4" }
      ]
    },
    {
      id: "espresso-cola",
      categoria: "coffees",
      foto: "img/espresso-cola.webp",
      escala: 0.95,
      preco: 16.00,
      fundo: { topo: "#3E0D11", base: "#120406", luz: "#B3121C", escuro: true },
      efeito: { tipo: "bolhas", cores: ["#FFFFFF", "#FFD9D9"] },
      nome: [
        { t: "Espresso", font: "'Archivo Black', system-ui, sans-serif", color: "#F3E6D6", size: 0.42 },
        { t: "Cola", font: "'Yellowtail', cursive", color: "#FFFFFF", size: 1.35, shadow: "2px 3px 0 #C8102E" }
      ],
      frase: "Espresso sobre Coca-Cola gelada. Doce, gasoso e intenso.",
      ingredientes: ["Espresso", "Gelo", "Coca-Cola"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.07, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Espresso", nota: "A crema dourada por cima", y: 0.22, x: 0.3, lado: "l", cor: "#C98A3E" },
        { t: "Coca-Cola", nota: "Gelada, com gás", y: 0.65, x: 0.62, lado: "r", cor: "#2A0E08" }
      ]
    },
    {
      id: "orange-americano",
      categoria: "coffees",
      foto: "img/orange-americano.webp",
      escala: 1,
      preco: 16.00,
      fundo: { topo: "#F6B56E", base: "#FFF3E4", luz: "#F28A28" },
      efeito: { tipo: "brilho-dourado", cores: ["#FFC27A", "#FF9E3D", "#FFE3B8"] },
      nome: [
        { t: "Orange", font: "'Shrikhand', Georgia, serif", color: "#E8731E", size: 1.05, shadow: "2px 2px 0 #FFFFFF" },
        { t: "Americano", font: "'Shrikhand', Georgia, serif", color: "#5A2E1A", size: 0.5 }
      ],
      frase: "Suco de laranja com espresso por cima. Cítrico e refrescante.",
      ingredientes: ["Suco de laranja", "Gelo", "Espresso", "Rodela de laranja"],
      anatomia: [
        { t: "Rodela de laranja", nota: "Enfeitando o topo", y: 0.05, x: 0.62, lado: "r", cor: "#F29A2E" },
        { t: "Espresso", nota: "Escurinho, por cima", y: 0.35, x: 0.3, lado: "l", cor: "#3A1A0C" },
        { t: "Gelo", nota: "Entre as camadas", y: 0.55, x: 0.66, lado: "r", cor: "#DDEBF1" },
        { t: "Suco de laranja", nota: "Na base, docinho", y: 0.84, x: 0.35, lado: "l", cor: "#FFA62B" }
      ]
    },
    /* ---------------- CHAI ---------------- */
    {
      id: "chai-latte",
      categoria: "chai",
      foto: "img/chai-latte.webp",
      escala: 0.9,
      preco: 18.00,
      fundo: { topo: "#EBC79C", base: "#FFF5E8", luz: "#D99A5B" },
      efeito: [
        { tipo: "especiarias", cores: ["#8A4A1E", "#A0602E", "#6E8F3E"] },
        { tipo: "po", cores: ["#B5752E", "#8A4A1E"], n: 24 }
      ],
      nome: [
        { t: "Chai", font: "'Yeseva One', Georgia, serif", color: "#8A4A1E", size: 1.15, shadow: "2px 2px 0 #FFE9CC" },
        { t: "Latte", font: "'Yeseva One', Georgia, serif", color: "#4A3426", size: 0.5 }
      ],
      frase: "Chá chai com especiarias e leite gelado.",
      ingredientes: ["Chá chai", "Leite", "Gelo"],
      anatomia: [
        { t: "Gelo", nota: "Cubos até a boca", y: 0.08, x: 0.5, lado: "r", cor: "#DDEBF1" },
        { t: "Chá chai", nota: "Canela, cravo, cardamomo e gengibre", y: 0.38, x: 0.32, lado: "l", cor: "#C08A55" },
        { t: "Leite", nota: "Gelado e cremoso", y: 0.75, x: 0.62, lado: "r", cor: "#F1E4CF" }
      ]
    },
    {
      id: "cream-chai-latte",
      categoria: "chai",
      foto: "img/cream-chai-latte.webp",
      escala: 0.9,
      preco: 20.00,
      fundo: { topo: "#F0DDC4", base: "#FFFBF4", luz: "#E2B888" },
      efeito: [
        { tipo: "neve", cores: ["#FFFFFF", "#FFF6EA"], n: 26 },
        { tipo: "po", cores: ["#9A5A2A", "#B5752E"], n: 30 },
        { tipo: "especiarias", cores: ["#8A4A1E", "#A0602E"], n: 5 }
      ],
      nome: [
        { t: "Cream", font: "'Cookie', cursive", color: "#B5651D", size: 1.15 },
        { t: "Chai Latte", font: "'Yeseva One', Georgia, serif", color: "#4A3426", size: 0.48, overlap: true }
      ],
      frase: "Chai latte gelado com creme e canela por cima.",
      ingredientes: ["Chá chai", "Leite", "Creme", "Canela", "Gelo"],
      anatomia: [
        { t: "Canela", nota: "Polvilhada por cima", y: 0.04, x: 0.55, lado: "r", cor: "#9A5A2A" },
        { t: "Creme", nota: "Macio, no topo", y: 0.16, x: 0.3, lado: "l", cor: "#FFFFFF" },
        { t: "Chá chai", nota: "Com especiarias", y: 0.45, x: 0.62, lado: "r", cor: "#B07A4A" },
        { t: "Leite", nota: "Gelado, na base", y: 0.8, x: 0.35, lado: "l", cor: "#F6F0E4" }
      ]
    },
    {
      id: "chocochai-latte",
      categoria: "chai",
      foto: "img/chocochai-latte.webp",
      escala: 0.95,
      preco: 20.00,
      fundo: { topo: "#4A2A1C", base: "#1A0E09", luz: "#9A5A30", escuro: true },
      efeito: [
        { tipo: "especiarias", cores: ["#C98B5A", "#E0A877", "#9DB07A"], n: 9 },
        { tipo: "po", cores: ["#E8C3A0", "#C98B5A"], n: 34 }
      ],
      nome: [
        { t: "Chocochai", font: "'Lilita One', system-ui, sans-serif", color: "#F3E2CF", size: 0.95, shadow: "3px 3px 0 #8A3A1E" },
        { t: "Latte", font: "'Lilita One', system-ui, sans-serif", color: "#E3A877", size: 0.5 }
      ],
      frase: "Chai latte com chocolate meio amargo.",
      ingredientes: ["Chá chai", "Leite", "Chocolate meio amargo", "Gelo"],
      anatomia: [
        { t: "Chocolate meio amargo", nota: "Em raspas e cacau por cima", y: 0.05, x: 0.55, lado: "r", cor: "#3A1D10" },
        { t: "Leite", nota: "Espuma cremosa", y: 0.22, x: 0.3, lado: "l", cor: "#F3E6C8" },
        { t: "Chá chai", nota: "Com especiarias", y: 0.5, x: 0.62, lado: "r", cor: "#A8743F" },
        { t: "Gelo", nota: "No meio da bebida", y: 0.68, x: 0.3, lado: "l", cor: "#DDEBF1" },
        { t: "Chocolate", nota: "Também no fundo do copo", y: 0.93, x: 0.6, lado: "r", cor: "#2A140A" }
      ]
    }

  ]
};
