/* Spiele für Modul 1 und 2: Fisch-Brett, Trennlinie und zwei Kisten.
   Die Fischwerte sind vereinfachte Spielwerte. */
(() => {
  'use strict';
  const fmt = n => n.toLocaleString('de-DE', { maximumFractionDigits: 1 });

  const FISCHE = [
    ['C', 8, 4.5], ['C', 9, 5], ['C', 10, 5.5], ['C', 11, 5.2], ['C', 9.5, 4.8], ['C', 12, 6],
    ['F', 16, 10], ['F', 18, 11], ['F', 20, 12], ['F', 22, 13], ['F', 17, 10.5], ['F', 24, 14],
    ['T', 40, 4.5], ['T', 45, 5], ['T', 50, 5.5], ['T', 55, 6], ['T', 42, 4.2], ['T', 58, 6.5]
  ];
  const ART = { C: 'Clownfisch', F: 'Falterfisch', T: 'Trompetenfisch' };
  const MAX_L = 60, MAX_H = 16;
  const B = { W: 420, H: 320, L: 52, T: 16, R: 16, U: 46 };
  const bx = x => B.L + x * (B.W - B.L - B.R);
  const by = y => B.T + (1 - y) * (B.H - B.T - B.U);
  const SPIELWERTE = 'Die Zahlen sind vereinfachte Spielwerte, keine echten Messungen.';

  function achsen() {
    let s = '';
    for (let l = 0; l <= MAX_L; l += 10) { const X = bx(l / MAX_L); s += `<line class="gitter" x1="${X}" x2="${X}" y1="${B.T}" y2="${B.H - B.U}"/><text class="teilung" x="${X}" y="${B.H - B.U + 16}" text-anchor="middle">${l}</text>`; }
    for (let h = 0; h <= MAX_H; h += 4) { const Y = by(h / MAX_H); s += `<line class="gitter" x1="${B.L}" x2="${B.W - B.R}" y1="${Y}" y2="${Y}"/><text class="teilung" x="${B.L - 8}" y="${Y + 4}" text-anchor="end">${h}</text>`; }
    s += `<text class="achse" x="${(B.L + B.W - B.R) / 2}" y="${B.H - 8}" text-anchor="middle">wie lang (cm)</text>`;
    s += `<text class="achse" text-anchor="middle" transform="translate(15 ${(B.T + B.H - B.U) / 2}) rotate(-90)">wie hoch (cm)</text>`;
    return s;
  }
  function punkt(k, X, Y) {
    if (k === 'C') return `<circle class="pt pt-c" cx="${X}" cy="${Y}" r="7"/>`;
    if (k === 'F') return `<rect class="pt pt-f" x="${X - 6.5}" y="${Y - 6.5}" width="13" height="13" rx="2"/>`;
    return `<path class="pt pt-t" d="M${X} ${Y - 8.5}L${X + 8} ${Y + 5.5}L${X - 8} ${Y + 5.5}Z"/>`;
  }
  const raute = (X, Y, zeichen) => `<path class="pt pt-frage" d="M${X} ${Y - 10}L${X + 10} ${Y}L${X} ${Y + 10}L${X - 10} ${Y}Z"/><text class="frage-text" x="${X}" y="${Y + 3.5}" text-anchor="middle">${zeichen}</text>`;
  const legendenPunkt = k => `<svg viewBox="0 0 20 20" aria-hidden="true">${k === 'C' ? '<circle class="pt pt-c" cx="10" cy="10" r="7"/>' : k === 'F' ? '<rect class="pt pt-f" x="3.500" y="3.500" width="13" height="13" rx="2"/>' : '<path class="pt pt-t" d="M10 2L18 16H2Z"/>'}</svg>`;
  const nachbarn = (l, h, n = 3) => FISCHE.map(f => ({ f, d: Math.hypot(f[1] / MAX_L - l / MAX_L, f[2] / MAX_H - h / MAX_H) })).sort((a, b) => a.d - b.d).slice(0, n);
  function abstimmen(nb) {
    const zahl = {};
    nb.forEach(n => { zahl[n.f[0]] = (zahl[n.f[0]] || 0) + 1; });
    const max = Math.max(...Object.values(zahl));
    const vorn = Object.keys(zahl).filter(k => zahl[k] === max);
    return { uneinig: vorn.length > 1, art: vorn.length > 1 ? nb[0].f[0] : vorn[0] };
  }
  function svgPunkt(svg, e) {
    const m = svg.getScreenCTM();
    if (!m) return null;
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(m.inverse());
  }
  function linieImFeld(L) {
    const P = [], { a, c, b } = L, e = 1e-9;
    const dazu = (x, y) => { if (x >= -e && x <= 1 + e && y >= -e && y <= 1 + e) P.push([x, y]); };
    if (Math.abs(c) > e) { dazu(0, -b / c); dazu(1, -(a + b) / c); }
    if (Math.abs(a) > e) { dazu(-b / a, 0); dazu(-(c + b) / a, 1); }
    if (P.length < 2) return null;
    let best = [P[0], P[1]], weit = -1;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d > weit) { weit = d; best = [P[i], P[j]]; } }
    return weit > 1e-6 ? best : null;
  }
  function flaeche(L) {
    const ecken = [[0, 0], [1, 0], [1, 1], [0, 1]], aus = [], f = p => L.a * p[0] + L.c * p[1] + L.b;
    for (let i = 0; i < 4; i++) {
      const P = ecken[i], Q = ecken[(i + 1) % 4], fp = f(P), fq = f(Q);
      if (fp > 0) aus.push(P);
      if ((fp > 0) !== (fq > 0)) { const t = fp / (fp - fq); aus.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    return aus;
  }

  /* Nah und fern */
  function fischBrett(el) {
    const RAETSEL = [{ n: 1, l: 19, h: 11 }, { n: 2, l: 9, h: 5 }, { n: 3, l: 48, h: 5 }, { n: 4, l: 27, h: 7 }];
    const st = { tipp: {}, liegt: {}, frei: null };
    el.innerHTML = `<div class="brett-raster"><figure class="brett"><svg viewBox="0 0 ${B.W} ${B.H}" class="klickbar" role="img" aria-label="Brett: Länge nach rechts, Höhe nach oben. Tippe, um einen eigenen Fisch hinzulegen."></svg>
      <figcaption class="legende"><span>${legendenPunkt('C')} Clownfisch</span><span>${legendenPunkt('F')} Falterfisch</span><span>${legendenPunkt('T')} Trompetenfisch</span><span>Tipp: Tippe aufs Brett und leg einen eigenen Fisch hin.</span><span>${SPIELWERTE}</span></figcaption></figure>
      <div class="seite"><h3>Rätselfische</h3><ul class="raetsel">${RAETSEL.map(r => `<li data-n="${r.n}"><span class="raetsel-kopf">Fisch ${r.n}: ${fmt(r.l)} cm lang, ${fmt(r.h)} cm hoch</span>
        <span class="wahl" role="group" aria-label="Was glaubst du?">${['C', 'F', 'T'].map(k => `<button type="button" class="wahl-knopf" data-n="${r.n}" data-art="${k}" aria-pressed="false">${ART[k]}</button>`).join('')}</span>
        <span><button type="button" class="knopf" data-legen="${r.n}" disabled>Aufs Brett legen</button></span><p class="anzeige" aria-live="polite"></p></li>`).join('')}</ul><p class="anzeige" id="freier-fisch" aria-live="polite"></p></div></div>`;
    const svg = el.querySelector('svg');
    const sagt = (nb, v) => {
      const namen = nb.map(n => ART[n.f[0]]).join(', ');
      return v.uneinig ? `Die Nachbarn: ${namen}. Sie sind sich nicht einig! Der Computer nimmt den allernächsten: <strong>${ART[v.art]}</strong>.` : `Die Nachbarn: ${namen}. Der Computer sagt: <strong>${ART[v.art]}</strong>.`;
    };
    const zeichnen = () => {
      let s = achsen(), oben = '';
      const markieren = (l, h, z) => {
        const X = bx(l / MAX_L), Y = by(h / MAX_H);
        nachbarn(l, h).forEach(n => { s += `<line class="nachbar-linie" x1="${X}" y1="${Y}" x2="${bx(n.f[1] / MAX_L)}" y2="${by(n.f[2] / MAX_H)}"/>`; });
        oben += raute(X, Y, z);
      };
      RAETSEL.forEach(r => { if (st.liegt[r.n]) markieren(r.l, r.h, r.n); });
      if (st.frei) markieren(st.frei.l, st.frei.h, '?');
      FISCHE.forEach(f => { s += punkt(f[0], bx(f[1] / MAX_L), by(f[2] / MAX_H)); });
      svg.innerHTML = s + oben;
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b && b.dataset.art) {
        st.tipp[b.dataset.n] = b.dataset.art;
        el.querySelectorAll(`.wahl-knopf[data-n="${b.dataset.n}"]`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        el.querySelector(`[data-legen="${b.dataset.n}"]`).disabled = false;
        return;
      }
      if (b && b.dataset.legen) {
        const r = RAETSEL.find(x => x.n === +b.dataset.legen);
        st.liegt[r.n] = true;
        zeichnen();
        const nb = nachbarn(r.l, r.h);
        b.closest('li').querySelector('.anzeige').innerHTML = `${sagt(nb, abstimmen(nb))} Du hast gesagt: ${ART[st.tipp[r.n]]}.`;
      }
    });
    svg.addEventListener('click', e => {
      const P = svgPunkt(svg, e);
      if (!P) return;
      const x = (P.x - B.L) / (B.W - B.L - B.R), y = 1 - (P.y - B.T) / (B.H - B.T - B.U);
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      const l = Math.round(x * MAX_L), h = Math.round(y * MAX_H * 10) / 10;
      st.frei = { l, h };
      zeichnen();
      const nb = nachbarn(l, h);
      el.querySelector('#freier-fisch').innerHTML = `<strong>Dein Fisch:</strong> ${fmt(l)} cm lang, ${fmt(h)} cm hoch. ${sagt(nb, abstimmen(nb))}`;
    });
    zeichnen();
    return {
      kontrolle: () => `<div class="tabelle-scroll"><table class="kontroll-tabelle"><thead><tr><th scope="col">Fisch</th><th scope="col">Nachbarn</th><th scope="col">Der Computer sagt</th></tr></thead><tbody>${RAETSEL.map(r => {
        const nb = nachbarn(r.l, r.h), v = abstimmen(nb);
        return `<tr><td>${r.n}: ${fmt(r.l)} cm lang, ${fmt(r.h)} cm hoch</td><td>${nb.map(n => ART[n.f[0]]).join(', ')}</td><td><strong>${ART[v.art]}</strong>${v.uneinig ? '<br><span class="warum">Hier sind sich die Nachbarn nicht einig.</span>' : ''}</td></tr>`;
      }).join('')}</tbody></table></div><p>Fisch 4 liegt genau zwischen allen Gruppen. Auch ein Mensch würde da zögern. Der Computer antwortet trotzdem, und er klingt dabei genauso sicher wie sonst.</p>`
    };
  }

  /* Die Trennlinie */
  function trennLinie(el) {
    const pts = FISCHE.filter(f => f[0] !== 'C').map(f => ({ k: f[0], x: f[1] / MAX_L, y: f[2] / MAX_H, t: f[0] === 'F' ? 1 : -1 }));
    const st = { modus: 'du', l: 80, r: 30 };
    const kiNeu = () => Object.assign(st, { a: 0, c: 1, b: -0.95, schritt: 0, zeiger: -1, zuletzt: null, verlauf: [6], fertig: false });
    kiNeu();
    const aktuell = () => (st.modus === 'du' ? { a: -(st.r / 100 - st.l / 100), c: 1, b: -st.l / 100 } : { a: st.a, c: st.c, b: st.b });
    const falsch = L => pts.filter(p => p.t * (L.a * p.x + L.c * p.y + L.b) <= 0);
    el.innerHTML = `<div class="reiter" role="tablist" aria-label="Wer schiebt die Linie?"><button type="button" role="tab" data-modus="du" aria-selected="true">Du schiebst</button><button type="button" role="tab" data-modus="ki" aria-selected="false">Der Computer übt</button></div>
      <div class="brett-raster"><figure class="brett"><svg viewBox="0 0 ${B.W} ${B.H}" role="img" aria-label="Brett mit Falterfischen, Trompetenfischen und einer Trennlinie"></svg>
      <figcaption class="legende"><span>${legendenPunkt('F')} Falterfisch</span><span>${legendenPunkt('T')} Trompetenfisch</span><span>Getönt: Hier sagt der Computer „Falterfisch“. Kreis: Dieser Fisch liegt falsch.</span><span>${SPIELWERTE}</span></figcaption></figure><div class="seite"></div></div>`;
    const svg = el.querySelector('svg'), seite = el.querySelector('.seite');
    const zeichnen = () => {
      const L = aktuell(), W = falsch(L);
      let s = achsen();
      const poly = flaeche(L);
      if (poly.length >= 3) s += `<polygon class="gebiet" points="${poly.map(p => `${bx(p[0])},${by(p[1])}`).join(' ')}"/>`;
      const seg = linieImFeld(L);
      if (seg) s += `<line class="trenn" x1="${bx(seg[0][0])}" y1="${by(seg[0][1])}" x2="${bx(seg[1][0])}" y2="${by(seg[1][1])}"/>`;
      pts.forEach(p => { s += punkt(p.k, bx(p.x), by(p.y)); });
      W.forEach(p => { s += `<circle class="ring" cx="${bx(p.x)}" cy="${by(p.y)}" r="13"/>`; });
      if (st.modus === 'ki' && st.zuletzt) s += `<circle class="ring zuletzt" cx="${bx(st.zuletzt.x)}" cy="${by(st.zuletzt.y)}" r="17"/>`;
      svg.innerHTML = s;
      return W.length;
    };
    const balken = () => {
      const n = st.verlauf.length, w = 100 / Math.max(n, 12);
      return `<svg class="fehler-balken" viewBox="0 0 100 46" preserveAspectRatio="none" aria-label="Fehler nach jedem Schritt">${st.verlauf.map((h, i) => `<rect x="${i * w + w * 0.15}" y="${42 - h * 6}" width="${w * 0.7}" height="${Math.max(h * 6, 0.6)}" rx="1"/>`).join('')}<line x1="0" x2="100" y1="42.5" y2="42.5"/></svg>`;
    };
    const duText = n => (n ? `Fische auf der falschen Seite: <strong>${n}</strong>` : 'Alle Fische liegen auf der richtigen Seite.');
    const cm = w => fmt(w / 100 * MAX_H);
    const seiteZeichnen = () => {
      if (st.modus === 'du') {
        seite.innerHTML = `<div class="regler"><label for="linie-l">Linie links: <span id="linie-l-wert">${cm(st.l)}</span> cm</label><input type="range" id="linie-l" min="0" max="100" value="${st.l}"></div><div class="regler"><label for="linie-r">Linie rechts: <span id="linie-r-wert">${cm(st.r)}</span> cm</label><input type="range" id="linie-r" min="0" max="100" value="${st.r}"></div><p class="anzeige" id="linie-text" aria-live="polite"></p>`;
        seite.querySelector('#linie-text').innerHTML = duText(zeichnen());
      } else {
        const n = zeichnen();
        seite.innerHTML = `<p>Der Computer fängt mit einer Linie ganz oben an. Bei jedem Schritt sucht er einen Fisch auf der falschen Seite und schiebt die Linie ein kleines Stück zu ihm hin.</p><p class="knopf-reihe"><button type="button" class="knopf" data-ki="1"${st.fertig ? ' disabled' : ''}>Ein Schritt</button><button type="button" class="knopf leise-knopf" data-ki="10"${st.fertig ? ' disabled' : ''}>Zehn Schritte</button><button type="button" class="link-knopf" data-ki="neu">Von vorn</button></p><p class="anzeige" aria-live="polite">Schritt ${st.schritt} · falsche Seite: <strong>${n}</strong>${st.fertig ? '<br>Kein Fehler mehr. Der Computer hat aus seinen Fehlern gelernt.' : ''}</p><div><p class="zwischenstand">Fehler nach jedem Schritt</p>${balken()}</div>`;
      }
    };
    const lernen = () => {
      const L = aktuell(), n = pts.length;
      for (let k = 1; k <= n; k++) {
        const i = (st.zeiger + k) % n, p = pts[i];
        if (p.t * (L.a * p.x + L.c * p.y + L.b) <= 0) {
          st.a += 0.02 * p.t * p.x; st.c += 0.02 * p.t * p.y; st.b += 0.02 * p.t;
          st.zeiger = i; st.schritt++; st.zuletzt = p;
          st.verlauf.push(falsch(aktuell()).length);
          return true;
        }
      }
      st.zuletzt = null; st.fertig = true;
      return false;
    };
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-modus]');
      if (t) {
        st.modus = t.dataset.modus;
        el.querySelectorAll('[data-modus]').forEach(x => x.setAttribute('aria-selected', String(x === t)));
        seiteZeichnen();
        return;
      }
      const k = e.target.closest('[data-ki]');
      if (!k) return;
      if (k.dataset.ki === 'neu') kiNeu();
      else {
        for (let i = 0; i < +k.dataset.ki; i++) if (!lernen()) break;
        if (!falsch(aktuell()).length) st.fertig = true;
      }
      seiteZeichnen();
    });
    el.addEventListener('input', e => {
      if (e.target.id === 'linie-l') { st.l = +e.target.value; el.querySelector('#linie-l-wert').textContent = cm(st.l); }
      else if (e.target.id === 'linie-r') { st.r = +e.target.value; el.querySelector('#linie-r-wert').textContent = cm(st.r); }
      else return;
      el.querySelector('#linie-text').innerHTML = duText(zeichnen());
    });
    seiteZeichnen();
    return {
      kontrolle: () => '<p>So kann es aussehen: Die Linie liegt links und rechts bei etwa 8 cm. Dann sind alle flachen Trompetenfische unten und alle hohen Falterfische oben. Es gibt viele gute Linien!</p><p>Beim Üben zeigen dir die Balken: Mit jedem Schritt werden die Fehler weniger. Genau das heißt „trainieren“.</p>'
    };
  }

  /* Die zwei Kisten */
  const FARBE = { orange: '#F28C28', gelb: '#F4C92F', blau: '#4A95E6' };
  const FARB_ADJ = { orange: 'oranger', gelb: 'gelber', blau: 'blauer' };
  const NAME = { falter: 'Falterfisch', trompete: 'Trompetenfisch', unbekannt: 'Weiß nicht' };
  const FORM = { falter: 'rund', trompete: 'länglich' };
  function spielFisch(art, farbe) {
    const f = FARBE[farbe];
    const strich = 'stroke="#17324D" stroke-width="2.200" stroke-linejoin="round"';
    if (art === 'falter') return `<svg viewBox="0 0 48 48" role="img" aria-label="${FARB_ADJ[farbe]} Falterfisch"><path d="M34 24L46 14V34Z" fill="${f}" ${strich}/><ellipse cx="22" cy="24" rx="15" ry="18" fill="${f}" ${strich}/><path d="M23 8V40" fill="none" stroke="#17324D" stroke-width="1.500" opacity=".4"/><circle cx="13" cy="20" r="2.600" fill="#17324D"/></svg>`;
    return `<svg viewBox="0 0 48 48" role="img" aria-label="${FARB_ADJ[farbe]} Trompetenfisch"><path d="M40 24L47 18V30Z" fill="${f}" ${strich}/><path d="M2 24L14 21C22 19 34 19 41 24C34 29 22 29 14 27Z" fill="${f}" ${strich}/><circle cx="16" cy="23.500" r="2.200" fill="#17324D"/></svg>`;
  }
  const gross = s => s[0].toUpperCase() + s.slice(1);
  function zweiKisten(el) {
    const KISTEN = {
      A: [['falter', 'orange'], ['falter', 'orange'], ['falter', 'orange'], ['falter', 'orange'], ['trompete', 'blau'], ['trompete', 'blau'], ['trompete', 'blau'], ['trompete', 'blau']],
      B: [['falter', 'orange'], ['falter', 'gelb'], ['falter', 'blau'], ['falter', 'orange'], ['trompete', 'blau'], ['trompete', 'blau'], ['trompete', 'gelb'], ['trompete', 'gelb']]
    };
    const TEST = [{ art: 'falter', farbe: 'gelb' }, { art: 'falter', farbe: 'blau' }, { art: 'falter', farbe: 'orange' }, { art: 'trompete', farbe: 'gelb' }];
    const lernen = key => {
      const daten = KISTEN[key].map(([art, farbe]) => ({ art, farbe, form: FORM[art] }));
      let best = null;
      ['farbe', 'form'].forEach(merkmal => {
        const gruppen = {};
        daten.forEach(d => { (gruppen[d[merkmal]] = gruppen[d[merkmal]] || { falter: 0, trompete: 0 })[d.art]++; });
        let fehler = 0;
        const karte = {};
        Object.keys(gruppen).forEach(v => { const g = gruppen[v]; karte[v] = g.falter >= g.trompete ? 'falter' : 'trompete'; fehler += Math.min(g.falter, g.trompete); });
        if (!best || fehler < best.fehler) best = { merkmal, karte, fehler };
      });
      return best;
    };
    const MODELL = { A: lernen('A'), B: lernen('B') };
    const raten = (m, x) => (m.merkmal === 'farbe' ? (m.karte[x.farbe] || 'unbekannt') : (m.karte[FORM[x.art]] || 'unbekannt'));
    const fischName = x => `${FARB_ADJ[x.farbe]} ${NAME[x.art]}`;
    const regelText = m => {
      if (m.merkmal === 'farbe') {
        const gesehen = Object.keys(m.karte), neu = Object.keys(FARBE).filter(c => !gesehen.includes(c));
        return { regel: gesehen.map(c => `${gross(c)} heißt ${NAME[m.karte[c]]}.`).join(' '), mehr: `Er schaut nur auf die Farbe.${neu.length ? ` Die Farbe ${neu.join(', ')} hat er noch nie gesehen.` : ''}` };
      }
      return { regel: Object.keys(m.karte).map(v => `${gross(v)} heißt ${NAME[m.karte[v]]}.`).join(' '), mehr: 'Er schaut auf die Form, weil es Falterfische und Trompetenfische in vielen Farben gab.' };
    };
    const st = { modell: null, tipp: { A: {}, B: {} }, offen: { A: {}, B: {} } };
    el.innerHTML = `<div class="kisten">${['A', 'B'].map(k => `<div class="kiste" data-kiste="${k}"><h3>Kiste ${k}</h3><div class="fisch-reihe">${KISTEN[k].map(([a, f]) => spielFisch(a, f)).join('')}</div><p class="leise">${k === 'A' ? 'Nur orange Falterfische und blaue Trompetenfische' : 'Falterfische und Trompetenfische in vielen Farben'}</p><p><button type="button" class="knopf" data-ueben="${k}">Mit Kiste ${k} üben</button></p></div>`).join('')}</div><div id="gelernt" aria-live="polite"></div><div id="test"></div>`;
    const zeichnen = () => {
      el.querySelectorAll('.kiste').forEach(k => k.classList.toggle('aktiv', k.dataset.kiste === st.modell));
      if (!st.modell) { el.querySelector('#gelernt').innerHTML = '<p class="leise">Der Computer hat noch nicht geübt.</p>'; el.querySelector('#test').innerHTML = ''; return; }
      const m = MODELL[st.modell], r = regelText(m);
      el.querySelector('#gelernt').innerHTML = `<div class="gelernt"><span class="zwischenstand">Mit Kiste ${st.modell} hat der Computer gelernt:</span><strong>${r.regel}</strong><span>${r.mehr}</span></div>`;
      el.querySelector('#test').innerHTML = `<h3 class="test-titel">Neue Fische, die er noch nie gesehen hat</h3><ul class="testliste">${TEST.map((x, i) => {
        const t = st.tipp[st.modell][i], auf = st.offen[st.modell][i];
        return `<li class="testfisch">${spielFisch(x.art, x.farbe)}<div class="testfisch-text"><span class="raetsel-kopf">${gross(fischName(x))}</span><span class="wahl" role="group" aria-label="Was sagt der Computer?">${['falter', 'trompete', 'unbekannt'].map(v => `<button type="button" class="wahl-knopf" data-i="${i}" data-tipp="${v}" aria-pressed="${t === v}">${NAME[v]}</button>`).join('')}</span>${auf ? `<span>Der Computer sagt: <strong>${NAME[raten(m, x)]}</strong>. Du hast vermutet: ${NAME[t]}.</span>` : `<span><button type="button" class="link-knopf" data-auf="${i}"${t ? '' : ' disabled'}>Aufdecken</button></span>`}</div></li>`;
      }).join('')}</ul>`;
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.ueben) st.modell = b.dataset.ueben;
      else if (b.dataset.tipp) st.tipp[st.modell][b.dataset.i] = b.dataset.tipp;
      else if (b.dataset.auf) st.offen[st.modell][b.dataset.auf] = true;
      else return;
      zeichnen();
    });
    zeichnen();
    return {
      kontrolle: () => `<div class="tabelle-scroll"><table class="kontroll-tabelle"><thead><tr><th scope="col">Neuer Fisch</th><th scope="col">Computer mit Kiste A</th><th scope="col">Computer mit Kiste B</th></tr></thead><tbody>${TEST.map(x => `<tr><td>${gross(fischName(x))}</td><td>${NAME[raten(MODELL.A, x)]}</td><td>${NAME[raten(MODELL.B, x)]}</td></tr>`).join('')}</tbody></table></div><p>Mit Kiste A hat der Computer nie einen blauen Falterfisch gesehen. Er denkt, er ist ein Trompetenfisch, weil er nur auf die Farbe schaut. Mit Kiste B hat er viele verschiedene Beispiele gesehen. Darum hat er gelernt, auf die Form zu achten.</p><p>Das passiert auch in echt: Manche Computer erkennen Gesichter von Menschen mit dunkler Haut schlechter. In ihren Beispielen gab es zu wenige solche Bilder.</p>`
    };
  }

  /* ---------- Kleines Sprachprogramm ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TEXT = [
    'Der Fisch schwimmt in das Seegras.',
    'Der Fisch frisst einen Krebs.',
    'Die Schildkröte schwimmt auf das Riff.',
    'Die Schildkröte schläft in der Sonne.',
    'Das Seegras liegt hinter dem Riff.',
    'Die Sonne scheint auf das Riff.',
    'Der Fisch schläft in der Höhle.',
    'Die Schildkröte frisst eine Qualle.',
    'Das Kind schwimmt in das Seegras.',
    'Das Kind spielt mit dem Fisch.'
  ];
  const woerterVon = s => s.replace(/\./g, ' .').split(/\s+/).filter(Boolean);
  const FOLGT = {};
  TEXT.forEach((s, i) => {
    const w = woerterVon(s);
    for (let j = 0; j < w.length - 1; j++) {
      const n = (FOLGT[w[j]] = FOLGT[w[j]] || {});
      (n[w[j + 1]] = n[w[j + 1]] || []).push(i + 1);
    }
  });
  const ANFAENGE = ['Der', 'Die', 'Das'];
  const satzAus = w => w.join(' ').replace(/ \./g, '.');
  function naechstesWort(w) {
    const c = FOLGT[w];
    if (!c) return '.';
    const summe = Object.values(c).reduce((s, v) => s + v.length, 0);
    let r = Math.random() * summe;
    for (const [k, v] of Object.entries(c)) { r -= v.length; if (r < 0) return k; }
    return Object.keys(c)[0];
  }
  function satzErfinden() {
    const aus = [ANFAENGE[Math.floor(Math.random() * 3)]];
    while (aus[aus.length - 1] !== '.' && aus.length < 16) aus.push(naechstesWort(aus[aus.length - 1]));
    if (aus[aus.length - 1] !== '.') aus.push('.');
    return satzAus(aus);
  }
  const textListe = () => `<details class="quelle"><summary>Die zehn Sätze, aus denen das Programm gelernt hat</summary><ol>${TEXT.map(s => `<li>${s}</li>`).join('')}</ol></details>`;

  /* Das nächste Wort */
  function naechstesWortSpiel(el) {
    const st = { jetzt: [], liste: [] };
    el.innerHTML = `<div class="satz" aria-live="polite"></div><div class="satz-wahl"></div><div><h3 class="test-titel">Deine Sätze</h3><ol class="saetze"></ol><p class="leise saetze-leer">Noch keine.</p></div>${textListe()}`;
    const satz = el.querySelector('.satz'), wahl = el.querySelector('.satz-wahl'), liste = el.querySelector('.saetze'), leer = el.querySelector('.saetze-leer');
    const zeichnen = () => {
      satz.innerHTML = st.jetzt.length ? st.jetzt.filter(w => w !== '.').map(w => `<span class="satz-wort">${w}</span>`).join('') + (st.jetzt[st.jetzt.length - 1] === '.' ? '<span class="satz-wort">.</span>' : '') : '<span class="leise">Wähle ein erstes Wort.</span>';
      const letztes = st.jetzt[st.jetzt.length - 1];
      if (!st.jetzt.length) wahl.innerHTML = `<p>Womit soll dein Satz anfangen?</p><p class="knopf-reihe">${ANFAENGE.map(w => `<button type="button" class="knopf" data-w="${w}">${w}</button>`).join('')}</p>`;
      else if (letztes === '.') wahl.innerHTML = '<p>Dein Satz ist fertig!</p><p><button type="button" class="knopf" data-neu="1">Neuer Satz</button></p>';
      else {
        const c = FOLGT[letztes] || {}, summe = Object.values(c).reduce((s, v) => s + v.length, 0), reihen = Object.entries(c).sort((a, b) => b[1].length - a[1].length);
        wahl.innerHTML = `<p>Im Text kommt nach <strong>„${letztes}“</strong>:</p><div class="kandidaten">${reihen.map(([w, v]) => {
          const p = Math.round(v.length / summe * 100);
          return `<button type="button" class="kandidat" data-w="${w}"><span>${w === '.' ? 'Satzende' : w}</span><span class="balken-spur"><span class="balken" style="width:${p}%"></span></span><span>${p} %</span></button>`;
        }).join('')}</div><p class="knopf-reihe"><button type="button" class="knopf leise-knopf" data-wuerfel="1">Würfeln lassen</button><button type="button" class="link-knopf" data-neu="1">Satz wegwerfen</button></p>`;
      }
      liste.innerHTML = st.liste.map(s => `<li>${s}</li>`).join('');
      leer.hidden = st.liste.length > 0;
    };
    const dazu = w => {
      st.jetzt.push(w);
      if (w === '.') st.liste.push(satzAus(st.jetzt));
      else if (st.jetzt.length >= 16) { st.jetzt.push('.'); st.liste.push(satzAus(st.jetzt)); }
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.w) dazu(b.dataset.w);
      else if (b.dataset.wuerfel) dazu(naechstesWort(st.jetzt[st.jetzt.length - 1]));
      else if (b.dataset.neu) st.jetzt = [];
      else return;
      zeichnen();
    });
    zeichnen();
    return {
      kontrolle: () => '<p>Nach „Die“ kommt im Text dreimal „Schildkröte“ und einmal „Sonne“. Darum steht bei „Schildkröte“ 75 % und bei „Sonne“ 25 %. Zähl selbst in den zehn Sätzen nach!</p><p>Echte Chatbots haben viel, viel mehr gelesen und schauen auf viele Wörter davor. Aber sie machen es im Grunde genauso: Sie suchen ein Wort, das wahrscheinlich als Nächstes kommt.</p>'
    };
  }

  /* Wortstücke */
  const WORTSCHATZ = ['der', 'die', 'das', 'und', 'ist', 'sind', 'ein', 'eine', 'nicht', 'ich', 'du', 'wir', 'sie', 'es', 'in', 'mit', 'auf', 'für', 'zu', 'von', 'mag', 'schule', 'kind', 'kinder', 'lehr', 'haus', 'maschine', 'modell', 'sprach', 'wort', 'lern', 'künst', 'lich', 'intelligenz', 'glaub', 'un', 'spann', 'end', 'er', 'en', 'e', 'n', 'chen', 'ge', 'be', 'ver', 'heute', 'gut', 'hallo', 'fisch', 'riff', 'sonne', 'koral', 'le', 'meeres', 'schild', 'kröt', 'see', 'pferd', 'gras', 'krebs', 'qualle', 'spiel', 'platz', 'tag', 'frage', 'chat', 'bot', 'computer', 'ki', 'groß', 'klein', 'sehr', 'auch', 'wie', 'was', 'wer', 'hat', 'kann', 'st', 't', 's'];
  const NUMMER = new Map(WORTSCHATZ.map((v, i) => [v, 101 + i * 7]));
  function zerlegen(text) {
    const aus = [];
    (text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || []).forEach(w => {
      const klein = w.toLowerCase();
      let i = 0;
      while (i < klein.length) {
        let len = Math.min(14, klein.length - i), treffer = null;
        for (; len > 0; len--) { const stueck = klein.slice(i, i + len); if (NUMMER.has(stueck)) { treffer = stueck; break; } }
        if (treffer) { aus.push({ t: w.slice(i, i + treffer.length), id: NUMMER.get(treffer) }); i += treffer.length; }
        else { const z = w.slice(i, i + 1); aus.push({ t: z, id: 5000 + (z.codePointAt(0) % 997) }); i += 1; }
      }
    });
    return aus;
  }
  function wortStuecke(el) {
    el.innerHTML = `<label class="eintrag-frage" for="stueck-text">Dein Text</label><input type="text" class="text-feld" id="stueck-text" value="Ich mag Korallen und Meeresschildkröten." autocomplete="off">
      <div class="knopf-reihe"><span class="leise">Probier mal:</span>${['Koralle', 'Meeresschildkröte', 'Seepferdchen', 'Fisch', 'Riff'].map(w => `<button type="button" class="wahl-knopf" data-probe="${w}">${w}</button>`).join('')}<span class="leise">oder deinen Vornamen.</span></div>
      <div class="stuecke" aria-live="polite"></div><p class="stueck-zahl"></p><p class="leise">Das ist ein kleines Beispiel-Wörterbuch mit ausgedachten Nummern. Echte Chatbots kennen sehr viel mehr Stücke.</p>`;
    const feld = el.querySelector('#stueck-text');
    const zeichnen = () => {
      const t = zerlegen(feld.value), w = (feld.value.match(/[\p{L}\p{N}]+/gu) || []).length;
      el.querySelector('.stuecke').innerHTML = t.map(x => `<span class="stueck"><span class="stueck-t">${esc(x.t)}</span><span class="stueck-nr">${x.id}</span></span>`).join('');
      el.querySelector('.stueck-zahl').textContent = `${w} Wörter · ${t.length} Stücke`;
    };
    feld.addEventListener('input', zeichnen);
    el.addEventListener('click', e => { const b = e.target.closest('[data-probe]'); if (b) { feld.value = b.dataset.probe; zeichnen(); } });
    zeichnen();
    return {
      kontrolle: () => '<p>Häufige Wörter wie „ich“ oder „Fisch“ sind ein Stück. „Koralle“ wird zu Koral · le. Seltene Namen zerfallen in einzelne Buchstaben.</p><p>Darum war es für Chatbots lange schwer, Buchstaben zu zählen. Zum Beispiel die zwei „l“ in „Koralle“: Der Chatbot sieht nur „Koral“ und „le“, nicht die einzelnen Buchstaben.</p>'
    };
  }

  /* Klingt richtig */
  function klingtRichtig(el) {
    const st = {
      saetze: ['Die Schildkröte frisst eine Qualle.', 'Der Fisch frisst eine Qualle.', 'Die Schildkröte schläft in der Höhle.', 'Das Kind schwimmt auf das Riff.', 'Das Seegras liegt hinter dem Fisch.', 'Die Sonne scheint auf das Riff.'],
      wahl: {}, offen: {}
    };
    el.innerHTML = `<ul class="satz-liste"></ul><p class="knopf-reihe"><button type="button" class="knopf" data-neu="1">Drei neue Sätze erfinden lassen</button></p>${textListe()}`;
    const ul = el.querySelector('.satz-liste');
    const herkunft = s => {
      const w = woerterVon(s), paare = [];
      for (let i = 0; i < w.length - 1; i++) {
        const v = (FOLGT[w[i]] || {})[w[i + 1]];
        paare.push(`<li>${w[i]} → ${w[i + 1] === '.' ? 'Ende' : w[i + 1]} <small>${v ? `Satz ${v.join(', ')}` : 'nirgends'}</small></li>`);
      }
      return `<span>Steht der ganze Satz im Text? <strong>${TEXT.includes(s) ? 'Ja' : 'Nein'}</strong>. Woher die Wortpaare kommen:</span><ul class="paare">${paare.join('')}</ul>`;
    };
    const zeichnen = () => {
      ul.innerHTML = st.saetze.map((s, i) => `<li><span class="satz-gross">„${s}“</span><span class="wahl" role="group" aria-label="Was meinst du?">${[['text', 'Steht im Text'], ['erf', 'Erfunden']].map(([k, l]) => `<button type="button" class="wahl-knopf" data-i="${i}" data-urteil="${k}" aria-pressed="${st.wahl[i] === k}">${l}</button>`).join('')}</span>${st.offen[i] ? `<div class="herkunft">${herkunft(s)}</div>` : `<span><button type="button" class="link-knopf" data-pruefen="${i}">Im Text nachschauen</button></span>`}</li>`).join('');
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.urteil) st.wahl[b.dataset.i] = b.dataset.urteil;
      else if (b.dataset.pruefen) st.offen[b.dataset.pruefen] = true;
      else if (b.dataset.neu) {
        let versuche = 0, neu = 0;
        while (neu < 3 && versuche < 40) { versuche++; const g = satzErfinden(); if (!st.saetze.includes(g)) { st.saetze.push(g); neu++; } }
      } else return;
      zeichnen();
    });
    zeichnen();
    return {
      kontrolle: () => `<div class="tabelle-scroll"><table class="kontroll-tabelle"><thead><tr><th scope="col">Satz</th><th scope="col">Im Text?</th></tr></thead><tbody>${st.saetze.map(s => `<tr><td>${s}</td><td>${TEXT.includes(s) ? 'steht im Text' : '<strong>erfunden</strong>'}</td></tr>`).join('')}</tbody></table></div><p>Jedes Wortpaar gibt es wirklich. Nur der ganze Satz ist erfunden! Das Programm prüft nicht, ob etwas stimmt. Es prüft nur, ob es gut klingt. So flunkern auch große Chatbots.</p><p>Darum: Was ein Chatbot sagt, immer nachprüfen. In einem Buch oder bei einem Erwachsenen.</p>`
    };
  }

  /* Ein guter Auftrag */
  function guterAuftrag(el) {
    const BAU = [
      { id: 'wer', l: 'Wer?', t: 'Die Hauptfigur ist ein kleiner Clownfisch namens Flitzi.' },
      { id: 'wo', l: 'Wo?', t: 'Die Geschichte spielt im Korallenriff.' },
      { id: 'lang', l: 'Wie lang?', t: 'Höchstens fünf Sätze.' },
      { id: 'leser', l: 'Für wen?', t: 'Für ein Kind, das gerade lesen lernt. Nur kurze Sätze.' }
    ];
    const an = {};
    const geschichte = () => {
      const F = an.wer, held = F ? 'der kleine Clownfisch Flitzi' : 'ein Mädchen', er = F ? 'er' : 'sie', Er = F ? 'Er' : 'Sie', der = F ? 'der' : 'das', ort = an.wo ? 'im Korallenriff' : 'am Strand';
      if (an.leser) {
        let s = [`Es war einmal ${held}.`, `${Er} wohnte ${ort}.`, `Eines Tages fand ${er} eine rote Muschel.`, 'Die Muschel konnte sprechen!', 'Von da an waren sie Freunde.'];
        if (!an.lang) s = s.concat(['Jeden Morgen sagten sie Hallo.', 'Sie spielten Fangen und lachten viel.', 'Im Sommer besuchten sie die anderen Muscheln.', 'Und wenn sie nicht umgezogen sind, dann spielen sie noch heute.']);
        return s.join(' ');
      }
      let s = [`Es war einmal ${held}, ${der} ${ort} wohnte und sich jeden Tag fragte, was es wohl Neues zu entdecken gäbe.`, `Als ${er} eines Morgens zwischen den Steinen eine leuchtend rote Muschel entdeckte, staunte ${er} nicht schlecht, denn die Muschel begann plötzlich zu sprechen.`, 'Von diesem Tag an waren die beiden unzertrennliche Freunde.'];
      if (!an.lang) s = s.concat(['Gemeinsam erlebten sie zahlreiche Abenteuer, über die man sich noch lange erzählte, und wann immer jemand traurig war, wussten sie genau, wie man ihn wieder zum Lachen bringen konnte.', 'Und so vergingen die Jahreszeiten, eine nach der anderen.']);
      return s.join(' ');
    };
    el.innerHTML = `<p>Der Auftrag: <strong class="auftrag-satz">„Erzähl mir eine Geschichte.“</strong> Tippe Bausteine an, um sie dazuzulegen.</p>
      <div class="bausteine">${BAU.map(b => `<button type="button" class="baustein" data-b="${b.id}" aria-pressed="false"><span class="baustein-name">${b.l}</span><span>${b.t}</span></button>`).join('')}</div>
      <div class="auftrag-raster"><div class="kasten"><span class="kasten-titel">Dein Auftrag an die KI</span><pre class="mono" id="auftrag-text"></pre></div><div class="kasten"><span class="kasten-titel">So könnte die KI antworten (vorher ausgedacht)</span><pre id="auftrag-antwort" aria-live="polite"></pre></div></div>
      <fieldset class="pruefen"><legend>Prüf die Geschichte selbst</legend>${['Kommt der Clownfisch Flitzi vor?', 'Spielt sie im Korallenriff?', 'Ist sie kurz?', 'Kannst du sie leicht lesen?'].map((t, i) => `<label for="pruef${i}"><input type="checkbox" id="pruef${i}"> ${t}</label>`).join('')}</fieldset>`;
    const zeichnen = () => {
      el.querySelectorAll('.baustein').forEach(b => b.setAttribute('aria-pressed', String(!!an[b.dataset.b])));
      el.querySelector('#auftrag-text').textContent = ['Erzähl mir eine Geschichte.', ...BAU.filter(b => an[b.id]).map(b => b.t)].join('\n');
      el.querySelector('#auftrag-antwort').textContent = geschichte();
    };
    el.addEventListener('click', e => { const b = e.target.closest('.baustein'); if (!b) return; an[b.dataset.b] = !an[b.dataset.b]; zeichnen(); });
    zeichnen();
    return {
      kontrolle: () => '<div class="tabelle-scroll"><table class="kontroll-tabelle"><thead><tr><th scope="col">Baustein</th><th scope="col">Was er ändert</th></tr></thead><tbody><tr><td>Wer?</td><td>Ohne ihn erfindet die KI irgendeine Figur.</td></tr><tr><td>Wo?</td><td>Ohne ihn sucht sich die KI selbst einen Ort aus.</td></tr><tr><td>Wie lang?</td><td>Ohne ihn wird die Geschichte lang und schweifig.</td></tr><tr><td>Für wen?</td><td>Ohne ihn schreibt die KI lange, schwere Sätze.</td></tr></tbody></table></div><p>Merke: Schreib deinen Auftrag so, als würdest du ihn jemandem geben, der dich gar nicht kennt.</p>'
    };
  }

  window.RIFF.spiele = { brett: fischBrett, trennlinie: trennLinie, kisten: zweiKisten, naechstesWort: naechstesWortSpiel, wortstuecke: wortStuecke, klingtRichtig, auftrag: guterAuftrag };
})();
