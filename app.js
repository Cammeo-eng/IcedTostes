(function () {
  "use strict";
  const D = window.TOSTES;
  const $ = (s, el = document) => el.querySelector(s);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const money = v => brl.format(v).replace(/ /g, " ");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cats = D.categorias;
  const catById = Object.fromEntries(cats.map(c => [c.id, c]));
  const drinks = D.bebidas.slice();
  // ordem opcional definida na categoria (campo "ordem" em bebidas.js)
  drinks.sort((a, b) => {
    const o = catById[a.categoria] && catById[a.categoria].ordem;
    if (a.categoria !== b.categoria || !o) return 0;
    const ia = o.indexOf(a.id), ib = o.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const byId = Object.fromEntries(drinks.map(d => [d.id, d]));
  const listOf = cat => drinks.filter(d => d.categoria === cat);
  const ACUCAR = ["0 açúcar", "Neutro", "Doce"];

  const state = {
    cat: cats.find(c => listOf(c.id).length)?.id || cats[0].id,
    pos: 0, target: 0, vel: 0, active: null, acucar: 1, cart: load()
  };

  /* ---------- nome e preço ---------- */
  function nameHTML(d) {
    return d.nome.map(l => {
      const st = [
        `font-family:${l.font}`, `color:${l.color}`, `font-size:${l.size || 1}em`,
        `font-weight:${l.weight || 400}`, l.shadow ? `text-shadow:${l.shadow}` : "",
        l.ls ? `letter-spacing:${l.ls};padding-left:${l.ls}` : "", l.caps ? "text-transform:uppercase" : ""
      ].join(";");
      const laco = l.enfeite === "laco";
      const cls = [l.overlap ? "ov" : "", l.coroa ? "crowned" : "", laco ? "bowed" : ""].join(" ").trim();
      return `<span class="${cls}" style="${st}">${l.coroa ? CROWN : ""}${laco ? BOW : ""}${l.t}</span>`;
    }).join("");
  }
  const CROWN = '<svg class="crown" viewBox="0 0 48 34" aria-hidden="true"><path d="M4 28 1.5 8l12 9L24 2l10.5 15 12-9L44 28Z" fill="#F2C14E" stroke="#B5831E" stroke-width="2" stroke-linejoin="round"/><path d="M5 31h38" stroke="#B5831E" stroke-width="3.2" stroke-linecap="round"/><circle cx="24" cy="2.8" r="2.6" fill="#FFF3C4" stroke="#B5831E" stroke-width="1.4"/><circle cx="1.8" cy="8" r="2" fill="#FFF3C4" stroke="#B5831E" stroke-width="1.2"/><circle cx="46.2" cy="8" r="2" fill="#FFF3C4" stroke="#B5831E" stroke-width="1.2"/></svg>';
  const BOW = '<svg class="bow" viewBox="0 0 60 40" aria-hidden="true"><path d="M30 20C22 8 6 2 4 12s6 20 26 8Z" fill="#F48FB1" stroke="#C2185B" stroke-width="2" stroke-linejoin="round"/><path d="M30 20C38 8 54 2 56 12s-6 20-26 8Z" fill="#F48FB1" stroke="#C2185B" stroke-width="2" stroke-linejoin="round"/><path d="M28 22 20 38l6-2 3 4 3-16M32 22l8 16-6-2-3 4-3-16" fill="#F8BBD0" stroke="#C2185B" stroke-width="1.6" stroke-linejoin="round"/><rect x="25" y="14" width="10" height="11" rx="4" fill="#E05A8A" stroke="#C2185B" stroke-width="2"/><path d="M10 11c4-3 9-2 13 2M50 11c-4-3-9-2-13 2" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/></svg>';
  const plainName = d => d.nome.map(l => l.t).join(" ");
  function priceHTML(v) {
    const [i, c] = v.toFixed(2).split(".");
    return `<span class="cur">R$</span><span class="int">${i}</span><span class="cents">,${c}</span>`;
  }

  /* ---------- tema (cores por bebida) ---------- */
  function tokens(f) {
    return f.escuro ? {
      ink: "#F6E9DA", muted: "rgba(246,233,218,.68)", line: "rgba(246,233,218,.18)",
      glass: "rgba(255,240,225,.10)", edge: "rgba(255,240,225,.26)", track: "rgba(255,240,225,.07)",
      btn: "#F3E2CF", btnInk: "#2B1A10", chip: "rgba(255,240,225,.06)", grain: .2, blend: "overlay"
    } : {
      ink: "#2B211A", muted: "rgba(43,33,26,.66)", line: "rgba(43,33,26,.14)",
      glass: "rgba(255,252,246,.5)", edge: "rgba(255,255,255,.75)", track: "rgba(43,33,26,.06)",
      btn: "#2F3B2A", btnInk: "#F6EEE2", chip: "rgba(255,255,255,.4)", grain: .14, blend: "soft-light"
    };
  }
  let bgFront = $("#bgA"), bgBack = $("#bgB"), firstBg = true;
  function paint(f) {
    const t = tokens(f), r = document.documentElement.style;
    r.setProperty("--ink", t.ink); r.setProperty("--muted", t.muted); r.setProperty("--line", t.line);
    r.setProperty("--glass", t.glass); r.setProperty("--glass-edge", t.edge); r.setProperty("--track", t.track);
    r.setProperty("--btn", t.btn); r.setProperty("--btn-ink", t.btnInk); r.setProperty("--chip", t.chip);
    r.setProperty("--grain", t.grain); r.setProperty("--blend", t.blend);
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = f.topo;
    // fundo: troca suave entre duas camadas
    const next = firstBg ? bgFront : bgBack;
    next.style.background = `linear-gradient(180deg, ${f.topo} 0%, ${f.base} 78%)`;
    next.style.setProperty("--luz", f.luz);
    if (firstBg) { firstBg = false; return; }
    next.style.opacity = 1; bgFront.style.opacity = 0;
    [bgFront, bgBack] = [next, bgFront];
  }

  /* ---------- palco ---------- */
  const stage = $("#stage"), ring = $("#ring");
  const cups = drinks.map(d => {
    const el = document.createElement("div");
    el.className = "cup";
    el.innerHTML = `<div class="body"><div class="shadow"></div><img src="${d.foto}" alt="${plainName(d)}" draggable="false"><div class="shine"></div></div>`;
    el.style.setProperty("--m", `url("${d.foto}")`);
    el.style.opacity = 0;
    el._vis = 0; el._d = d;
    el.addEventListener("click", () => {
      if (dragMoved || d.categoria !== state.cat) return;
      const i = listOf(state.cat).indexOf(d);
      if (i !== Math.round(state.target)) { closeTags(); state.target = i; }
      else toggleTags();
    });
    ring.appendChild(el);
    return el;
  });

  let W = 0, H = 0;
  function measure() {
    W = stage.clientWidth; H = stage.clientHeight;
    const land = W > H * 1.05;
    cups.forEach(el => {
      const h = Math.round(H * (land ? 0.74 : 0.72) * (el._d.escala || 1));
      el.style.setProperty("--h", h + "px");
      // copo centralizado na altura do palco (um pouco acima do meio, deixando ar para o reflexo)
      el.style.bottom = Math.max(H * 0.08, (H - h) / 2 + H * 0.03).toFixed(0) + "px";
    });
  }

  let t0 = performance.now();
  function frame(now) {
    const dt = Math.min(2.5, (now - t0) / 16.7); t0 = now;
    const n = listOf(state.cat).length;
    if (!dragging) {
      state.vel += (state.target - state.pos) * 0.08 * dt;
      state.vel *= Math.pow(0.72, dt);
      state.pos += state.vel * dt;
      if (Math.abs(state.target - state.pos) < 0.0005 && Math.abs(state.vel) < 0.0005) state.pos = state.target;
    }
    const sp = Math.min(W * 0.46, 380);
    const tt = now / 1000;
    cups.forEach(el => {
      const d = el._d;
      const inCat = d.categoria === state.cat;
      el._vis += ((inCat ? 1 : 0) - el._vis) * Math.min(1, 0.12 * dt);
      if (el._vis < 0.01 && !inCat) { el.style.visibility = "hidden"; return; }
      el.style.visibility = "visible";
      let off;
      if (inCat) { off = listOf(state.cat).indexOf(d) - state.pos; el._off = off; }
      else off = el._off ?? 0;
      const a = Math.abs(off);
      const x = Math.sign(off) * Math.min(a, 1.4) * sp + Math.sign(off) * Math.max(0, a - 1.4) * sp * 0.3;
      const z = -Math.min(a, 2) * 170;
      const ry = -Math.max(-1.3, Math.min(1.3, off)) * 26;
      const fl = a < 0.5 && !state.peek ? Math.sin(tt * 1.5) * 5 * (1 - a * 2) : 0;
      const enter = (1 - el._vis);
      const y = fl + enter * 26;
      const sc = (1 - Math.min(a, 2) * 0.05) * (1 - enter * 0.08);
      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      const op = Math.max(0, 1 - a * 0.42) * el._vis * (state.peek && a > 0.3 ? 0.35 : 1);
      el.style.opacity = op.toFixed(3);
      el.style.filter = a > 0.04 ? `blur(${Math.min(5, a * 2.2).toFixed(2)}px) saturate(${(1 - Math.min(a, 1) * .25).toFixed(2)})` : "none";
      el.style.zIndex = String(100 - Math.round(a * 10));
    });
    if (n) {
      const idx = Math.max(0, Math.min(n - 1, Math.round(state.pos)));
      const d = listOf(state.cat)[idx];
      if (d !== state.active) setActive(d);
    }
    fxStep(dt, now);
    requestAnimationFrame(frame);
  }

  /* ---------- arrastar ---------- */
  let dragging = false, dragMoved = false, sx = 0, sy = 0, p0 = 0, lastX = 0, lastT = 0, v = 0, axis = null;
  stage.addEventListener("pointerdown", e => {
    if (!listOf(state.cat).length || e.target.closest(".nav")) return;
    dragging = true; dragMoved = false; axis = null;
    sx = lastX = e.clientX; sy = e.clientY; p0 = state.pos; lastT = performance.now(); v = 0;
  });
  window.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (axis !== "x") return;
    if (!dragMoved) closeTags();
    dragMoved = true;
    const now = performance.now();
    v = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
    const n = listOf(state.cat).length;
    let p = p0 - dx / (W * 0.5);
    // resistência elástica nas pontas
    if (p < 0) p = -rubber(-p); else if (p > n - 1) p = n - 1 + rubber(p - (n - 1));
    state.pos = p; state.target = p; state.vel = 0;
  });
  const rubber = x => 0.35 * (1 - 1 / (x * 1.6 + 1));
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    const n = listOf(state.cat).length;
    if (axis === "x") state.target = Math.max(0, Math.min(n - 1, Math.round(state.pos - v * 3)));
    setTimeout(() => { dragMoved = false; }, 0);
  });

  function step(dir) {
    const n = listOf(state.cat).length; if (!n) return;
    const t = Math.round(state.target) + dir;
    if (t < 0 || t > n - 1) { state.vel -= dir * 0.09; return; } // quique na ponta
    state.target = t;
  }
  $("#next").addEventListener("click", () => step(1));
  $("#prev").addEventListener("click", () => step(-1));
  window.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, select") || sheetOpen) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------- categorias ---------- */
  const seg = $("#cats");
  seg.innerHTML = cats.map(c => `<button role="tab" type="button" data-cat="${c.id}" aria-selected="false">${c.nome}</button>`).join("") + `<span class="pill" aria-hidden="true"></span>`;
  seg.addEventListener("click", e => { const b = e.target.closest("button"); if (b) selectCat(b.dataset.cat); });
  function movePill(segEl, btn) {
    const pill = $(".pill", segEl);
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  function markCat() {
    seg.querySelectorAll("button").forEach(b => {
      const on = b.dataset.cat === state.cat; b.setAttribute("aria-selected", on);
      if (on) movePill(seg, b);
    });
  }
  function selectCat(cat) {
    if (cat === state.cat) return;
    closeTags();
    state.cat = cat; state.pos = state.target = 0; state.vel = 0;
    // os copos da nova categoria entram a partir da posição certa
    listOf(cat).forEach((d, i) => { cups[drinks.indexOf(d)]._off = i; });
    markCat();
    const c = catById[cat];
    if (!listOf(cat).length) {
      state.active = null;
      document.body.classList.add("is-soon");
      paint(c.fundo); fxSet(null);
      renderSoon(c);
    } else {
      document.body.classList.remove("is-soon");
      state.active = null; // força atualizar
    }
    updateNav();
  }

  /* ---------- detalhes ---------- */
  const info = $("#info");
  let infoT;
  function setActive(d) {
    const first = state.active === null && !info.dataset.ready;
    state.active = d;
    closeTags();
    paint(d.fundo); fxSet(d.efeito);
    cups.forEach(c => c.classList.remove("shining"));
    const el = cups[drinks.indexOf(d)];
    clearTimeout(setActive.s);
    setActive.s = setTimeout(() => { if (state.active === d) el.classList.add("shining"); }, 420);
    updateNav();
    if (first) { info.dataset.ready = 1; renderInfo(d); return; }
    info.classList.add("out");
    clearTimeout(infoT);
    infoT = setTimeout(() => { if (state.active) renderInfo(state.active); info.classList.remove("out"); }, 230);
  }
  function renderInfo(d) {
    const c = catById[d.categoria];
    $("#tag").innerHTML = d.homenagem ? `<i></i><span class="tribute">${d.homenagem.tag}</span><i></i>`
      : d.destaque ? `<i></i><span class="star">${d.destaque}</span><i></i>`
      : d.assinatura ? `<i></i>Assinatura da casa<i></i>` : `<i></i>${c.nome} · ${c.sobre}<i></i>`;
    $("#name").innerHTML = nameHTML(d);
    $("#price").innerHTML = priceHTML(d.preco);
    $("#buy").hidden = false; $("#peek").hidden = false;
    $("#story").hidden = !d.homenagem;
    if (!state.peek) $("#peekTxt").textContent = d.homenagem ? "Ver as camadas" : "Toque no copo para ver cada camada";
    $("#phrase").hidden = true;
    $("#add").setAttribute("aria-label", `Adicionar ${plainName(d)} ao pedido, ${money(d.preco)}`);
    markSugar();
    renderOpt(d);
  }
  function renderOpt(d) {
    const wrap = $("#optWrap"), box = $("#opt");
    if (!d.opcoes) { wrap.hidden = true; return; }
    wrap.hidden = false;
    if (state.optFor !== d.id) { state.optFor = d.id; state.opt = 0; }
    box.setAttribute("aria-label", d.opcoes.nome);
    box.innerHTML = d.opcoes.valores.map((v, i) => `<button type="button" data-i="${i}" aria-pressed="${i === state.opt}">${v}</button>`).join("") + `<span class="pill" aria-hidden="true"></span>`;
    requestAnimationFrame(() => { const b = box.querySelector(`[data-i="${state.opt}"]`); if (b) movePill(box, b); });
  }
  $("#opt").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    state.opt = +b.dataset.i;
    $("#opt").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    movePill($("#opt"), b);
  });
  function renderSoon(c) {
    $("#soonTxt").textContent = c.nome;
    info.classList.add("out");
    clearTimeout(infoT);
    infoT = setTimeout(() => {
      $("#tag").innerHTML = `<i></i>${c.nome} · ${c.sobre}<i></i>`;
      $("#name").innerHTML = `<span style="font-family:var(--f-marca);color:var(--ink)">Em breve</span>`;
      $("#buy").hidden = true; $("#peek").hidden = true; $("#story").hidden = true; $("#sugarWrap").hidden = true; $("#optWrap").hidden = true;
      $("#phrase").hidden = false;
      $("#phrase").textContent = c.breve || "Novas bebidas chegando ao cardápio.";
      info.classList.remove("out");
    }, 230);
  }
  function updateNav() {
    const list = listOf(state.cat), n = list.length;
    const i = Math.round(state.target);
    $("#prev").setAttribute("aria-disabled", !n || i <= 0);
    $("#next").setAttribute("aria-disabled", !n || i >= n - 1);
    const act = state.active ? list.indexOf(state.active) : -1;
    $("#dots").innerHTML = n > 1 ? list.map((x, k) => `<i class="${k === act ? "on" : ""}"></i>`).join("") : "";
  }


  /* ---------- ingredientes em volta do copo ---------- */
  const tagsEl = $("#tags"), leads = $("#leads");
  function openTags() {
    const d = state.active; if (!d) return;
    const img = cups[drinks.indexOf(d)].querySelector("img");
    const sr = stage.getBoundingClientRect(), cr = img.getBoundingClientRect();
    const n0 = d.ingredientes.length;
    const list = d.anatomia || d.ingredientes.map((t, i) => ({ t, y: .2 + i * .6 / Math.max(1, n0 - 1), x: i % 2 ? .68 : .32, lado: i % 2 ? "r" : "l" }));
    tagsEl.innerHTML = list.map((a, i) =>
      `<li class="${a.lado}" style="--i:${i};--c:${a.cor || "#ffffff"}"><i class="sw"></i><span><b>${a.t}</b>${a.nota ? `<small>${a.nota}</small>` : ""}</span></li>`).join("");
    const items = [...tagsEl.children];
    const cl = cr.left - sr.left, ct = cr.top - sr.top;
    const pos = items.map((li, i) => {
      const a = list[i], w = li.offsetWidth, h = li.offsetHeight;
      const ax = cl + cr.width * a.x, ay = ct + cr.height * a.y;
      let x = a.lado === "l" ? cl + cr.width * .1 - w : cl + cr.width * .9;
      x = Math.max(10, Math.min(sr.width - w - 10, x));
      return { li, a, w, h, ax, ay, x, y: ay - h / 2 };
    });
    // evita etiquetas encavaladas do mesmo lado
    ["l", "r"].forEach(side => {
      const col = pos.filter(p => p.a.lado === side).sort((p, q) => p.y - q.y);
      for (let k = 1; k < col.length; k++) {
        const min = col[k - 1].y + col[k - 1].h + 8;
        if (col[k].y < min) col[k].y = min;
      }
      col.forEach(p => { p.y = Math.max(4, Math.min(sr.height - p.h - 4, p.y)); });
    });
    let svg = "";
    pos.forEach((p, i) => {
      p.li.style.setProperty("--x", p.x.toFixed(0) + "px");
      p.li.style.setProperty("--y", p.y.toFixed(0) + "px");
      const ex = p.a.lado === "l" ? p.x + p.w + 2 : p.x - 2, ey = p.y + p.h / 2;
      const mx = p.a.lado === "l" ? ex + 10 : ex - 10;
      svg += `<path d="M${ex.toFixed(1)} ${ey.toFixed(1)} L${mx.toFixed(1)} ${ey.toFixed(1)} L${p.ax.toFixed(1)} ${p.ay.toFixed(1)}" style="--i:${i}" pathLength="1"/>` +
        `<circle class="ring" cx="${p.ax.toFixed(1)}" cy="${p.ay.toFixed(1)}" r="7" style="--i:${i};--c:${p.a.cor || "#fff"}"/>` +
        `<circle class="pt" cx="${p.ax.toFixed(1)}" cy="${p.ay.toFixed(1)}" r="3.2" style="--i:${i};--c:${p.a.cor || "#fff"}"/>`;
    });
    leads.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);
    leads.innerHTML = svg;
    void tagsEl.offsetWidth;
    tagsEl.classList.add("on"); leads.classList.add("on"); document.body.classList.add("peeking");
    state.peek = true;
    $("#peek").setAttribute("aria-expanded", "true");
    $("#peekTxt").textContent = "Toque de novo para fechar";
  }
  function closeTags() {
    if (!state.peek) return;
    state.peek = false;
    tagsEl.classList.remove("on"); leads.classList.remove("on"); document.body.classList.remove("peeking");
    $("#peek").setAttribute("aria-expanded", "false");
    $("#peekTxt").textContent = state.active && state.active.homenagem ? "Ver as camadas" : "Toque no copo para ver cada camada";
  }
  function toggleTags() { state.peek ? closeTags() : openTags(); }
  $("#peek").addEventListener("click", toggleTags);
  stage.addEventListener("click", e => {
    if (state.peek && !dragMoved && !e.target.closest(".cup, .nav")) closeTags();
  });

  /* ---------- abertura (primeira visita) ---------- */
  function intro() {
    let seen = false;
    try { seen = localStorage.getItem("tostes-abertura-v2") === "1"; } catch (e) {}
    if (seen && location.hash !== "#abertura") return;
    try { localStorage.setItem("tostes-abertura-v2", "1"); } catch (e) {}
    const box = $("#intro"), c = $("#introFx"), g = c.getContext("2d");
    // título letra por letra
    const t = $("#introTitle");
    t.innerHTML = t.textContent.split(" ").map(w => `<span class="w">${[...w].map(ch => `<span class="ch">${ch}</span>`).join("")}</span>`).join(" ");
    t.querySelectorAll(".ch").forEach((el, i) => el.style.animationDelay = (0.7 + i * 0.045) + "s");
    box.hidden = false;
    let w, h, r;
    const size = () => { r = Math.min(2, devicePixelRatio || 1); w = innerWidth; h = innerHeight; c.width = w * r; c.height = h * r; };
    size();
    // três camadas de profundidade: longe (pequena, lenta), meio, perto (grande, rápida, desfocada)
    const flakes = [];
    [[170, .6, 1.4, .5, .55], [110, 1.3, 2.6, 1, .8], [26, 3.5, 6, 1.9, .65]].forEach(([n, r0, r1, sp, op], layer) => {
      for (let i = 0; i < n; i++) flakes.push({ x: rnd(-w * .3, w), y: rnd(-h, h), r: rnd(r0, r1), sp: sp * rnd(.8, 1.25), o: op * rnd(.6, 1), ph: rnd(0, 6.28), layer });
    });
    let drift = 0, alive = true, last = performance.now(), start = last;
    function loop(now) {
      if (!alive) return;
      const dt = Math.min(2.5, (now - last) / 16.7); last = now;
      const el = (now - start) / 1000;
      const gust = 1.6 + Math.sin(el * 1.3) * 1.1 + Math.sin(el * 3.1) * .4; // rajadas de vento
      g.setTransform(r, 0, 0, r, 0, 0); g.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += (1.1 + f.sp * 1.6) * dt;
        f.x += (gust * f.sp + Math.sin(el * 2 + f.ph) * .5) * dt;
        if (f.y > h + 10 || f.x > w + 20) { f.y = rnd(-40, -5); f.x = rnd(-w * .4, w); }
        g.globalAlpha = f.o;
        if (f.layer === 2) { // flocos de perto, macios
          const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.8);
          gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr; g.beginPath(); g.arc(f.x, f.y, f.r * 1.8, 0, 6.283); g.fill();
        } else {
          g.fillStyle = "#fff"; g.beginPath(); g.arc(f.x, f.y, f.r, 0, 6.283); g.fill();
        }
      }
      // neve acumulando embaixo
      drift = Math.min(1, drift + .004 * dt);
      const dh = 46 * drift;
      g.globalAlpha = 1; g.fillStyle = "#fff";
      g.beginPath(); g.moveTo(0, h);
      for (let x = 0; x <= w + 20; x += 20) g.lineTo(x, h - dh - Math.sin(x / 70 + 1) * 10 * drift - Math.sin(x / 31) * 4 * drift);
      g.lineTo(w, h); g.closePath(); g.fill();
      requestAnimationFrame(loop);
    }
    if (!reduce) requestAnimationFrame(loop);
    const bye = () => {
      if (!alive) return;
      box.classList.add("bye");
      setTimeout(() => { alive = false; box.hidden = true; }, 950);
    };
    $("#skip").addEventListener("click", bye);
    box.addEventListener("click", e => { if (!e.target.closest(".skip")) bye(); });
    setTimeout(bye, 5600);
    addEventListener("resize", size);
  }

  /* ---------- homenagem ---------- */
  function openNote() {
    const h = state.active && state.active.homenagem; if (!h) return;
    $("#noteTitle").textContent = h.titulo;
    $("#noteBody").innerHTML = h.texto.map(p => `<p>${p}</p>`).join("");
    $("#noteSign").textContent = h.assinatura || "";
    const w = $("#noteWrap"); w.hidden = false; void w.offsetWidth; w.classList.add("on");
    setTimeout(() => $("#noteClose").focus(), 60);
  }
  function closeNote() {
    const w = $("#noteWrap"); if (w.hidden) return;
    w.classList.remove("on"); setTimeout(() => { w.hidden = true; }, 420);
    $("#story").focus();
  }
  $("#story").addEventListener("click", openNote);
  $("#noteClose").addEventListener("click", closeNote);
  $("#noteWrap").addEventListener("click", e => { if (e.target.id === "noteWrap") closeNote(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeNote(); });

  /* ---------- açúcar ---------- */
  const sug = $("#sugar");
  sug.innerHTML = ACUCAR.map((a, i) => `<button type="button" data-i="${i}" aria-pressed="${i === state.acucar}">${a}</button>`).join("") + `<span class="pill" aria-hidden="true"></span>`;
  function markSugar() {
    sug.querySelectorAll("button").forEach(b => {
      const on = +b.dataset.i === state.acucar; b.setAttribute("aria-pressed", on);
      if (on) movePill(sug, b);
    });
  }
  sug.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.acucar = +b.dataset.i; markSugar(); });

  /* ---------- efeitos do fundo ---------- */
  const cv = $("#fx"), cx = cv.getContext("2d");
  let fxW = 0, fxH = 0, dpr = 1, parts = [], fxCur = null;
  function fxSize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    fxW = window.innerWidth; fxH = window.innerHeight;
    cv.width = fxW * dpr; cv.height = fxH * dpr;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const FX = {
    "bolhas":         { n: 30, make: c => ({ x: rnd(0, fxW), y: rnd(0, fxH), r: rnd(2, 5.5), vx: 0, vy: rnd(-.25, -.08), a: rnd(.4, .75), c: pick(c), w: rnd(0, 6) }) },
    "brilho-dourado": { n: 18, make: c => ({ x: rnd(0, fxW), y: rnd(0, fxH), r: rnd(8, 28), vx: rnd(-.08, .08), vy: rnd(-.12, -.02), a: rnd(.12, .3), c: pick(c), w: rnd(0, 6) }) },
    "po":             { n: 70, make: c => ({ x: rnd(0, fxW), y: rnd(0, fxH), r: rnd(.8, 2.2), vx: rnd(.04, .18), vy: rnd(.05, .2), a: rnd(.25, .65), c: pick(c), w: rnd(0, 6) }) },
    "gotas":          { n: 18, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(2.5, 5), vx: 0, vy: rnd(.15, .4), a: rnd(.35, .7), c: pick(c), w: rnd(0, 6), rot: rnd(-.3, .3) }) },
    "neve":           { n: 46, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(1.8, 4.6), vx: rnd(-.05, .05), vy: rnd(.12, .32), a: rnd(.45, .9), c: pick(c), w: rnd(0, 6) }) },
    "coracoes":       { n: 24, make: c => ({ x: rnd(0, fxW), y: rnd(0, fxH * 1.2), r: rnd(6, 14), vx: 0, vy: rnd(-.32, -.12), a: rnd(.5, .9), c: pick(c), w: rnd(0, 6), rot: rnd(-.35, .35) }) },
    "graos":          { n: 16, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(5, 9), vx: rnd(-.03, .03), vy: rnd(.18, .4), a: rnd(.35, .7), c: pick(c), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.01, .01) }) },
    "folhas":         { n: 14, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(6, 11), vx: rnd(-.05, .08), vy: rnd(.22, .45), a: rnd(.55, .9), c: pick(c), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.006, .006) }) },
    "sakura":         { n: 22, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(4.5, 8.5), vx: rnd(.02, .14), vy: rnd(.2, .42), a: rnd(.6, .95), c: pick(c), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.012, .012), flor: Math.random() < .22 }) },
    "floquinhos":     { n: 18, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(2.2, 4), vx: rnd(-.04, .04), vy: rnd(.1, .22), a: rnd(.18, .35), c: pick(c), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.004, .004) }) },
    "especiarias":    { n: 14, make: c => { const k = pick(["anis", "canela", "canela", "cardamomo"]); return { x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(9, 15), vx: rnd(-.04, .06), vy: rnd(.18, .36), a: rnd(.55, .85), c: k === "cardamomo" ? (c[2] || c[0]) : pick(c.slice(0, 2)), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.008, .008), k }; } },
    "avelas":         { n: 12, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(7, 12), vx: rnd(-.04, .05), vy: rnd(.2, .38), a: rnd(.6, .9), c: pick(c), w: rnd(0, 6), rot: rnd(0, 6.28), vr: rnd(-.008, .008) }) },
    "morangos":       { n: 8, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(7, 11), vx: rnd(-.04, .05), vy: rnd(.2, .38), a: rnd(.5, .8), c: pick(c), w: rnd(0, 6), rot: rnd(-.5, .5), vr: rnd(-.006, .006) }) },
    "lacos":          { n: 10, make: c => ({ x: rnd(0, fxW), y: rnd(-fxH, fxH), r: rnd(8, 13), vx: rnd(-.05, .05), vy: rnd(.16, .32), a: rnd(.6, .9), c: pick(c), w: rnd(0, 6), rot: rnd(-.4, .4), vr: rnd(-.005, .005) }) },
    "brilhinhos":     { n: 40, make: c => ({ x: rnd(0, fxW), y: rnd(0, fxH * .85), r: rnd(3, 10), vx: rnd(-.04, .04), vy: rnd(-.06, .02), a: rnd(.5, 1), c: pick(c), w: rnd(0, 6), sp: rnd(1.2, 3) }) }
  };
  function fxSet(ef) {
    // aceita um efeito ou uma lista de efeitos combinados
    const list = !ef ? [] : Array.isArray(ef) ? ef : [ef];
    const key = JSON.stringify(list);
    if (fxCur === key) return;
    parts.forEach(p => p.dying = true);
    fxCur = key;
    list.forEach(e => {
      const def = FX[e.tipo]; if (!def) return;
      const n = e.n || def.n;
      for (let i = 0; i < n; i++) { const p = def.make(e.cores); p.t = e.tipo; p.life = 0; parts.push(p); }
    });
  }
  function heart(x, y, s) {
    cx.beginPath();
    cx.moveTo(x, y + s * .35);
    cx.bezierCurveTo(x, y, x - s * .5, y - s * .05, x - s * .5, y + s * .3);
    cx.bezierCurveTo(x - s * .5, y + s * .6, x - s * .1, y + s * .8, x, y + s);
    cx.bezierCurveTo(x + s * .1, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
    cx.bezierCurveTo(x + s * .5, y - s * .05, x, y, x, y + s * .35);
    cx.fill();
  }
  function star(x, y, s) {
    cx.beginPath();
    cx.moveTo(x, y - s);
    cx.quadraticCurveTo(x + s * .12, y - s * .12, x + s, y);
    cx.quadraticCurveTo(x + s * .12, y + s * .12, x, y + s);
    cx.quadraticCurveTo(x - s * .12, y + s * .12, x - s, y);
    cx.quadraticCurveTo(x - s * .12, y - s * .12, x, y - s);
    cx.fill();
  }
  function fxStep(dt, now) {
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, fxW, fxH);
    const t = now / 1000, m = reduce ? 0 : dt;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life = Math.min(1, p.life + 0.02 * dt);
      if (p.dying) { p.fade = (p.fade ?? 1) - 0.035 * dt; if (p.fade <= 0) { parts.splice(i, 1); continue; } }
      p.x += (p.vx + Math.sin(t * .6 + p.w) * .12) * m;
      p.y += p.vy * m;
      if (p.y < -20) { p.y = fxH + 20; p.x = rnd(0, fxW); }
      if (p.y > fxH + 20) { p.y = -20; p.x = rnd(0, fxW); }
      if (p.x < -30) p.x = fxW + 30; if (p.x > fxW + 30) p.x = -30;
      let al = p.a * p.life * (p.fade ?? 1);
      cx.fillStyle = p.c;
      if (p.t === "bolhas") {
        cx.globalAlpha = al; cx.strokeStyle = p.c; cx.lineWidth = 1;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.stroke();
        cx.globalAlpha = al * .8; cx.beginPath(); cx.arc(p.x - p.r * .35, p.y - p.r * .35, p.r * .25, 0, 6.283); cx.fill();
      } else if (p.t === "brilho-dourado") {
        const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, p.c); g.addColorStop(1, "rgba(255,255,255,0)");
        cx.globalAlpha = al * (0.75 + Math.sin(t * .8 + p.w) * .25); cx.fillStyle = g;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
      } else if (p.t === "gotas") {
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        cx.beginPath(); cx.moveTo(0, -p.r * 1.6);
        cx.quadraticCurveTo(p.r, 0, 0, p.r); cx.quadraticCurveTo(-p.r, 0, 0, -p.r * 1.6); cx.fill();
        cx.globalAlpha = al * .5; cx.fillStyle = "#FFF3E6"; cx.beginPath(); cx.arc(-p.r * .25, -p.r * .1, p.r * .22, 0, 6.283); cx.fill();
        cx.restore();
      } else if (p.t === "graos") {
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        cx.beginPath(); cx.ellipse(0, 0, p.r * .72, p.r, 0, 0, 6.283); cx.fill();
        cx.strokeStyle = "rgba(30,15,8,.55)"; cx.lineWidth = Math.max(1, p.r * .14);
        cx.beginPath(); cx.moveTo(0, -p.r * .8); cx.bezierCurveTo(p.r * .35, -p.r * .3, -p.r * .35, p.r * .3, 0, p.r * .8); cx.stroke();
        cx.restore();
      } else if (p.t === "coracoes") {
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t + p.w) * .15);
        heart(0, -p.r / 2, p.r); cx.restore();
      } else if (p.t === "brilhinhos") {
        const tw = (Math.sin(t * p.sp + p.w * 3) + 1) / 2;
        cx.globalAlpha = al * (0.15 + tw * .85);
        star(p.x, p.y, p.r * (0.55 + tw * .45));
        cx.globalAlpha = al * tw * .5; cx.beginPath(); cx.arc(p.x, p.y, p.r * .18, 0, 6.283); cx.fill();
      } else if (p.t === "folhas") {
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t * 1.1 + p.w) * .7);
        const r = p.r;
        cx.beginPath(); cx.moveTo(0, -r); cx.quadraticCurveTo(r * .75, -r * .1, 0, r); cx.quadraticCurveTo(-r * .75, -r * .1, 0, -r); cx.fill();
        cx.strokeStyle = "rgba(255,255,255,.45)"; cx.lineWidth = Math.max(.8, r * .09);
        cx.beginPath(); cx.moveTo(0, -r * .75); cx.lineTo(0, r * 1.25); cx.stroke();
        cx.restore();
      } else if (p.t === "sakura") {
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t * 1.3 + p.w) * .5);
        cx.scale(.55 + Math.abs(Math.cos(t * 1.6 + p.w)) * .45, 1); // pétala virando no ar
        const r = p.r;
        const petal = () => {
          cx.beginPath(); cx.moveTo(0, r);
          cx.bezierCurveTo(r * .95, r * .35, r * .75, -r * .7, r * .2, -r * .9);
          cx.lineTo(0, -r * .58); cx.lineTo(-r * .2, -r * .9);
          cx.bezierCurveTo(-r * .75, -r * .7, -r * .95, r * .35, 0, r); cx.fill();
        };
        if (p.flor) {
          for (let k = 0; k < 5; k++) { cx.save(); cx.rotate(k * 1.2566); cx.translate(0, -r * .9); cx.scale(.55, .55); petal(); cx.restore(); }
          cx.fillStyle = "#F7C95B"; cx.beginPath(); cx.arc(0, 0, r * .22, 0, 6.283); cx.fill();
        } else petal();
        cx.restore();
      } else if (p.t === "especiarias") {
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t * .9 + p.w) * .35);
        const r = p.r;
        if (p.k === "anis") { // anis-estrelado: 8 pontas com sementinhas
          cx.beginPath();
          for (let k = 0; k < 16; k++) { const ang = k * Math.PI / 8, rr = k % 2 ? r * .32 : r; cx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
          cx.closePath(); cx.fill();
          cx.fillStyle = "rgba(255,230,190,.55)";
          for (let k = 0; k < 8; k++) { const ang = k * Math.PI / 4; cx.beginPath(); cx.arc(Math.cos(ang) * r * .58, Math.sin(ang) * r * .58, r * .1, 0, 6.283); cx.fill(); }
        } else if (p.k === "canela") { // canela em pau: rolinho com as bordas enroladas
          const L = r * 1.6, Wd = r * .42;
          cx.beginPath(); cx.roundRect ? cx.roundRect(-L / 2, -Wd / 2, L, Wd, Wd * .4) : cx.rect(-L / 2, -Wd / 2, L, Wd); cx.fill();
          cx.strokeStyle = "rgba(60,25,8,.45)"; cx.lineWidth = Math.max(.8, r * .08);
          cx.beginPath(); cx.moveTo(-L / 2 + 2, 0); cx.lineTo(L / 2 - 2, 0); cx.stroke();
          cx.fillStyle = "rgba(255,220,180,.35)"; cx.beginPath(); cx.ellipse(L / 2 - Wd * .2, 0, Wd * .22, Wd * .45, 0, 0, 6.283); cx.fill();
        } else { // cardamomo: vagem verde com nervuras
          cx.beginPath(); cx.ellipse(0, 0, r * .4, r * .72, 0, 0, 6.283); cx.fill();
          cx.strokeStyle = "rgba(255,255,255,.35)"; cx.lineWidth = Math.max(.7, r * .07);
          cx.beginPath(); cx.moveTo(0, -r * .62); cx.lineTo(0, r * .62); cx.stroke();
          cx.beginPath(); cx.moveTo(-r * .18, -r * .5); cx.quadraticCurveTo(-r * .3, 0, -r * .18, r * .5); cx.stroke();
        }
        cx.restore();
      } else if (p.t === "avelas") { // avelã: castanha redondinha com o chapéu claro
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t + p.w) * .3);
        const r = p.r;
        cx.beginPath(); cx.moveTo(0, -r);
        cx.bezierCurveTo(r * .9, -r * .7, r * .95, r * .75, 0, r * .9);
        cx.bezierCurveTo(-r * .95, r * .75, -r * .9, -r * .7, 0, -r); cx.fill();
        cx.fillStyle = "rgba(240,215,180,.75)";
        cx.beginPath(); cx.ellipse(0, r * .62, r * .58, r * .3, 0, 0, 6.283); cx.fill();
        cx.fillStyle = "rgba(255,255,255,.3)"; cx.beginPath(); cx.ellipse(-r * .32, -r * .3, r * .14, r * .3, -.4, 0, 6.283); cx.fill();
        cx.restore();
      } else if (p.t === "morangos") { // moranguinho com sementes e folhas
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t + p.w) * .25);
        const r = p.r;
        cx.beginPath(); cx.moveTo(0, r);
        cx.bezierCurveTo(-r * 1.05, r * .2, -r * .95, -r * .75, 0, -r * .62);
        cx.bezierCurveTo(r * .95, -r * .75, r * 1.05, r * .2, 0, r); cx.fill();
        cx.fillStyle = "rgba(255,236,170,.9)";
        [[-.35, -.25], [.3, -.3], [0, 0], [-.4, .15], [.38, .12], [-.12, .42], [.16, .5]].forEach(([u, v]) => { cx.beginPath(); cx.ellipse(u * r, v * r, r * .05, r * .08, 0, 0, 6.283); cx.fill(); });
        cx.fillStyle = "#5E9A3A";
        for (let k = -2; k <= 2; k++) { cx.save(); cx.translate(0, -r * .62); cx.rotate(k * .55); cx.beginPath(); cx.ellipse(0, -r * .2, r * .13, r * .3, 0, 0, 6.283); cx.fill(); cx.restore(); }
        cx.restore();
      } else if (p.t === "lacos") { // lacinho de fita
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t * 1.2 + p.w) * .3);
        const r = p.r;
        const loop = s => { cx.beginPath(); cx.moveTo(0, 0); cx.bezierCurveTo(s * r * .35, -r * .9, s * r * 1.15, -r * .5, s * r, 0); cx.bezierCurveTo(s * r * 1.15, r * .5, s * r * .35, r * .9, 0, 0); cx.fill(); };
        loop(1); loop(-1);
        cx.beginPath(); cx.moveTo(-r * .1, r * .1); cx.lineTo(-r * .45, r * .95); cx.lineTo(-r * .2, r * .85); cx.lineTo(0, r * .2); cx.fill();
        cx.beginPath(); cx.moveTo(r * .1, r * .1); cx.lineTo(r * .45, r * .95); cx.lineTo(r * .2, r * .85); cx.lineTo(0, r * .2); cx.fill();
        cx.fillStyle = "rgba(255,255,255,.55)"; cx.beginPath(); cx.arc(0, 0, r * .2, 0, 6.283); cx.fill();
        cx.restore();
      } else if (p.t === "floquinhos") {
        p.rot += (p.vr || 0) * m;
        cx.globalAlpha = al; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        cx.strokeStyle = p.c; cx.lineWidth = .9; cx.lineCap = "round";
        for (let k = 0; k < 3; k++) { cx.rotate(1.0472); cx.beginPath(); cx.moveTo(-p.r, 0); cx.lineTo(p.r, 0); cx.stroke(); }
        cx.restore();
      } else { // po, neve
        cx.globalAlpha = al; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
      }
    }
    cx.globalAlpha = 1;
  }

  /* ---------- pedido ---------- */
  function load() { try { return JSON.parse(localStorage.getItem("tostes-pedido-v2")) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem("tostes-pedido-v2", JSON.stringify(state.cart)); } catch (e) {} }
  function addToCart(id, acucar) {
    const key = id + "|" + acucar;
    const it = state.cart.find(x => x.key === key);
    if (it) it.qtd++; else state.cart.push({ key, id, acucar, qtd: 1 });
    save(); renderCart();
    const b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    const a = $("#add"); a.classList.remove("done"); void a.offsetWidth; a.classList.add("done");
    toast(`${plainName(byId[id])}${acucar ? ` (${acucar})` : ""} no pedido`);
  }
  $("#add").addEventListener("click", () => {
    const d = state.active; if (!d) return;
    addToCart(d.id, d.opcoes ? d.opcoes.valores[state.opt || 0] : "");
  });

  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 1700);
  }
  const total = () => state.cart.reduce((s, x) => s + byId[x.id].preco * x.qtd, 0);
  const count = () => state.cart.reduce((s, x) => s + x.qtd, 0);

  let modo = "balcao";
  function renderCart() {
    state.cart = state.cart.filter(x => byId[x.id]);
    const n = count();
    $("#cartBtn").classList.toggle("has", n > 0);
    $("#cartTxt").textContent = n ? `${n} · ${money(total())}` : "";
    $("#cartBtn").setAttribute("aria-label", n ? `Abrir pedido: ${n} ${n === 1 ? "item" : "itens"}, ${money(total())}` : "Abrir pedido");
    const ul = $("#items");
    ul.innerHTML = n ? state.cart.map(x => {
      const d = byId[x.id];
      return `<li class="it"><img src="${d.foto}" alt=""><div><div class="n">${plainName(d)}</div>${x.acucar ? `<div class="m">${x.acucar}</div>` : ""}<div class="p">${money(d.preco * x.qtd)}</div></div>
        <div class="qty"><button type="button" data-k="${x.key}" data-d="-1" aria-label="Remover um">−</button><span>${x.qtd}</span><button type="button" data-k="${x.key}" data-d="1" aria-label="Adicionar um">+</button></div></li>`;
    }).join("") : `<li class="cart-empty">Seu pedido está vazio.<br>Escolha uma bebida e toque em Adicionar.</li>`;
    $("#form").hidden = !n;
    $("#total").textContent = money(total());
    updateSend();
  }
  $("#items").addEventListener("click", e => {
    const b = e.target.closest("button[data-k]"); if (!b) return;
    const it = state.cart.find(x => x.key === b.dataset.k); if (!it) return;
    it.qtd += +b.dataset.d;
    if (it.qtd <= 0) state.cart = state.cart.filter(x => x !== it);
    save(); renderCart();
  });
  const mesaSel = $("#mesa");
  for (let i = 1; i <= D.config.mesas; i++) mesaSel.insertAdjacentHTML("beforeend", `<option value="${i}">Mesa ${i}</option>`);
  $("#mode").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    modo = b.dataset.m;
    $("#mode").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    $("#mesaWrap").hidden = modo !== "mesa";
    updateSend();
  });
  ["#cliente", "#obs", "#mesa"].forEach(s => $(s).addEventListener("input", updateSend));
  function updateSend() {
    const nome = $("#cliente").value.trim();
    const ok = count() > 0 && nome.length > 1;
    const a = $("#send");
    a.setAttribute("aria-disabled", !ok);
    $("#hint").textContent = ok ? "Abre o WhatsApp com o pedido pronto para enviar." : "Informe seu nome para enviar o pedido.";
    if (!ok) { a.removeAttribute("href"); return; }
    const linhas = state.cart.map(x => `• ${x.qtd}x ${plainName(byId[x.id])}${x.acucar ? ` (${x.acucar})` : ""} — ${money(byId[x.id].preco * x.qtd)}`);
    const onde = modo === "mesa" ? `Consumo na mesa ${mesaSel.value}` : "Retirar no balcão";
    const obs = $("#obs").value.trim();
    const msg = [`Olá! Pedido pelo cardápio gelado da ${D.config.nomeLoja}:`, "", ...linhas, "", `Total: ${money(total())}`, `Nome: ${nome}`, onde].concat(obs ? [`Obs.: ${obs}`] : []).join("\n");
    a.href = `https://wa.me/${D.config.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
  let sheetOpen = false;
  function openSheet(on) {
    sheetOpen = on;
    $("#sheet").classList.toggle("on", on); $("#scrim").classList.toggle("on", on);
    $("#sheet").setAttribute("aria-hidden", !on);
    if (on) setTimeout(() => $("#closeCart").focus(), 50); else $("#cartBtn").focus();
  }
  $("#cartBtn").addEventListener("click", () => openSheet(true));
  $("#closeCart").addEventListener("click", () => openSheet(false));
  $("#scrim").addEventListener("click", () => openSheet(false));
  window.addEventListener("keydown", e => { if (e.key === "Escape" && sheetOpen) openSheet(false); });

  /* ---------- início ---------- */
  intro();
  fxSize(); measure();
  listOf(state.cat).forEach((d, i) => { const c = cups[drinks.indexOf(d)]; c._off = i; c._vis = 1; });
  markCat(); markSugar(); renderCart();
  requestAnimationFrame(t => { t0 = t; requestAnimationFrame(frame); });
  const relayout = () => { fxSize(); measure(); markCat(); markSugar(); closeTags(); };
  window.addEventListener("resize", relayout);
  window.addEventListener("orientationchange", () => setTimeout(relayout, 250));
  document.fonts && document.fonts.ready.then(() => { markCat(); markSugar(); });
})();
