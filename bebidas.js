/* =====================================================================
   TOSTES&CO — Cafés Gelados
   Todas as bebidas ficam neste arquivo.

   Para mudar preço, frase ou ingredientes: edite o objeto da bebida.
   Para incluir uma bebida nova: copie um objeto de BEBIDAS, troque o id,
   a categoria ("lattes" | "matchas" | "coffees" | "chai") e o desenho.

   Campos de cada bebida
   - id           identificador (mesmo nome da foto em referencias/)
   - categoria    id da categoria
   - nome         nome em texto simples (leitores de tela)
   - linhas       nome desenhado na tela: uma ou mais linhas
                  { t, fonte, cor, tam, peso, contorno, sombra, espaco }
                  (o que faltar em uma linha vem de "fonte" e "cor" abaixo)
   - fonte, cor  fonte e cor padrão do nome
   - preco        número em reais
   - frase        frase curta
   - ingredientes lista (aparece separada por " · ")
   - fundo        ajuste de tom sobre o fundo da categoria:
                  lista de manchas { cor, x, y, r, a } (x/y/r em %, a = 0..1)
   - acucar       regra do seletor de açúcar (documentação; o desenho recebe
                  o nível a = 0 "0 açúcar", 1 "Neutro", 2 "Doce")
   - svg          função (a) => desenho do copo em SVG
   ===================================================================== */

const CATEGORIAS = [
  { id: 'lattes',  rotulo: 'Lattes' },
  { id: 'matchas', rotulo: 'Matchás' },
  { id: 'coffees', rotulo: 'Coffees' },
  { id: 'chai',    rotulo: 'Chai' }
];

/* ---------------------------------------------------------------------
   Peças de desenho compartilhadas (todos os copos têm o mesmo formato)
   --------------------------------------------------------------------- */
const INK = '#4A3426';                       // contorno marrom terra
const P_COPO = 'M40 112 L160 112 L142 310 Q141.5 318 133 318 L67 318 Q58.5 318 58 310 Z';

function rnd(s) { s = Math.sin(s * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

/* gelo: cubo translúcido que balança no idle */
function gelo(x, y, s = 36, rot = 0, d = 0) {
  const h = s / 2;
  return `<g transform="translate(${x} ${y})"><g class="bob" style="--d:${d}s"><g transform="rotate(${rot})">
    <rect x="${-h}" y="${-h}" width="${s}" height="${s * .92}" rx="${s * .18}" fill="rgba(255,255,255,.5)" stroke="${INK}" stroke-width="3"/>
    <rect x="${-h + s * .15}" y="${-h + s * .15}" width="${s * .7}" height="${s * .58}" rx="${s * .1}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="2"/>
    <path d="M${-h + s * .22} ${-h + s * .32} l${s * .14} ${-s * .1}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  </g></g></g>`;
}

/* condensação: gotas no copo, aparecem e escorrem devagar */
const GOTAS = [[70, 165, 2.8], [129, 196, 3.2], [79, 238, 2.4], [123, 148, 2.2], [112, 262, 3.4], [86, 288, 2.6], [134, 236, 2.4], [96, 205, 2]];
function condensacao(op) {
  return `<g style="opacity:${op}">` + GOTAS.map(([x, y, r], i) =>
    `<g class="gota" style="--d:${(i * 1.7) % 9}s"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.35}" fill="#fff" fill-opacity=".5" stroke="#fff" stroke-opacity=".9" stroke-width=".8"/><circle cx="${x - r * .3}" cy="${y - r * .5}" r="${r * .3}" fill="#fff"/></g>`
  ).join('') + '</g>';
}

/* copo: monta o SVG. Camadas, de trás para frente:
   atras → vidro → dentro (recortado no copo) → contorno → fora → topo → frente */
function copo({ dentro = '', fora = '', topo = '', frente = '', atras = '', defs = '', cond = .8 } = {}) {
  return `<svg class="copo" viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="cc"><path d="${P_COPO}"/></clipPath>
    <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
    ${defs}
  </defs>
  <ellipse cx="100" cy="327" rx="54" ry="6" fill="${INK}" opacity=".16"/>
  ${atras}
  <path d="${P_COPO}" fill="rgba(255,255,255,.3)"/>
  <g clip-path="url(#cc)">
    ${dentro}
    <rect x="30" y="112" width="140" height="210" fill="url(#sh)"/>
    ${condensacao(cond)}
    <path d="M50 134 L65 290" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M52 296 L54 304" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M149 150 L143 235" stroke="#fff" stroke-opacity=".32" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M58 304 Q100 313 142 304" stroke="${INK}" stroke-opacity=".28" stroke-width="2" fill="none"/>
  </g>
  <path d="${P_COPO}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <rect x="36" y="107" width="128" height="9" rx="4.5" fill="rgba(255,255,255,.55)" stroke="${INK}" stroke-width="3.5"/>
  ${fora}${topo}${frente}
</svg>`;
}

/* copo vazio em traço (categoria sem bebidas) */
function copoVazio() {
  return `<svg class="copo" viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <ellipse cx="100" cy="327" rx="54" ry="6" fill="${INK}" opacity=".1"/>
  <path d="${P_COPO}" fill="rgba(255,255,255,.18)" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-dasharray="9 8" stroke-opacity=".7"/>
  <rect x="36" y="107" width="128" height="9" rx="4.5" fill="none" stroke="${INK}" stroke-width="3.5" stroke-dasharray="9 8" stroke-opacity=".7"/>
  <path d="M50 134 L65 290" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

/* chantilly em espiral: 4 camadas + pico. `extra` é desenhado por cima,
   recortado no formato do chantilly (caldas, grades, etc.) */
const tiers = k => [[104, 67, 17], [104 - 18 * k, 55, 16], [104 - 35 * k, 42, 15], [104 - 50 * k, 29, 13]];
function chantilly({ alto = 1, cor = '#FFFBF0', extra = '' } = {}) {
  const T = tiers(alto), c4 = T[3][0];
  const peak = `M76 ${c4 + 2} C76 ${c4 - 12} 96 ${c4 - 12} 100 ${c4 - 28} C106 ${c4 - 14} 124 ${c4 - 12} 124 ${c4 + 2} Z`;
  let s = '';
  T.forEach(([cy, rx, ry]) => {
    s += `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cor}" stroke="${INK}" stroke-width="3.5"/>`;
    s += `<path d="M${100 - rx * .78} ${cy + ry * .3} Q100 ${cy + ry * 1.12} ${100 + rx * .78} ${cy + ry * .3}" fill="none" stroke="#E4D6BC" stroke-width="3" stroke-linecap="round"/>`;
  });
  s += `<path d="${peak}" fill="${cor}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const clip = `<clipPath id="chclip">${T.map(([cy, rx, ry]) => `<ellipse cx="100" cy="${cy}" rx="${rx - 2.5}" ry="${ry - 2.5}"/>`).join('')}<path d="${peak}" transform="translate(100 ${c4}) scale(.9) translate(-100 ${-c4})"/></clipPath>`;
  return `${clip}${s}<g clip-path="url(#chclip)">${extra}</g>`;
}

/* pozinho (cacau, matchá) espalhado sobre o chantilly */
function po(cor, n, seed, alto = 1) {
  const T = tiers(alto); let s = '';
  for (let i = 0; i < n; i++) {
    const [cy, rx, ry] = T[Math.floor(rnd(seed + i * 3.1) * T.length)];
    const a = rnd(seed + i * 7.7) * Math.PI * 2, r = Math.sqrt(rnd(seed + i * 1.9));
    s += `<circle cx="${(100 + Math.cos(a) * r * rx * .92).toFixed(1)}" cy="${(cy + Math.sin(a) * r * ry * .92).toFixed(1)}" r="${(.8 + rnd(seed + i * 5.3) * 1.2).toFixed(1)}" fill="${cor}"/>`;
  }
  return s;
}

/* zigue-zague de calda sobre cada camada do chantilly */
function zigue(cor, k, w = 3.2) {
  return tiers(k).slice(0, 3).map(([cy, rx, ry]) => {
    let d = '';
    const n = 8, step = (rx * 2) / n;
    for (let i = 0; i <= n; i++) d += `${i ? 'L' : 'M'}${(100 - rx + i * step).toFixed(1)} ${(cy + (i % 2 ? -ry * .75 : ry * .6)).toFixed(1)} `;
    return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join('');
}

/* bolhas leves (textura aerada) */
function bolhas(cor, n, seed, y0 = 125, y1 = 305, op = .4) {
  let s = '';
  for (let i = 0; i < n; i++)
    s += `<circle cx="${(48 + rnd(seed + i) * 104).toFixed(1)}" cy="${(y0 + rnd(seed + i * 2.3) * (y1 - y0)).toFixed(1)}" r="${(1.2 + rnd(seed + i * 4.1) * 2.6).toFixed(1)}" fill="${cor}" opacity="${op}"/>`;
  return s;
}

/* camada fina de xarope no fundo do copo (açúcar "Doce") */
const xarope = cor => `<path d="M30 303 Q55 297 80 303 T130 303 T170 303 V322 H30 Z" fill="${cor}" opacity=".9"/><path d="M42 301 Q60 298 78 301" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round"/>`;

/* coração em traço */
const coracao = (x, y, s, cor, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="cora" style="--d:${d}s"><path d="M0 7 C-15 -4 -11 -17 0 -9 C11 -17 15 -4 0 7 Z" fill="rgba(255,255,255,.4)" stroke="${cor}" stroke-width="${3.5 / s}" stroke-linejoin="round"/></g></g>`;

/* gota de calda/chocolate escorrendo do topo do copo */
const gotejo = (x, len, cor, brilho, d) => `<g class="balanca" style="--d:${d}s"><path d="M${x - 5} 116 H${x + 5} V${116 + len} a5 5 0 0 1 -10 0 Z" fill="${cor}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M${x - 2} 120 V${112 + len}" stroke="${brilho}" stroke-width="1.8" stroke-linecap="round"/></g>`;

/* ---------------------------------------------------------------------
   BEBIDAS
   --------------------------------------------------------------------- */
const BEBIDAS = [

  /* ============================ LATTES ============================ */
  {
    id: 'iced-latte',
    categoria: 'lattes',
    nome: 'Iced Latte',
    fonte: "'DM Serif Display', serif",
    cor: '#2F3B2A',
    linhas: [{ t: 'Iced Latte' }],
    preco: 14,
    frase: 'O clássico: espresso e leite gelado, simples e equilibrado.',
    ingredientes: ['Espresso', 'Leite', 'Gelo'],
    fundo: [{ cor: '#F5EDE1', x: 50, y: 42, r: 75, a: 1 }],
    acucar: 'Doce: camada fina e dourada de xarope no fundo. Neutro e 0 açúcar: fundo limpo.',
    svg: a => copo({
      cond: 1,
      dentro: `
        <rect x="30" y="122" width="140" height="200" fill="#F8EEDD"/>
        <path d="M30 122 H170 V135 Q130 142 100 134 T30 136 Z" fill="#EFDDC3" opacity=".7"/>
        <g class="mist" style="--d:0s"><path d="M62 122 C57 150 80 168 70 196 C63 222 88 244 80 282 L93 284 C99 246 77 226 85 198 C92 170 71 150 78 122 Z" fill="#7A4524" opacity=".92"/></g>
        <g class="mist" style="--d:-3s"><path d="M110 122 C119 146 100 170 112 194 C123 218 104 246 119 298 L131 293 C117 244 136 222 125 196 C115 168 134 146 126 122 Z" fill="#9A6035" opacity=".88"/></g>
        <g class="mist" style="--d:-6s"><path d="M88 128 C98 148 86 164 98 184 C104 200 94 214 100 236 L108 234 C104 214 114 200 108 184 C98 164 112 148 100 128 Z" fill="#C98E58" opacity=".8"/></g>
        <g class="mist" style="--d:-2s"><ellipse cx="72" cy="214" rx="13" ry="7" fill="#8A5230" opacity=".5"/><ellipse cx="124" cy="244" rx="14" ry="8" fill="#B07442" opacity=".5"/><ellipse cx="92" cy="268" rx="12" ry="6" fill="#6A3A1C" opacity=".45"/></g>
        ${a === 2 ? xarope('#DBA43A') : ''}`,
      topo: gelo(74, 108, 42, -12, 0) + gelo(117, 104, 44, 14, -1.6) + gelo(96, 126, 30, 24, -3)
    })
  },

  {
    id: 'caramelo-macchiato',
    categoria: 'lattes',
    nome: 'Caramelo Macchiato',
    fonte: "'Alfa Slab One', serif",
    cor: '#A0521D',
    linhas: [
      { t: 'Caramelo', cor: '#A0521D', contorno: '#4A3426', tam: 1 },
      { t: 'Macchiato', cor: '#4A3426', tam: .62 }
    ],
    preco: 18,
    frase: 'Caramelo e espresso em dose intensa, com baunilha e chantilly por cima.',
    ingredientes: ['Espresso', 'Caramelo', 'Baunilha', 'Chantilly'],
    fundo: [{ cor: '#F4D9B0', x: 50, y: 42, r: 80, a: 1 }],
    acucar: 'Doce: a grade de caramelo fica mais cheia. Os outros mudam só a etiqueta.',
    svg: a => {
      const sp = a === 2 ? 11 : 22;
      let grade = '';
      for (let x = -50; x < 200; x += sp) grade += `<path d="M${x} 18 L${x + 75} 124 M${x + 75} 18 L${x} 124" stroke="#C0701E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      return copo({
        cond: .8,
        dentro: `
          <rect x="30" y="122" width="140" height="200" fill="#F3E3C8"/>
          <path d="M44 170 C70 150 96 190 124 166 S156 176 164 164" stroke="#FBF1DD" stroke-width="12" fill="none" stroke-linecap="round" opacity=".75"/>
          <path d="M44 230 C70 214 96 250 124 228 S152 238 160 226" stroke="#FBF1DD" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M50 280 C76 266 100 296 130 276" stroke="#E9D3AE" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M30 122 H170 V145 Q150 154 130 145 T90 148 T50 145 Q38 150 30 146 Z" fill="#4A2A18"/>
          <path d="M44 128 H160" stroke="#6A3F26" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
          <path d="M52 146 C55 180 50 204 61 252" stroke="#C9731F" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M54 150 C57 180 53 202 62 246" stroke="#EDAE5A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M147 146 C145 172 151 192 141 226" stroke="#C9731F" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M145 150 C143 172 149 190 140 220" stroke="#EDAE5A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <path d="M92 148 C93 168 88 182 96 204" stroke="#C9731F" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path d="M93 151 C94 168 90 180 96 198" stroke="#EDAE5A" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M66 266 C86 258 108 276 132 262" stroke="#C9731F" stroke-width="6" fill="none" stroke-linecap="round"/>`,
        fora: `
          <path d="M33 112 Q32 128 37 133 Q42 128 41 112 Z" fill="#C9731F" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
          <g transform="translate(37.5 142)"><g class="queda"><path d="M0 -9 C5 -2 6 2 6 4 A6 6 0 1 1 -6 4 C-6 2 -5 -2 0 -9 Z" fill="#C9731F" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="-1.8" cy="3" r="1.6" fill="#F6C27A"/></g></g>`,
        topo: chantilly({ extra: grade + po('#8A4B22', 26, 3) })
      });
    }
  },

  /* ============================ COFFEES ============================ */
  {
    id: 'moka-tostes',
    categoria: 'coffees',
    nome: 'Moka Tostes',
    fonte: "'Abril Fatface', serif",
    cor: '#6B1E1E',
    linhas: [
      { t: 'Moka', cor: '#6B1E1E', contorno: '#F5EDE1', sombra: '0 3px 0 rgba(245,237,225,.35)', tam: 1.15 },
      { t: 'Tostes', fonte: "'Darumadrop One', cursive", cor: '#9DB387', sombra: '0 2px 0 rgba(0,0,0,.35)', tam: .62, espaco: '.06em' }
    ],
    preco: 17,
    frase: 'A moka da casa: espresso e chocolate com um toque de baunilha.',
    ingredientes: ['Espresso', 'Calda de chocolate', 'Baunilha', 'Chantilly', 'Cacau'],
    fundo: [{ cor: '#7A4A2C', x: 50, y: 40, r: 70, a: .55 }],
    acucar: 'Doce: entra mais um fio de calda no chantilly. Os outros mudam só a etiqueta.',
    svg: a => {
      let ondas = '';
      [140, 184, 228, 272, 316].forEach((y, i) => {
        const d = `M10 ${y} q16 -12 32 0 t32 0 t32 0 t32 0 t32 0 t32 0`;
        ondas += `<path d="${d}" fill="none" stroke="#3B2013" stroke-width="7" stroke-linecap="round"/><path d="M10 ${y - 2} q16 -12 32 0 t32 0 t32 0 t32 0 t32 0 t32 0" fill="none" stroke="#6B3F25" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`;
      });
      const fio = a === 2
        ? `<path d="M52 92 C70 76 92 98 114 80 S146 86 150 96" fill="none" stroke="#3B2013" stroke-width="3" stroke-linecap="round"/><path d="M84 56 C96 46 112 58 120 52" fill="none" stroke="#3B2013" stroke-width="2.8" stroke-linecap="round"/>`
        : '';
      return copo({
        cond: .8,
        dentro: `
          <rect x="30" y="122" width="140" height="200" fill="#B98E67"/>
          <path d="M30 122 H170 V130 Q130 138 100 130 T30 132 Z" fill="#D4B089" opacity=".8"/>
          ${bolhas('#E3C7A2', 38, 11, 126, 306, .5)}
          <g class="desce">${ondas}</g>`,
        topo: chantilly({ alto: 1.2, extra: po('#6B3A22', 46, 5, 1.2) + zigue('#3B2013', 1.2) + fio }),
        frente: `<g transform="translate(103 62) rotate(-16)"><rect x="-40" y="-3.6" width="78" height="7.2" rx="3.6" fill="#2B1A12" stroke="#1A0F0A" stroke-width="1"/><path d="M-34 -1.4 H28" stroke="#6B4A36" stroke-width="1.6" stroke-linecap="round"/><path d="M38 0 l9 -3.5 M38 0 l9 3.5" stroke="#2B1A12" stroke-width="2.2" stroke-linecap="round"/></g>`
      });
    }
  },

  {
    id: 'chococoffee',
    categoria: 'coffees',
    nome: 'Chococoffee',
    fonte: "'Sniglet', cursive",
    cor: '#5A3420',
    linhas: [{ t: 'Chococoffee', peso: 800, cor: '#5A3420', contorno: '#F5EDE1', sombra: '3px 4px 0 #C98B5A', tam: 1 }],
    preco: 18,
    frase: 'Chocolate cremoso e espresso, gelado, com chantilly e cacau por cima.',
    ingredientes: ['Leite', 'Creme de chocolate', 'Espresso', 'Chantilly', 'Cacau'],
    fundo: [{ cor: '#5A3322', x: 50, y: 40, r: 70, a: .6 }],
    acucar: 'Doce: aparece um fio extra de calda de chocolate no chantilly. Os outros mudam só a etiqueta.',
    svg: a => {
      const fio = a === 2
        ? `<path d="M48 90 C68 78 90 98 112 82 S144 90 152 98" fill="none" stroke="#3A1D10" stroke-width="3.2" stroke-linecap="round"/><path d="M86 62 C98 52 114 64 122 56" fill="none" stroke="#3A1D10" stroke-width="2.8" stroke-linecap="round"/>`
        : '';
      const cubo = (x, y, s, r, d) => `<g transform="translate(${x} ${y})"><g class="bob" style="--d:${d}s"><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s * .9}" rx="5" transform="rotate(${r})" fill="#9A6A4E" fill-opacity=".5" stroke="#C9A68C" stroke-opacity=".7" stroke-width="2"/></g></g>`;
      return copo({
        cond: .85,
        dentro: `
          <rect x="30" y="122" width="140" height="200" fill="#6A3F2B"/>
          ${cubo(78, 156, 30, -10, 0)}${cubo(122, 186, 28, 14, -2)}${cubo(84, 232, 30, 8, -4)}${cubo(124, 268, 26, -12, -1)}
          <path d="M30 120 H170 V133 Q150 142 130 133 T90 136 T50 133 Q40 138 30 136 Z" fill="#F3E6D2"/>
          <path d="M30 136 Q50 142 90 138 T170 134" stroke="#D9C3A2" stroke-width="2" fill="none" opacity=".7"/>
          <path d="M60 300 C84 292 110 306 140 296" stroke="#3F2214" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>`,
        fora: gotejo(52, 66, '#3A1D10', '#8A5638', 0) + gotejo(76, 38, '#3A1D10', '#8A5638', -1.2) + gotejo(126, 52, '#3A1D10', '#8A5638', -2.4) + gotejo(150, 74, '#3A1D10', '#8A5638', -.6),
        topo: chantilly({ alto: 1.15, extra: po('#6B3A22', 56, 9, 1.15) + fio }),
        frente: `
          <g transform="translate(80 60) rotate(-22)"><rect x="-14" y="-12" width="28" height="24" rx="3.5" fill="#4A2616" stroke="${INK}" stroke-width="2.6"/><path d="M0 -12 V12 M-14 0 H14" stroke="#7A4A30" stroke-width="1.6"/><path d="M-11 -8 H-3" stroke="#A8745A" stroke-width="1.6" stroke-linecap="round"/></g>
          <g transform="translate(124 66) rotate(18)"><rect x="-14" y="-12" width="28" height="24" rx="3.5" fill="#4A2616" stroke="${INK}" stroke-width="2.6"/><path d="M0 -12 V12 M-14 0 H14" stroke="#7A4A30" stroke-width="1.6"/><path d="M-11 -8 H-3" stroke="#A8745A" stroke-width="1.6" stroke-linecap="round"/></g>`
      });
    }
  },

  /* ============================ MATCHÁS ============================ */
  {
    id: 'matcha-latte',
    categoria: 'matchas',
    nome: 'Matcha Latte',
    fonte: "'Shippori Mincho', serif",
    cor: '#2F3B2A',
    linhas: [{ t: 'Matcha Latte', peso: 700, cor: '#2F3B2A' }],
    preco: 18,
    frase: 'Matchá e leite gelado, leve e equilibrado.',
    ingredientes: ['Matcha', 'Leite', 'Gelo'],
    fundo: [],
    acucar: 'Doce: aparece uma camada fina de xarope no fundo do copo.',
    svg: a => copo({
      cond: .85,
      dentro: `
        <rect x="30" y="122" width="140" height="200" fill="#FBF6EC"/>
        <path d="M30 122 H170 V200 Q150 208 130 200 T90 203 T50 200 Q40 204 30 202 Z" fill="#5F9230"/>
        <path d="M30 122 H170 V132 H30 Z" fill="#79A94A" opacity=".7"/>
        <g class="nuvem" style="--d:0s"><ellipse cx="72" cy="214" rx="26" ry="11" fill="#6FA13C" opacity=".6"/><ellipse cx="120" cy="222" rx="30" ry="12" fill="#7BAA45" opacity=".55"/><ellipse cx="96" cy="206" rx="22" ry="8" fill="#5F9230" opacity=".7"/></g>
        <g class="nuvem" style="--d:-3.5s"><ellipse cx="90" cy="218" rx="30" ry="10" fill="#7BAA45" opacity=".5"/><ellipse cx="132" cy="210" rx="18" ry="8" fill="#6FA13C" opacity=".6"/></g>
        ${a === 2 ? xarope('#E6C777') : ''}`,
      topo: gelo(76, 117, 36, -10, 0) + gelo(114, 115, 38, 12, -1.5) + gelo(96, 128, 26, 28, -3)
    })
  },

  {
    id: 'matchantilly',
    categoria: 'matchas',
    nome: 'Matchantilly',
    fonte: "'Cherry Bomb One', cursive",
    cor: '#6E9A3C',
    linhas: [{ t: 'Matchantilly', cor: '#6E9A3C', contorno: '#F5EDE1', sombra: '0 3px 0 rgba(47,59,42,.18)' }],
    preco: 19,
    frase: 'Matchá cremoso com baunilha, coberto de chantilly.',
    ingredientes: ['Matcha', 'Leite', 'Baunilha', 'Chantilly'],
    fundo: [{ cor: '#F2F1DC', x: 50, y: 40, r: 70, a: .9 }],
    acucar: 'Doce: aparece uma camada fina de xarope no fundo do copo.',
    svg: a => copo({
      cond: .8,
      dentro: `
        <rect x="30" y="122" width="140" height="200" fill="#B9D08B"/>
        <path d="M30 122 H170 V150 Q130 160 100 150 T30 152 Z" fill="#CBDDA0" opacity=".8"/>
        <path d="M46 190 C70 176 96 208 124 186 S152 196 162 184" stroke="#A6C078" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M46 250 C70 236 96 268 124 246 S152 256 160 244" stroke="#A6C078" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
        ${bolhas('#E4EFC8', 36, 21, 130, 304, .55)}
        ${a === 2 ? xarope('#E6C777') : ''}`,
      topo: chantilly({ alto: 1.2, extra: po('#6E9A3C', 62, 7, 1.2) + `<path d="M70 40 Q100 24 130 40" fill="none" stroke="#7DA043" stroke-width="5" stroke-linecap="round" opacity=".5"/>` })
        + `<g transform="translate(97 24) rotate(-22)"><path d="M0 0 C8 -11 22 -9 28 -2 C22 9 8 11 0 0 Z" fill="#8DB255" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M3 0 L23 -3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/></g>`
        + [78, 92, 106, 120, 86, 112].map((x, i) => `<circle class="po" style="--d:${i * 1.1}s" cx="${x}" cy="6" r="1.5" fill="#6E9A3C"/>`).join('')
    })
  },

  {
    id: 'strawberry-matcha-latte',
    categoria: 'matchas',
    nome: 'Strawberry Matcha Latte',
    fonte: "'Fraunces', serif",
    cor: '#4F6B2E',
    linhas: [
      { t: 'Strawberry', fonte: "'Fraunces', serif", peso: 700, cor: '#4F6B2E', tam: 1 },
      { t: 'Matcha Latte', fonte: "'Pinyon Script', cursive", peso: 400, cor: '#B2445F', tam: 1.05 }
    ],
    preco: 20,
    frase: 'Geleia de morango, leite e matchá em três camadas.',
    ingredientes: ['Geleia de morango', 'Leite', 'Matcha', 'Gelo'],
    fundo: [{ cor: '#F4B6C4', x: 12, y: 108, r: 55, a: .5 }],
    acucar: 'Já é doce: os três níveis mudam só a etiqueta.',
    svg: () => {
      const peca = (x, y, rx, ry, rot, cor, d) => `<g class="flutua" style="--d:${d}s"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${cor}"/></g>`;
      return copo({
        cond: .8,
        dentro: `
          <rect x="30" y="122" width="140" height="200" fill="#FCF7EF"/>
          <path d="M30 122 H170 V190 Q150 198 130 190 T90 193 T50 190 Q40 194 30 192 Z" fill="#5F9230"/>
          <path d="M30 122 H170 V132 H30 Z" fill="#79A94A" opacity=".7"/>
          <path d="M30 262 Q55 252 80 262 T130 262 T170 258 V322 H30 Z" fill="#C62A3E"/>
          <path d="M30 262 Q55 252 80 262 T130 262 T170 258" stroke="#E8707F" stroke-width="2.4" fill="none" opacity=".8"/>
          ${peca(70, 282, 9, 6, -20, '#9E1B2E', 0)}${peca(104, 296, 8, 5, 30, '#E24A5A', -1.6)}${peca(132, 280, 10, 6.5, 12, '#9E1B2E', -3)}
          ${peca(86, 270, 5, 3.4, 0, '#E24A5A', -2)}${peca(118, 270, 5.5, 3.6, 40, '#E24A5A', -4)}${peca(66, 304, 6, 4, 10, '#E24A5A', -.8)}`,
        topo: gelo(76, 117, 36, -10, 0) + gelo(114, 115, 38, 12, -1.5) + gelo(96, 128, 26, 28, -3),
        frente: `<g transform="translate(153 112) rotate(24)">
          <path d="M-10 -16 L0 -26 L10 -16 L0 -11 Z" fill="#5F9230" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M0 -14 C13 -22 30 -8 22 8 C17 18 7 26 0 34 C-7 26 -17 18 -22 8 C-30 -8 -13 -22 0 -14 Z" fill="#E5384F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M0 -6 C9 -12 20 -3 15 7 C11 14 5 19 0 25 C-5 19 -11 14 -15 7 C-20 -3 -9 -12 0 -6 Z" fill="#F7A8B2"/>
          <path d="M0 0 V16" stroke="#FFE3E6" stroke-width="4" stroke-linecap="round"/>
          <path d="M-8 4 l-1.5 4 M8 4 l1.5 4 M-4 12 l-1 3 M4 12 l1 3" stroke="#B3243A" stroke-width="1.6" stroke-linecap="round"/></g>`
      });
    }
  },

  {
    id: 'pink-girl-matcha',
    categoria: 'matchas',
    nome: 'Pink Girl Matcha',
    fonte: "'Pacifico', cursive",
    cor: '#F06FA0',
    linhas: [{ t: 'Pink Girl', cor: '#F06FA0', contorno: '#FFFFFF', sombra: '0 3px 0 rgba(176,52,100,.25)' }, { t: 'Matcha', cor: '#F06FA0', contorno: '#FFFFFF', sombra: '0 3px 0 rgba(176,52,100,.25)', tam: .8 }],
    preco: 20,
    frase: 'Chocolate de morango, leite e matchá, doce e divertido.',
    ingredientes: ['Chocolate de morango', 'Leite', 'Matcha'],
    fundo: [{ cor: '#F08CB0', x: 10, y: 108, r: 55, a: .6 }],
    acucar: 'Já é doce: os três níveis mudam só a etiqueta.',
    svg: () => {
      let raspas = '';
      [[70, 108], [84, 102], [100, 99], [116, 103], [130, 109], [92, 112], [108, 110], [78, 116], [122, 116]].forEach(([x, y], i) => {
        raspas += `<path d="M${x} ${y} q4 -7 10 -3 q-1 7 -9 6 z" transform="rotate(${(i * 47) % 70 - 30} ${x} ${y})" fill="#F8A9C4" stroke="#C94E7E" stroke-width="1.4" stroke-linejoin="round"/>`;
      });
      return copo({
        cond: .8,
        dentro: `
          <rect x="30" y="122" width="140" height="200" fill="#FCF7EF"/>
          <path d="M30 122 H170 V188 Q150 196 130 188 T90 191 T50 188 Q40 192 30 190 Z" fill="#6AA03A"/>
          <path d="M30 122 H170 V132 H30 Z" fill="#86B556" opacity=".7"/>
          <path d="M30 256 Q55 246 80 256 T130 256 T170 252 V322 H30 Z" fill="#EE79A4"/>
          <path d="M30 256 Q55 246 80 256 T130 256 T170 252" stroke="#FBB6CF" stroke-width="2.4" fill="none" opacity=".9"/>
          <path d="M46 282 C70 268 96 298 124 278 S152 288 162 276" stroke="#F8A5C3" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M50 308 C74 298 100 316 130 304" stroke="#D8588A" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>`,
        atras: coracao(24, 168, 1.15, '#E8508C', 0) + coracao(177, 138, .9, '#E8508C', -1.8),
        topo: gelo(78, 120, 34, -10, 0) + gelo(114, 118, 36, 12, -1.5) + raspas
      });
    }
  }
];
