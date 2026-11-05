(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const reduzir = () => mq.matches;

  const el = {
    cats: $('#cats'), pill: $('#pill'), copo: $('#copo'), info: $('#info'), nome: $('#nome'),
    preco: $('#preco'), frase: $('#frase'), ingred: $('#ingred'), dots: $('#dots'),
    acucar: $('#acucar'), pill2: $('#pill2'), stage: $('#stage'), rodape: document.querySelector('.rodape'),
    prev: $('#prev'), next: $('#next')
  };
  const camadas = {};
  document.querySelectorAll('.bgl').forEach(l => camadas[l.dataset.cat] = l);

  const ACUCAR = ['0 açúcar', 'Neutro', 'Doce'];
  const st = { cat: 0, idx: 0, acucar: 1, busy: false, z: 1, tint: 'A' };

  const lista = c => BEBIDAS.filter(b => b.categoria === CATEGORIAS[c].id);
  const atual = () => lista(st.cat)[st.idx];

  /* ------------------------- texturas dos fundos ------------------------- */
  function espiral(cx, cy, voltas, passo) {
    let d = '';
    for (let t = 0; t <= voltas * Math.PI * 2; t += .25) {
      const r = (t / (Math.PI * 2)) * passo;
      d += `${d ? 'L' : 'M'}${(cx + Math.cos(t) * r).toFixed(1)} ${(cy + Math.sin(t) * r * .92).toFixed(1)} `;
    }
    return d;
  }
  const estrela = (cx, cy, R, r) => {
    let d = '';
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r : R;
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `;
    }
    return d + 'Z';
  };
  const folha = (x, y, rot, s = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C10 -16 32 -16 42 0 C32 16 10 16 0 0 Z M0 0 L42 0" fill="none" stroke="#5E7A44" stroke-opacity=".2" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></g>`;

  const TEXTURAS = {
    lattes: { w: 340, h: 340, svg: `
      <path d="${espiral(95, 95, 4.2, 9)}" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="3" stroke-linecap="round"/>
      <path d="${espiral(255, 250, 3.6, 9)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
      <path d="M200 40 C230 60 250 90 240 130 M214 40 C246 64 266 96 256 140" fill="none" stroke="#8A6A4A" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 290 C50 270 80 270 100 290 M44 300 C60 284 86 284 102 300" fill="none" stroke="#8A6A4A" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/>` },
    matchas: { w: 360, h: 360, svg: `
      <path d="M20 70 C90 30 170 110 250 60" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="24" stroke-linecap="round"/>
      <path d="M120 250 C190 210 270 290 340 240" fill="none" stroke="#6F8A55" stroke-opacity=".08" stroke-width="20" stroke-linecap="round"/>
      <path d="M40 330 C80 300 130 330 170 308" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="14" stroke-linecap="round"/>
      ${folha(250, 140, -30)}${folha(60, 200, 25, .85)}${folha(280, 300, 160, .8)}${folha(160, 40, 10, .7)}` },
    coffees: { w: 280, h: 280, svg: (() => {
      const grao = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="15" ry="22" fill="#F5EDE1" fill-opacity=".05"/><path d="M0 -21 C-9 -8 9 8 0 21" fill="none" stroke="#1E1612" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round"/></g>`;
      return grao(60, 60, -25) + grao(200, 110, 40) + grao(110, 215, 70) + grao(240, 250, -10);
    })() },
    chai: { w: 380, h: 380, svg: `
      <g transform="translate(70 80) rotate(-28)" fill="none" stroke="#8A5A32" stroke-opacity=".2" stroke-width="1.8" stroke-linejoin="round">
        <rect x="-44" y="-9" width="88" height="18" rx="9"/><path d="M-40 -3 C-20 -7 20 -7 40 -3 M-40 3 C-20 7 20 7 40 3" /><ellipse cx="44" cy="0" rx="4" ry="9"/></g>
      <path d="${estrela(285, 90, 26, 11)}" fill="none" stroke="#8A5A32" stroke-opacity=".2" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="285" cy="90" r="4" fill="none" stroke="#8A5A32" stroke-opacity=".2" stroke-width="1.6"/>
      <g transform="translate(110 290) rotate(30)" fill="none" stroke="#8A5A32" stroke-opacity=".2" stroke-width="1.8" stroke-linecap="round">
        <ellipse rx="13" ry="22"/><path d="M0 -22 V22 M-7 -17 C-9 -4 -9 4 -7 17 M7 -17 C9 -4 9 4 7 17"/></g>
      <g transform="translate(300 300) rotate(-65)" fill="none" stroke="#8A5A32" stroke-opacity=".18" stroke-width="1.8" stroke-linejoin="round">
        <rect x="-36" y="-8" width="72" height="16" rx="8"/><path d="M-32 -2 C-14 -6 14 -6 32 -2"/></g>` }
  };
  Object.entries(TEXTURAS).forEach(([cat, t]) => {
    const alvo = camadas[cat]; if (!alvo) return;
    alvo.querySelector('.tex').innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="tx-${cat}" width="${t.w}" height="${t.h}" patternUnits="userSpaceOnUse">${t.svg}</pattern></defs><rect width="100%" height="100%" fill="url(#tx-${cat})"/></svg>`;
  });

  /* ------------------------- fundo: tom da bebida ------------------------- */
  function aplicarTint(b) {
    const manchas = (b && b.fundo) || [];
    const css = manchas.map(m =>
      `radial-gradient(circle at ${m.x}% ${m.y}%, color-mix(in srgb, ${m.cor} ${Math.round(m.a * 100)}%, transparent), transparent ${m.r}%)`
    ).join(',') || 'none';
    const novo = st.tint === 'A' ? $('#tintB') : $('#tintA');
    const velho = st.tint === 'A' ? $('#tintA') : $('#tintB');
    novo.style.backgroundImage = css;
    novo.classList.add('on'); velho.classList.remove('on');
    st.tint = st.tint === 'A' ? 'B' : 'A';
  }

  /* ------------------------- barras (segmented) ------------------------- */
  function posicionar(container, pill, i, anim = true) {
    const btn = container.querySelectorAll('button')[i]; if (!btn) return;
    pill.classList.toggle('sem-anim', !anim);
    pill.style.width = btn.offsetWidth + 'px';
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
    container.querySelectorAll('button').forEach((x, k) => x.setAttribute('aria-pressed', k === i));
    if (!anim) { void pill.offsetWidth; pill.classList.remove('sem-anim'); }
  }
  CATEGORIAS.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = c.rotulo; b.dataset.i = i;
    b.addEventListener('click', e => trocarCategoria(i, b));
    el.cats.appendChild(b);
  });
  ACUCAR.forEach((r, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = r;
    b.addEventListener('click', () => escolherAcucar(i));
    el.acucar.appendChild(b);
  });

  /* ------------------------- renderização ------------------------- */
  function fmtPreco(p) { return 'R$ ' + (Number.isInteger(p) ? p : p.toFixed(2).replace('.', ',')); }

  function desenharCopo() {
    const b = atual();
    el.copo.innerHTML = b ? b.svg(st.acucar) : copoVazio();
  }

  function desenharInfo() {
    const b = atual();
    el.info.classList.toggle('vazio', !b);
    el.nome.textContent = '';
    if (!b) {
      const s = document.createElement('span');
      s.textContent = 'Em breve';
      s.style.fontFamily = "'Darumadrop One', cursive";
      el.nome.appendChild(s);
      el.preco.textContent = '';
      el.frase.textContent = 'Estamos preparando as bebidas desta categoria.';
      el.ingred.textContent = '';
      return;
    }
    el.nome.setAttribute('aria-label', b.nome);
    (b.linhas || [{ t: b.nome }]).forEach(l => {
      const s = document.createElement('span');
      s.textContent = l.t;
      s.setAttribute('aria-hidden', 'true');
      s.style.fontFamily = l.fonte || b.fonte;
      s.style.color = l.cor || b.cor;
      if (l.tam) s.style.fontSize = l.tam + 'em';
      if (l.peso) s.style.fontWeight = l.peso;
      if (l.espaco) s.style.letterSpacing = l.espaco;
      if (l.contorno) { s.style.webkitTextStroke = '6px ' + l.contorno; }
      if (l.sombra) s.style.textShadow = l.sombra;
      el.nome.appendChild(s);
    });
    el.preco.textContent = fmtPreco(b.preco);
    el.frase.textContent = b.frase;
    el.ingred.textContent = b.ingredientes.join(' · ');
  }

  function desenharDots() {
    const n = lista(st.cat).length;
    el.dots.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const d = document.createElement('i');
      if (i === st.idx) d.className = 'on';
      el.dots.appendChild(d);
    }
    const unico = n < 2;
    el.stage.classList.toggle('unico', unico);
    el.rodape.classList.toggle('unico', unico);
    el.rodape.classList.toggle('vazio', n === 0);
  }

  function posicionarSetas() {
    const r = el.copo.getBoundingClientRect(), s = el.stage.getBoundingClientRect();
    if (r.height) el.stage.style.setProperty('--at', (r.top - s.top + r.height / 2) + 'px');
  }

  function renderTudo() {
    desenharCopo(); desenharInfo(); desenharDots(); aplicarTint(atual());
    requestAnimationFrame(posicionarSetas);
  }

  /* ------------------------- transições ------------------------- */
  const PERSP = 'perspective(900px)';
  async function girar(trocar, dir) {
    const infoOut = [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-dir * 16}px)` }];
    const infoIn = [{ opacity: 0, transform: `translateX(${dir * 16}px)` }, { opacity: 1, transform: 'translateX(0)' }];
    if (reduzir()) {
      const o = el.copo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
      el.info.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
      await o.finished; trocar();
      el.copo.getAnimations().forEach(a => a.cancel()); el.info.getAnimations().forEach(a => a.cancel());
      el.copo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
      el.info.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
      return;
    }
    const a1 = el.copo.animate(
      [{ transform: `${PERSP} rotateY(0deg) scale(1)` }, { transform: `${PERSP} rotateY(${dir * 90}deg) scale(.93)` }],
      { duration: 300, easing: 'cubic-bezier(.5,.05,.85,.5)', fill: 'forwards' });
    const i1 = el.info.animate(infoOut, { duration: 260, easing: 'ease-in', fill: 'forwards' });
    await a1.finished;
    trocar();
    const a2 = el.copo.animate(
      [{ transform: `${PERSP} rotateY(${-dir * 90}deg) scale(.93)` }, { transform: `${PERSP} rotateY(0deg) scale(1)` }],
      { duration: 300, easing: 'cubic-bezier(.15,.5,.3,1)', fill: 'both' });
    const i2 = el.info.animate(infoIn, { duration: 340, easing: 'ease-out', fill: 'both' });
    a1.cancel(); i1.cancel();
    await Promise.all([a2.finished, i2.finished]);
    a2.cancel(); i2.cancel();
  }

  async function trocarBebida(dir) {
    const n = lista(st.cat).length;
    if (st.busy || n < 2) return;
    st.busy = true;
    const novo = (st.idx + dir + n) % n;
    await girar(() => {
      st.idx = novo;
      desenharCopo(); desenharInfo(); desenharDots(); aplicarTint(atual());
    }, dir);
    st.busy = false;
  }

  async function trocarCategoria(i, btn) {
    if (st.busy || i === st.cat) return;
    st.busy = true;
    const dir = i > st.cat ? 1 : -1;
    const anterior = camadas[CATEGORIAS[st.cat].id];
    const nova = camadas[CATEGORIAS[i].id];
    st.cat = i; st.idx = 0;
    document.body.dataset.tema = CATEGORIAS[i].id;
    posicionar(el.cats, el.pill, i);

    // onda a partir do botão tocado
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const W = innerWidth, H = innerHeight;
    const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 10;
    nova.style.zIndex = ++st.z;
    nova.classList.add('pre', 'on');
    let onda;
    if (reduzir()) {
      onda = nova.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'both' });
    } else {
      onda = nova.animate(
        [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }],
        { duration: 800, easing: 'cubic-bezier(.45,.05,.2,1)', fill: 'both' });
    }
    const giro = girar(() => { desenharCopo(); desenharInfo(); desenharDots(); aplicarTint(atual()); }, dir);
    await Promise.all([onda.finished, giro]);
    Object.values(camadas).forEach(l => { if (l !== nova) { l.classList.remove('on'); l.style.zIndex = 0; } });
    nova.style.zIndex = 1; st.z = 1;
    onda.cancel();
    nova.classList.remove('pre');          // texturas entram por último, em fade
    requestAnimationFrame(posicionarSetas);
    st.busy = false;
  }

  function escolherAcucar(i) {
    if (i === st.acucar) return;
    st.acucar = i;
    posicionar(el.acucar, el.pill2, i);
    if (st.busy) return;
    desenharCopo();
    if (!reduzir()) el.copo.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
  }

  /* ------------------------- entradas ------------------------- */
  el.next.addEventListener('click', () => trocarBebida(1));
  el.prev.addEventListener('click', () => trocarBebida(-1));
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') trocarBebida(1);
    else if (e.key === 'ArrowLeft') trocarBebida(-1);
  });

  let sx = 0, sy = 0, ativo = false;
  el.stage.addEventListener('pointerdown', e => { if (e.target.closest('.seta')) return; sx = e.clientX; sy = e.clientY; ativo = true; });
  el.stage.addEventListener('pointerup', e => {
    if (!ativo) return; ativo = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) trocarBebida(dx < 0 ? 1 : -1);
  });
  el.stage.addEventListener('pointercancel', () => ativo = false);

  function layout() {
    posicionar(el.cats, el.pill, st.cat, false);
    posicionar(el.acucar, el.pill2, st.acucar, false);
    posicionarSetas();
  }
  addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  /* ------------------------- início ------------------------- */
  camadas[CATEGORIAS[0].id].classList.add('on');
  renderTudo();
  layout();
})();
