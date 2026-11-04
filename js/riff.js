(() => {
  'use strict';
  const R = window.RIFF;
  const app = document.getElementById('app');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const STATIONEN = R.module.flatMap(m => m.stationen);
  const PER_ID = Object.fromEntries(STATIONEN.map(s => [s.id, s]));

  /* ---------- Speicher: bleibt nur in diesem Browser ---------- */
  const KEY = 'ki-korallenriff-v1';
  const leererSpeicher = () => ({ name: '', done: {}, stempel: {}, zeit: {}, eintraege: {}, ziele: {} });
  let store = leererSpeicher();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && typeof s === 'object') store = Object.assign(store, s);
  } catch (e) { /* Ohne Speicher läuft die Seite trotzdem. */ }

  /* Vorschau zum Ansehen: index.html?vorschau=5 zeigt das Riff mit 5 fertigen Stationen.
     Dabei wird nichts gespeichert. */
  const vorschau = new URLSearchParams(location.search).get('vorschau');
  const istVorschau = vorschau !== null && /^\d+$/.test(vorschau);
  if (istVorschau) {
    const n = Math.min(+vorschau, STATIONEN.length);
    store = Object.assign(leererSpeicher(), { name: store.name });
    STATIONEN.slice(0, n).forEach((s, i) => {
      store.done[s.id] = true;
      store.stempel[s.id] = Date.now();
      store.zeit[s.id] = (7 + i * 2) * 60;
    });
    if (n > 0) {
      store.done.erz = true;
      store.stempel.erz = Date.now();
      store.zeit.erz = 11 * 60;
      store.eintraege.a1 = { text: 'Beispiel-Eintrag: Eine Regel für jeden Clownfisch zu finden, ist echt schwer.', t: Date.now() };
    }
    R.module.forEach(m => {
      m.ziele.forEach((z, i) => { if (store.done[z.station]) store.ziele[`${m.id}-${i}`] = 'kann'; });
      if (m.stationen.every(s => store.done[s.id])) store.done[m.id] = true;
    });
    if (n > 1) store.eintraege.a2 = { text: 'Beispiel-Eintrag: Ähnliche Fische liegen nah beieinander.\nWarum eigentlich?', t: Date.now() };
    const h = document.getElementById('vorschau-hinweis');
    h.hidden = false;
    h.textContent = `Vorschau mit ${n} fertigen Stationen. Hier wird nichts gespeichert.`;
  }
  const save = () => {
    if (istVorschau) return;
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* siehe oben */ }
  };

  /* ---------- Lernzeit: läuft nur, solange eine Station sichtbar offen ist ---------- */
  let uhr = null;
  const uhrStoppen = () => {
    if (!uhr) return;
    const sek = Math.min(1800, Math.round((Date.now() - uhr.start) / 1000));
    if (sek > 3) { store.zeit[uhr.id] = (store.zeit[uhr.id] || 0) + sek; save(); }
    uhr = null;
  };
  const uhrStarten = id => { uhrStoppen(); uhr = { id, start: Date.now() }; };
  let wartendeUhr = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { wartendeUhr = uhr && uhr.id; uhrStoppen(); }
    else if (wartendeUhr) { uhrStarten(wartendeUhr); wartendeUhr = null; }
  });
  window.addEventListener('pagehide', uhrStoppen);

  /* ---------- Fortschritt ---------- */
  const fertig = id => !!store.done[id];
  const offen = s => !s.braucht || fertig(s.braucht);
  const modulZahl = m => m.stationen.filter(s => fertig(s.id)).length;
  const modulFertig = m => fertig(m.id);
  const modulBereit = m => !modulFertig(m) && modulZahl(m) === m.stationen.length;
  const korallen = () => STATIONEN.filter(s => fertig(s.id)).length;
  const pflanzen = () => R.module.filter(modulFertig).length;
  const zaehler = () => `${korallen()} von ${STATIONEN.length} Korallen · ${pflanzen()} von ${R.module.length} Riff-Pflanzen`;

  /* ---------- Riff-Landschaft (SVG) ---------- */
  const FORM = {
    geweih: f => `<path d="M0 0V-34M0 -14L-16 -32M0 -20L15 -40M-16 -32L-22 -46M-16 -32L-7 -48M15 -40L8 -54M15 -40L24 -52M0 -34L-3 -52" fill="none" stroke="${f}" stroke-width="7" stroke-linecap="round"/>`,
    hirn: f => `<path d="M-30 0C-36 -52 36 -52 30 0Z" fill="${f}"/><path d="M-20 -8C-14 -20 -8 -8 -2 -18S8 -10 18 -16M-16 -20C-8 -32 2 -22 12 -30" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="3" stroke-linecap="round"/>`,
    faecher: f => `<path d="M0 0L-30 -30C-30 -60 30 -60 30 -30Z" fill="${f}"/><path d="M0 0L-16 -46M0 0V-50M0 0L16 -46M-8 -24L-24 -36M8 -24L24 -36" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5" stroke-linecap="round"/>`,
    roehre: f => `<rect x="-22" y="-30" width="13" height="30" rx="6.5" fill="${f}"/><rect x="-7" y="-46" width="14" height="46" rx="7" fill="${f}"/><rect x="9" y="-36" width="13" height="36" rx="6.5" fill="${f}"/><ellipse cx="-15.500" cy="-26" rx="4" ry="2.500" fill="rgba(0,0,0,.2)"/><ellipse cx="0" cy="-42" rx="4" ry="2.500" fill="rgba(0,0,0,.2)"/><ellipse cx="15.500" cy="-32" rx="4" ry="2.500" fill="rgba(0,0,0,.2)"/>`,
    tisch: f => `<rect x="-6" y="-30" width="12" height="30" rx="4" fill="${f}"/><path d="M-36 -30C-30 -44 30 -44 36 -30C22 -25 -22 -25 -36 -30Z" fill="${f}"/>`
  };
  const KORALLEN = [
    { x: 100, y: 262, form: 'geweih', f: '#F2668B' },
    { x: 165, y: 276, form: 'hirn', f: '#F7A23C' },
    { x: 310, y: 256, form: 'faecher', f: '#A56BE0' },
    { x: 375, y: 274, form: 'roehre', f: '#FFC94A' },
    { x: 520, y: 258, form: 'tisch', f: '#3CC6A0' },
    { x: 585, y: 278, form: 'geweih', f: '#FF7A6B' },
    { x: 650, y: 258, form: 'hirn', f: '#5B8DEF' },
    { x: 795, y: 276, form: 'faecher', f: '#EF5DA8' },
    { x: 860, y: 260, form: 'roehre', f: '#F47C3C' }
  ];
  const PFLANZEN = [
    { x: 40, y: 284 }, { x: 245, y: 284 }, { x: 455, y: 284 }, { x: 730, y: 284 }
  ];
  const halm = (dx, h, c) => `<path class="halm" d="M${dx} 0C${dx - 8} ${-h * .35} ${dx + 8} ${-h * .65} ${dx + 1} ${-h}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;

  function riffSVG() {
    const n = korallen();
    const label = `Dein Riff: ${zaehler()}.${fertig('erz') ? ' Die Sonne scheint ins Wasser.' : ''}`;
    const korallenSvg = KORALLEN.map((k, i) => {
      const da = fertig(STATIONEN[i].id);
      return `<g transform="translate(${k.x} ${k.y}) scale(1.35)"><g class="koralle ${da ? 'gewachsen' : 'wartet'}">${FORM[k.form](da ? k.f : '#C4CFD4')}</g></g>`;
    }).join('');
    const pflanzenSvg = PFLANZEN.map((p, i) => {
      const da = modulFertig(R.module[i]);
      const c = da ? '#37A85B' : '#AFC4B6';
      return `<g transform="translate(${p.x} ${p.y})"><g class="pflanze ${da ? 'gewachsen' : 'wartet'}">${halm(-9, 58, c)}${halm(0, 74, c)}${halm(9, 52, c)}</g><rect class="riff-schild" x="-31" y="4" width="62" height="23" rx="6"/><text class="riff-schild-text" x="0" y="20" text-anchor="middle">Modul ${i + 1}</text></g>`;
    }).join('');
    const sonne = fertig('erz');
    return `<svg class="riff-bild" viewBox="0 0 940 320" role="img" aria-label="${esc(label)}" data-korallen="${n}">
      <defs>
        <linearGradient id="wasser" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sonne ? '#7FDDEB' : '#4FB4D8'}"/><stop offset="1" stop-color="${sonne ? '#2C9CC7' : '#1F7CAE'}"/></linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DFA8"/><stop offset="1" stop-color="#E5C07F"/></linearGradient>
        <linearGradient id="strahl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8D6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF8D6" stop-opacity="0"/></linearGradient>
      </defs>
      <rect width="940" height="320" fill="url(#wasser)"/>
      ${sonne ? `<g class="strahlen"><path d="M120 0H190L120 250H20Z" fill="url(#strahl)"/><path d="M360 0H450L420 260H290Z" fill="url(#strahl)"/><path d="M640 0H710L720 250H600Z" fill="url(#strahl)"/><path d="M820 0H890L930 240H820Z" fill="url(#strahl)"/></g>` : ''}
      <g class="blasen" fill="rgba(255,255,255,.55)"><circle cx="160" cy="210" r="4"/><circle cx="168" cy="186" r="2.500"/><circle cx="520" cy="200" r="3.500"/><circle cx="514" cy="170" r="2.500"/><circle cx="808" cy="190" r="4"/><circle cx="816" cy="160" r="2.500"/></g>
      <path d="M0 262C150 240 290 268 470 256S770 242 940 262V320H0Z" fill="url(#sand)"/>
      <g fill="#A9B4B8"><ellipse cx="140" cy="303" rx="22" ry="9"/><ellipse cx="395" cy="306" rx="18" ry="8"/><ellipse cx="665" cy="304" rx="24" ry="10"/></g>
      ${pflanzenSvg}${korallenSvg}
      ${sonne ? '' : '<g class="sonne-hinweis"><circle cx="860" cy="42" r="20" fill="#FFD866" stroke="#FFF8D6" stroke-width="3"/><text x="860" y="86" text-anchor="middle">Film ansehen: Sonne!</text></g>'}
      <image class="riff-kora" href="bilder/kora.png" x="400" y="26" width="110" height="110"/>
    </svg>`;
  }
  const riffBlock = (knopf = false) => `<div class="riff-rahmen">${riffSVG()}<div class="riff-leiste"><p class="riff-zaehler" id="riff-zaehler">${zaehler()}</p>${knopf ? '<span class="knopf leise-knopf">Tauchbuch öffnen</span>' : ''}</div></div>`;

  /* ---------- Symbole für „So arbeitest du hier“ (eigene Zeichnungen) ---------- */
  const STRICH = 'stroke="#17324D" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  const SYMBOLE = {
    hand: ['#FFE29A', `<path d="M14.500 21.500V13a1.900 1.900 0 0 1 3.800 0v6.500V10.800a1.900 1.900 0 0 1 3.800 0v8.700v-7a1.900 1.900 0 0 1 3.800 0v8.500c0 5-2.800 8.500-6.900 8.500c-3.200 0-4.900-1.700-6.400-4.300l-2.300-4c-1.100-1.900 1.500-3.200 2.700-1.500Z" fill="#fff" ${STRICH}/>`],
    auge: ['#BDE8FB', `<path d="M7 20C11 13.500 15.500 11.500 20 11.500S29 13.500 33 20C29 26.500 24.500 28.500 20 28.500S11 26.500 7 20Z" fill="#fff" ${STRICH}/><circle cx="20" cy="20" r="4.600" fill="#17324D"/><circle cx="18.500" cy="18.500" r="1.400" fill="#fff"/>`],
    lupe: ['#C6F0DE', `<circle cx="18" cy="18" r="7.500" fill="#fff" ${STRICH}/><path d="M23.800 23.800L31 31" fill="none" stroke="#17324D" stroke-width="3.600" stroke-linecap="round"/>`],
    wiederholen: ['#FFC9BF', `<path d="M11 18A9.500 9.500 0 0 1 28 14M29 22A9.500 9.500 0 0 1 12 26" fill="none" ${STRICH}/><path d="M28.500 8V14.500H22M11.500 32V25.500H18" fill="none" ${STRICH}/>`],
    laecheln: ['#E2D6FF', `<path d="M12.500 17C13.800 15.500 15.700 15.500 17 17M23 17C24.300 15.500 26.200 15.500 27.500 17" fill="none" ${STRICH}/><path d="M12.500 23.500C16 28.500 24 28.500 27.500 23.500" fill="none" ${STRICH}/>`],
    besen: ['#F6CF9C', `<path d="M28.500 7.500L19.500 21.500" fill="none" stroke="#17324D" stroke-width="3" stroke-linecap="round"/><path d="M15.500 19L24 24.500L20 32.500H9.500Z" fill="#FFC94A" ${STRICH}/><path d="M16.500 25.500L13.800 32M21 28L19 32" fill="none" stroke="#17324D" stroke-width="1.800" stroke-linecap="round"/>`]
  };
  const regelSymbol = name => {
    const [farbe, innen] = SYMBOLE[name];
    return `<svg class="regel-symbol" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.500" fill="${farbe}" stroke="#17324D" stroke-width="2.400"/>${innen}</svg>`;
  };

  /* ---------- Karten ---------- */
  function stationKarte(s) {
    const da = fertig(s.id), frei = offen(s);
    const status = da ? '<span class="status fertig">geschafft</span>'
      : frei ? '<span class="status bereit">bereit für dich</span>'
      : `<span class="status zu">erst: ${esc(PER_ID[s.braucht].titel)}</span>`;
    const innen = `<span class="karte-icon" aria-hidden="true">${s.icon}</span><span class="karte-titel">${esc(s.titel)}</span><span class="karte-sub">${esc(s.sub)}</span><span class="karte-fuss">${status}<span class="dauer">${s.dauer}</span></span>`;
    return `<a class="karte" href="#${s.id}">${innen}</a>`;
  }
  function abschlussKarte(m) {
    const status = modulFertig(m) ? '<span class="status fertig">geschafft</span>'
      : modulBereit(m) ? '<span class="status bereit">bereit für dich</span>'
      : `<span class="status zu">${modulZahl(m)} von ${m.stationen.length} geschafft</span>`;
    return `<a class="karte abschluss" href="#${m.id}"><span class="karte-icon" aria-hidden="true">🏁</span><span class="karte-titel">Modul-Abschluss</span><span class="karte-sub">Was kann ich jetzt?</span><span class="karte-fuss">${status}<span class="dauer">ca. 5 Min.</span></span></a>`;
  }
  function bereitListe() {
    const liste = [];
    if (!fertig('erz')) liste.push(`<a class="bereit-karte erz" href="#modul0"><span class="karte-icon" aria-hidden="true">🎬</span><span><b>Die Große Erzählung</b><small>${R.erzaehlung.dauer}</small></span></a>`);
    R.module.filter(modulBereit).forEach(m => liste.push(`<a class="bereit-karte" href="#${m.id}"><span class="karte-icon" aria-hidden="true">🏁</span><span><b>Abschluss: ${esc(m.titel)}</b><small>ca. 5 Min.</small></span></a>`));
    STATIONEN.filter(s => !fertig(s.id) && offen(s)).forEach(s => liste.push(`<a class="bereit-karte" href="#${s.id}"><span class="karte-icon" aria-hidden="true">${s.icon}</span><span><b>${esc(s.titel)}</b><small>${s.dauer}</small></span></a>`));
    return liste.slice(0, 3);
  }

  /* ---------- Vorlagen-Prompt für Erwachsene ---------- */
  function promptAus({ titel, ziel, ablauf = '', woerter = '' }) {
    return `Du bist Kora, eine freundliche Meeresschildkröte und Lernbegleiterin für Kinder der Klassen 3 und 4 in einem Lernkurs über Künstliche Intelligenz („Tauchgang im KI-Korallenriff“). Das Kind arbeitet gerade mit: „${titel}“.
Lernziel: ${ziel}
${ablauf ? `${ablauf}\n` : ''}${woerter ? `Wichtige Wörter: ${woerter}\n` : ''}
Deine Regeln:
- Antworte auf Deutsch, in höchstens drei kurzen Sätzen, mit einfachen Wörtern, die ein Grundschulkind versteht.
- Verrate keine fertigen Lösungen. Gib einen kleinen Tipp oder stelle eine Gegenfrage, damit das Kind selbst darauf kommt.
- Sag nie „falsch“ und lobe nicht übertrieben.
- Bleib beim Thema KI und beim Material. Bei anderen Themen sag freundlich, dass du hier nur beim Tauchgang im KI-Korallenriff hilfst.
- Frag nie nach Namen, Adresse, Schule, Fotos oder anderen privaten Dingen. Schreibt das Kind so etwas, erinnere es freundlich daran, das nicht zu tun.
- Wirkt das Kind traurig, ängstlich oder in Not, sag ihm liebevoll, dass es mit einem Erwachsenen sprechen soll, dem es vertraut.
- Gib zu, wenn du dir nicht sicher bist. Verwende keine Emojis.
Beginne mit einer kurzen Begrüßung und frag, wobei du helfen kannst.`;
  }
  function promptText(wahl) {
    if (wahl === 'erz') return promptAus({ titel: 'Die Große Erzählung (Trickfilm über die Geschichte der KI)', ziel: R.erzaehlung.lernziel });
    const m = R.module.find(x => x.id === wahl);
    return promptAus({ titel: `Modul ${m.nr}: ${m.titel}`, ziel: m.lernziel, ablauf: `Stationen: ${m.stationen.map(x => x.titel).join(', ')}` });
  }

  /* Kopiert Text; klappt das nicht, wird er im Feld markiert. */
  async function kopieren(wert, status, feld) {
    try {
      await navigator.clipboard.writeText(wert);
      status.textContent = 'Kopiert.';
    } catch (e) {
      feld.hidden = false;
      feld.focus();
      feld.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { /* Text bleibt markiert */ }
      status.textContent = ok ? 'Kopiert.' : 'Der Text ist markiert. Kopiere ihn mit Strg+C.';
    }
  }

  /* ---------- Ansichten ---------- */
  function ansichtRiff() {
    const gruss = store.name ? `Hallo, ${esc(store.name)}! Ich bin Kora.` : 'Hallo! Ich bin Kora.';
    app.innerHTML = `
    <section class="hallo">
      <img class="hallo-kora" src="bilder/kora.png" alt="Kora, die Meeresschildkröte, winkt dir zu" width="200" height="200">
      <div class="blase">
        <h1 id="gruss">${gruss}</h1>
        <p>Komm mit ins Korallenriff! Hier findest du selbst heraus, wie Computer lernen. Such dir etwas aus, probier es aus, so lange du magst, und räum es danach wieder auf.</p>
        <div class="name-zeile"><label for="vorname">Wie heißt du?</label><input id="vorname" type="text" maxlength="20" placeholder="dein Vorname" autocomplete="off" value="${esc(store.name)}"><span class="leise">Bleibt nur auf diesem Gerät.</span></div>
      </div>
    </section>

    <h2 class="abschnitt">Dein Riff</h2>
    <a class="riff-link" href="#heft" aria-label="Zum Tauchbuch">${riffBlock(true)}</a>
    <p class="riff-hinweis">Dein Riff wächst mit jedem Material, das du fertig machst.${fertig('erz') ? '' : ' Schau die Große Erzählung an, dann scheint die Sonne ins Wasser.'}</p>

    <h2 class="abschnitt">Heute bereit für dich</h2>
    <div class="bereit-liste">${bereitListe().join('') || '<p>Du hast alles geschafft. Du kannst jede Station noch einmal machen, so oft du magst.</p>'}</div>

    <h2 class="abschnitt" id="module">Die Stationen im Riff</h2>
    <a class="modul0 ${fertig('erz') ? 'ist-fertig' : ''}" href="#modul0">
      <span class="karte-icon gross" aria-hidden="true">🎬</span>
      <span><span class="kicker">Modul 0 · Die Große Erzählung</span><strong>${esc(R.erzaehlung.titel)}</strong><span class="modul0-text">${esc(R.erzaehlung.text)}</span><span class="dauer">Trickfilm · ${R.erzaehlung.dauer}${fertig('erz') ? ' · geschafft' : ''}</span></span>
    </a>
    ${R.module.map(m => `<section class="modul ${m.farbe}">
      <header class="modul-kopf"><div><h3>Modul ${m.nr} · ${esc(m.titel)}</h3><p>${esc(m.frage)}</p></div><span class="modul-zahl" aria-label="${modulZahl(m)} von ${m.stationen.length} geschafft">${modulZahl(m)}/${m.stationen.length}</span></header>
      <div class="karten">${m.stationen.map(stationKarte).join('')}${abschlussKarte(m)}</div>
    </section>`).join('')}

    <div class="info-raster">
      <section class="regeln"><h2>So arbeitest du hier</h2><ul class="regel-liste">${R.regeln.map(r => `<li>${regelSymbol(r.symbol)}<span>${esc(r.text)}</span></li>`).join('')}</ul></section>
      <section class="regeln"><h2>Kora hilft dir</h2>
        <div class="kora-sagt"><img src="bilder/kora.png" alt="" width="72" height="72"><p>Wenn du nicht weiterkommst, tipp unten rechts auf „Frag Kora“. Ich gebe dir dann einen Tipp. Die Lösung findest du selbst!</p></div>
        <p class="leise kora-klein">Kora ist keine echte KI. Ein Mensch hat die Tipps für dich vorbereitet. So funktioniert Kora überall, auch ohne Internet.</p>
      </section>
    </div>

    <div class="erwachsene-bereich">
      <details class="erwachsene"><summary>Für Lehrkräfte &amp; Eltern: Das Lern-Konzept im Korallenriff</summary>
        <p>Das Korallenriff ist eine vorbereitete Umgebung für Kinder der Klassen 3 und 4 (8 bis 10 Jahre). Es erklärt, wie Künstliche Intelligenz funktioniert; das Riff liefert die Beispiele und die Bilder. Die Kinder wählen frei aus dem, was gerade offen ist, und kontrollieren ihre Lösungen selbst. Statt Punkten, Abzeichen und Ranglisten wächst ein Riff.</p>
        <p>Kora ist ein Tipp-Tutor ohne künstliche Intelligenz: Zu jeder Station gibt es drei gestufte Tipps, eine zweite Erklärung, die Wortkarten und Antworten auf typische Kinderfragen zu KI. Es werden keine Daten gesendet, es braucht kein Konto und kein Internet. Fortschritt, Name und Einträge bleiben nur in diesem Browser.</p>
        <div class="tabelle-scroll"><table><thead><tr><th scope="col">Prinzip</th><th scope="col">Umsetzung</th></tr></thead><tbody>${R.konzept.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>
      </details>
      <details class="erwachsene"><summary>Für Erwachsene: Kora (das Maskottchen) in ChatGPT, Gemini oder Claude nutzen</summary>
        <p>Dieser Prompt macht aus Ihrem eigenen KI-Werkzeug einen Lernbegleiter für das gewählte Modul. Bitte nur gemeinsam mit dem Kind nutzen und nur mit einem Werkzeug, das Ihre Schule erlaubt. <strong>Keine Namen oder Fotos des Kindes eingeben.</strong></p>
        <p><label for="prompt-modul">Modul:</label> <select id="prompt-modul"><option value="erz">Modul 0 · Die Große Erzählung</option>${R.module.map(m => `<option value="${m.id}">Modul ${m.nr} · ${esc(m.titel)}</option>`).join('')}</select></p>
        <textarea id="prompt-text" rows="12" readonly aria-label="Vorlagen-Prompt"></textarea>
        <p class="kopier-zeile"><button type="button" class="knopf" id="prompt-kopieren">Prompt kopieren</button> <span class="leise" id="kopier-status" aria-live="polite"></span></p>
      </details>
    </div>`;

    const feld = document.getElementById('vorname');
    feld.addEventListener('input', () => {
      store.name = feld.value.trim();
      save();
      document.getElementById('gruss').textContent = store.name ? `Hallo, ${store.name}! Ich bin Kora.` : 'Hallo! Ich bin Kora.';
    });
    const wahl = document.getElementById('prompt-modul');
    const text = document.getElementById('prompt-text');
    const status = document.getElementById('kopier-status');
    const fuellen = () => { text.value = promptText(wahl.value); status.textContent = ''; };
    wahl.addEventListener('change', fuellen);
    fuellen();
    document.getElementById('prompt-kopieren').addEventListener('click', () => kopieren(text.value, status, text));
  }

  function ansichtHeft() {
    app.innerHTML = `
    <section class="hallo klein">
      <img class="hallo-kora" src="bilder/kora.png" alt="" width="200" height="200">
      <div class="blase"><h1>Mein Tauchbuch${store.name ? ` von ${esc(store.name)}` : ''}</h1><p>Hier siehst du, was du schon entdeckt hast. Es gibt keine Punkte. Dein Riff wächst mit jedem Material, das du fertig machst.</p></div>
    </section>
    <h2 class="abschnitt">Mein Riff</h2>
    ${riffBlock()}

    <section class="heft-teil"><h2>Meine Stempel</h2>
      <ul class="stempelfeld">${stempelListe().map(stempelKarte).join('')}</ul>
    </section>

    <section class="heft-teil"><h2>Meine Lernzeit</h2>
      <p class="leise">So lange hast du in jedem Modul gearbeitet. Mehr ist nicht besser. Jeder lernt in seinem Tempo.</p>
      <div class="zeiten">${lernzeitZeilen()}</div>
    </section>

    <section class="heft-teil"><h2>Das kann ich schon</h2>${kannListe()}</section>

    <section class="heft-teil"><h2>Meine Einträge</h2>${eintragListe()}</section>

    <section class="heft-teil neu-anfangen"><h2>Neu anfangen</h2>
      <p class="leise">Löscht dein Riff, deine Stempel, deine Lernzeit und alle Einträge auf diesem Gerät.</p>
      <div id="reset" class="reset-zeile"></div>
    </section>`;
    resetEinrichten();
    const knopf = document.getElementById('eintraege-kopieren');
    if (knopf) knopf.addEventListener('click', () => kopieren(eintragPunkte().map(e => `${e.titel}\n${e.text}`).join('\n\n'), document.getElementById('eintraege-status'), document.getElementById('eintraege-feld')));
  }

  const datum = t => new Date(t).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });

  function stempelListe() {
    const liste = [{ id: R.erzaehlung.id, icon: '🎬', titel: 'Die Große Erzählung', farbe: 'erz' }];
    R.module.forEach(m => m.stationen.forEach(s => liste.push({ id: s.id, icon: s.icon, titel: s.titel, farbe: m.farbe })));
    return liste;
  }
  function stempelKarte(s) {
    const da = fertig(s.id);
    const wann = store.stempel[s.id] ? `<span class="leise">${datum(store.stempel[s.id])}</span>` : '';
    return `<li class="stempel-platz ${da ? 'geschafft' : 'offen'} ${s.farbe}">
      <span class="stempel" aria-hidden="true"><span class="stempel-icon">${s.icon}</span><span class="stempel-wort">${da ? 'ENTDECKT' : '· · ·'}</span></span>
      <span class="stempel-name">${esc(s.titel)}</span>
      <span class="sr-nur">${da ? 'geschafft' : 'noch offen'}</span>${wann}
    </li>`;
  }

  function zeitText(sek) {
    if (!sek) return '0 Min.';
    const min = Math.round(sek / 60);
    return min < 1 ? 'unter 1 Min.' : `${min} Min.`;
  }
  function lernzeitZeilen() {
    const summe = ids => ids.reduce((n, id) => n + (store.zeit[id] || 0), 0);
    const zeilen = [{ name: 'Modul 0', titel: 'Die Große Erzählung', sek: summe([R.erzaehlung.id]), farbe: 'erz' }]
      .concat(R.module.map(m => ({ name: `Modul ${m.nr}`, titel: m.titel, sek: summe(m.stationen.map(s => s.id).concat(m.id)), farbe: m.farbe })));
    const groesste = Math.max(600, ...zeilen.map(z => z.sek));
    return zeilen.map(z => `<div class="zeit-zeile ${z.farbe}">
      <span class="zeit-name"><b>${z.name}</b> ${esc(z.titel)}</span>
      <span class="zeit-spur" aria-hidden="true"><span class="zeit-fuellung" style="width:${Math.round(z.sek / groesste * 100)}%"></span></span>
      <span class="zeit-wert">${zeitText(z.sek)}</span>
    </div>`).join('');
  }

  function kannListe() {
    const kann = [];
    R.module.forEach(m => m.ziele.forEach((z, i) => { if (store.ziele[`${m.id}-${i}`] === 'kann') kann.push(z.t); }));
    if (!kann.length) return '<p class="leise">Am Ende jedes Moduls schätzt du dich selbst ein. Was du kannst, steht dann hier.</p>';
    return `<ul class="kann-liste">${kann.map(t => `<li><span aria-hidden="true">✅ </span>${esc(t)}</li>`).join('')}</ul>`;
  }

  /* Alle Einträge in Modul-Reihenfolge, auch die Antworten aus dem Modul-Abschluss. */
  function eintragPunkte() {
    const orte = [{ id: R.erzaehlung.id, icon: '🎬', titel: 'Die Große Erzählung', farbe: 'erz' }];
    R.module.forEach(m => {
      m.stationen.forEach(s => orte.push({ id: s.id, icon: s.icon, titel: s.titel, farbe: m.farbe }));
      orte.push({ id: `t-${m.id}`, icon: '🏁', titel: `Weiterdenken: Modul ${m.nr}`, farbe: m.farbe });
    });
    return orte.filter(o => store.eintraege[o.id] && store.eintraege[o.id].text && store.eintraege[o.id].text.trim())
      .map(o => Object.assign({}, o, { text: store.eintraege[o.id].text.trim(), t: store.eintraege[o.id].t }));
  }
  function eintragListe() {
    const liste = eintragPunkte();
    if (!liste.length) return '<p class="leise">Noch keine Einträge. Am Ende jeder Station schreibst du auf, was du entdeckt hast.</p>';
    return `<ul class="eintraege">${liste.map(e => `<li class="${e.farbe}"><span class="eintrag-kopf"><span aria-hidden="true">${e.icon}</span> ${esc(e.titel)}${e.t ? ` · ${datum(e.t)}` : ''}</span><p class="eintrag-text">${esc(e.text)}</p></li>`).join('')}</ul>
      <p class="kopier-zeile"><button type="button" class="knopf leise-knopf" id="eintraege-kopieren">Alles kopieren</button><span class="leise" id="eintraege-status" aria-live="polite"></span><textarea id="eintraege-feld" rows="6" readonly hidden aria-label="Alle Einträge">${esc(liste.map(e => `${e.titel}\n${e.text}`).join('\n\n'))}</textarea></p>`;
  }

  function resetEinrichten() {
    const box = document.getElementById('reset');
    const start = () => {
      box.innerHTML = `<button type="button" class="knopf leise-knopf" id="reset-start"${istVorschau ? ' disabled' : ''}>Alles löschen / Neu anfangen</button>${istVorschau ? '<span class="leise">In der Vorschau wird nichts gelöscht.</span>' : ''}`;
    };
    start();
    box.addEventListener('click', e => {
      if (e.target.id === 'reset-start') {
        box.innerHTML = `<strong>Wirklich alles löschen?</strong> <button type="button" class="knopf" id="reset-ja">Ja, alles löschen</button> <button type="button" class="knopf leise-knopf" id="reset-nein">Nein, behalten</button>`;
        document.getElementById('reset-nein').focus();
      } else if (e.target.id === 'reset-nein') {
        start();
      } else if (e.target.id === 'reset-ja') {
        uhr = null;
        store = leererSpeicher();
        try { localStorage.removeItem(KEY); } catch (err) { /* Nichts weiter zu tun */ }
        location.hash = 'riff';
      }
    });
  }

  function ansichtPlatzhalter(titel, kicker, nachricht) {
    app.innerHTML = `
    <p><a class="knopf" href="#riff">← Zurück zum Riff</a></p>
    <section class="hallo klein">
      <img class="hallo-kora" src="bilder/kora.png" alt="" width="200" height="200">
      <div class="blase"><span class="kicker">${esc(kicker)}</span><h1>${esc(titel)}</h1><p>${esc(nachricht)}</p></div>
    </section>`;
  }

  /* ---------- Bausteine der Stationen ---------- */
  const mischen = liste => {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* Sortieraufgabe: Das Kind ordnet Karten zu. Verglichen wird erst mit der Kontrollkarte. */
  function sortierSpiel(el, cfg) {
    const wahl = {};
    const name = id => cfg.gruppen.find(g => g[0] === id)[1];
    el.innerHTML = `<p>${esc(cfg.hinweis)}</p>
      <ul class="sortierliste">${cfg.karten.map((k, i) => `<li class="sortierkarte"><span>${esc(k.t)}</span><span class="wahl" role="group" aria-label="Einordnen">${cfg.gruppen.map(([id, l]) => `<button type="button" class="wahl-knopf" data-karte="${i}" data-gruppe="${id}" aria-pressed="false">${esc(l)}</button>`).join('')}</span></li>`).join('')}</ul>
      <p class="zwischenstand" aria-live="polite"></p>`;
    const stand = el.querySelector('.zwischenstand');
    const zeigen = () => {
      el.querySelectorAll('.wahl-knopf').forEach(b => b.setAttribute('aria-pressed', String(wahl[b.dataset.karte] === b.dataset.gruppe)));
      const rest = cfg.karten.length - Object.keys(wahl).length;
      stand.textContent = cfg.gruppen.map(([id, l]) => `${l}: ${Object.values(wahl).filter(v => v === id).length}`).join(' · ') + (rest ? ` · noch offen: ${rest}` : ' · alle Karten liegen');
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('.wahl-knopf');
      if (!b) return;
      wahl[b.dataset.karte] = b.dataset.gruppe;
      zeigen();
    });
    zeigen();
    return {
      kontrolle: () => `<div class="tabelle-scroll"><table class="kontroll-tabelle"><thead><tr><th scope="col">Karte</th><th scope="col">Du hast gelegt</th><th scope="col">Kontrollkarte</th></tr></thead><tbody>${cfg.karten.map((k, i) => {
        const meins = wahl[i], anders = meins && meins !== k.gruppe;
        return `<tr class="${anders ? 'anders' : ''}"><td>${esc(k.t)}</td><td>${meins ? esc(name(meins)) : '<span class="leise">noch offen</span>'}${anders ? '<span class="anders-hinweis">anders als die Karte</span>' : ''}</td><td><strong>${esc(name(k.gruppe))}</strong><br><span class="warum">${esc(k.warum)}</span></td></tr>`;
      }).join('')}</tbody></table></div>${cfg.notiz ? `<p>${esc(cfg.notiz)}</p>` : ''}`
    };
  }
  const SPIELE = Object.assign({ sortieren: sortierSpiel }, R.spiele);

  /* Neue Wörter in drei Stufen: Anschauen, Zeigen, Sagen */
  function wortKarten(el, woerter) {
    const st = { stufe: 1, i: 0, fertig: false, hinweis: '' };
    const NAMEN = ['Anschauen', 'Zeigen', 'Sagen'];
    const zeichnen = () => {
      const hatteFokus = el.contains(document.activeElement);
      const stufen = NAMEN.map((n, x) => `<span class="stufe ${!st.fertig && st.stufe === x + 1 ? 'aktiv' : ''} ${st.fertig || st.stufe > x + 1 ? 'erledigt' : ''}">${x + 1} · ${n}</span>`).join('');
      let inhalt;
      if (st.fertig) inhalt = '<p>Du kennst jetzt alle Wörter.</p><p><button type="button" class="knopf leise-knopf" data-wort="nochmal">Noch einmal üben</button></p>';
      else if (st.stufe === 1) inhalt = `${st.hinweis ? `<p class="wort-hinweis">${esc(st.hinweis)}</p>` : ''}<ul class="wortkarten">${woerter.map(w => `<li><span class="wort">${esc(w.t)}</span><span>${esc(w.d)}</span></li>`).join('')}</ul><p><button type="button" class="knopf" data-wort="weiter">Ich habe sie angeschaut</button></p>`;
      else if (st.stufe === 2) inhalt = `<p class="wort-frage">Zeig mir: <strong>${esc(woerter[st.i].t)}</strong></p><div class="wort-wahl">${mischen(woerter.map((_, k) => k)).map(k => `<button type="button" class="wort-knopf" data-k="${k}">${esc(woerter[k].d)}</button>`).join('')}</div>`;
      else inhalt = `<p class="wort-frage">„${esc(woerter[st.i].d)}“<br>Wie heißt das?</p><div class="wort-wahl">${mischen(woerter.map((_, k) => k)).map(k => `<button type="button" class="wort-knopf gross" data-k="${k}">${esc(woerter[k].t)}</button>`).join('')}</div>`;
      el.innerHTML = `<div class="stufen">${stufen}</div>${inhalt}`;
      if (hatteFokus) { const f = el.querySelector('.wort-knopf, .knopf'); if (f) f.focus({ preventScroll: true }); }
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.wort === 'weiter') { st.stufe = 2; st.i = 0; st.hinweis = ''; }
      else if (b.dataset.wort === 'nochmal') { st.stufe = 1; st.i = 0; st.fertig = false; st.hinweis = ''; }
      else if (b.dataset.k !== undefined) {
        if (+b.dataset.k === st.i) {
          st.i++;
          if (st.i >= woerter.length) { if (st.stufe === 2) { st.stufe = 3; st.i = 0; } else st.fertig = true; }
        } else { st.stufe = 1; st.i = 0; st.hinweis = 'Schau dir die Wortkarten noch einmal in Ruhe an. Dann geht es weiter.'; }
      } else return;
      zeichnen();
    });
    zeichnen();
  }

  /* Einblendung nach „Fertig!“ */
  function einblenden(inhalt) {
    const root = document.getElementById('einblendung');
    root.innerHTML = `<div class="einblendung" role="dialog" aria-modal="true" aria-label="Geschafft"><div class="einblendung-karte">${inhalt}<p class="einblendung-knoepfe"><button type="button" class="knopf" id="zurueck-riff">Zurück zum Riff</button><a class="knopf leise-knopf" href="#heft">Riff ansehen</a></p></div></div>`;
    const zu = () => { root.innerHTML = ''; };
    root.querySelector('#zurueck-riff').addEventListener('click', () => { zu(); location.hash = 'riff'; });
    root.querySelector('a').addEventListener('click', zu);
    root.querySelector('.einblendung').addEventListener('keydown', e => { if (e.key === 'Escape') zu(); });
    root.querySelector('#zurueck-riff').focus();
  }

  /* Frag Kora: vorbereitete Tipps, keine echte KI */
  const kora = (() => {
    const root = document.getElementById('kora-hilfe');
    let ctx = null, offen = false, verlauf = [], tippNr = 0;
    const nachrichten = () => verlauf.map(m => `<div class="nachricht ${m.wer}">${esc(m.text)}</div>`).join('');
    const menue = (ansicht = 'start') => {
      if (ansicht === 'woerter') return `<p class="menue-titel">Welches Wort?</p><div class="menue">${ctx.woerter.map((w, i) => `<button type="button" data-wortnr="${i}">${esc(w.t)}</button>`).join('')}<button type="button" data-zurueck="1">← zurück</button></div>`;
      if (ansicht === 'fragen') return `<p class="menue-titel">Fragen über KI</p><div class="menue">${R.kinderfragen.map((f, i) => `<button type="button" data-frage="${i}">${esc(f[0])}</button>`).join('')}<button type="button" data-zurueck="1">← zurück</button></div>`;
      return `<div class="menue">${tippNr < ctx.hilfe.tipps.length ? `<button type="button" data-tun="tipp">${tippNr ? 'Noch ein Tipp' : 'Gib mir einen Tipp'}</button>` : ''}<button type="button" data-tun="erklaeren">Ich verstehe das nicht</button>${ctx.woerter.length ? '<button type="button" data-tun="woerter">Was bedeutet das Wort?</button>' : ''}<button type="button" data-tun="fragen">Fragen über KI</button></div>`;
    };
    const sagen = (wer, text) => verlauf.push({ wer, text });
    const auffrischen = ansicht => {
      const log = root.querySelector('#kora-verlauf');
      log.innerHTML = nachrichten();
      log.scrollTop = log.scrollHeight;
      root.querySelector('#kora-menue').innerHTML = menue(ansicht);
    };
    function zeichnen() {
      if (!ctx) { root.innerHTML = ''; return; }
      if (!offen) {
        root.innerHTML = '<button type="button" class="kora-knopf" id="kora-auf" aria-haspopup="dialog"><img src="bilder/kora.png" alt="" width="40" height="40">Frag Kora</button>';
        root.querySelector('#kora-auf').addEventListener('click', () => {
          offen = true;
          if (!verlauf.length) sagen('kora', `Hallo! Ich bin Kora. Brauchst du Hilfe bei „${ctx.titel}“? Tipp unten auf eine Frage.`);
          zeichnen();
        });
        return;
      }
      root.innerHTML = `<section class="kora-fenster" role="dialog" aria-label="Frag Kora">
        <div class="kora-kopf"><img src="bilder/kora.png" alt="" width="40" height="40"><b>Kora hilft dir</b><button type="button" id="kora-zu" aria-label="Schließen">✕</button></div>
        <p class="kora-hinweis">Kora ist keine echte KI. Die Tipps hat ein Mensch für dich vorbereitet. Die Lösung findest du selbst!</p>
        <div class="kora-verlauf" id="kora-verlauf" aria-live="polite">${nachrichten()}</div>
        <div id="kora-menue">${menue()}</div></section>`;
      root.querySelector('#kora-verlauf').scrollTop = 1e6;
      root.querySelector('#kora-zu').addEventListener('click', () => { offen = false; zeichnen(); });
      root.querySelector('#kora-menue').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        const h = ctx.hilfe;
        if (b.dataset.tun === 'tipp') {
          sagen('kind', tippNr ? 'Noch ein Tipp, bitte.' : 'Gib mir einen Tipp.');
          sagen('kora', h.tipps[tippNr]);
          tippNr++;
          if (tippNr >= h.tipps.length) sagen('kora', 'Mehr Tipps habe ich nicht. Probier es aus, du schaffst das! Und wenn du magst, hol dir die Kontrollkarte.');
          auffrischen();
        } else if (b.dataset.tun === 'erklaeren') { sagen('kind', 'Ich verstehe das nicht.'); sagen('kora', h.erklaerung); auffrischen(); }
        else if (b.dataset.tun === 'woerter') auffrischen('woerter');
        else if (b.dataset.tun === 'fragen') auffrischen('fragen');
        else if (b.dataset.wortnr !== undefined) { const w = ctx.woerter[+b.dataset.wortnr]; sagen('kind', `Was bedeutet „${w.t}“?`); sagen('kora', `${w.t}: ${w.d}`); auffrischen('woerter'); }
        else if (b.dataset.frage !== undefined) { const f = R.kinderfragen[+b.dataset.frage]; sagen('kind', f[0]); sagen('kora', f[1]); auffrischen('fragen'); }
        else if (b.dataset.zurueck) auffrischen();
      });
    }
    return {
      setzen(c) { ctx = c; offen = false; verlauf = []; tippNr = 0; zeichnen(); },
      leeren() { ctx = null; offen = false; verlauf = []; tippNr = 0; zeichnen(); }
    };
  })();

  /* Station mit festem 6er-Aufbau */
  function ansichtStation(s, m) {
    const x = R.inhalte[s.id];
    const nr = m.stationen.indexOf(s) + 1;
    const alt = store.eintraege[s.id] ? store.eintraege[s.id].text : '';
    const prompt = promptAus({ titel: s.titel, ziel: x.du_uebst, ablauf: `Ablauf: ${x.schritte.join(' ')}`, woerter: x.woerter.map(w => `${w.t}: ${w.d}`).join(' | ') });
    app.innerHTML = `
    <nav class="pfad"><a class="knopf leise-knopf" href="#riff">← Zurück zum Riff</a><a class="pfad-modul" href="#${m.id}">Modul ${m.nr} · ${esc(m.titel)} · ${nr} von ${m.stationen.length}</a></nav>
    <article class="station ${m.farbe}">
      <header class="station-kopf">
        <span class="karte-icon gross" aria-hidden="true">${s.icon}</span>
        <div class="station-titel"><h1>${esc(s.titel)}</h1>
          <div class="kora-sagt"><img src="bilder/kora.png" alt="" width="72" height="72"><p><strong>Du übst:</strong> ${esc(x.du_uebst)}</p></div>
          <span class="dauer">${s.dauer.replace('Min.', 'Minuten')}</span>
        </div>
      </header>
      <section class="teil"><h2><span class="nr">1</span>So geht's</h2><ol class="schritte">${x.schritte.map(t => `<li>${esc(t)}</li>`).join('')}</ol></section>
      <section class="teil" id="arbeit"><div class="teil-kopf"><h2><span class="nr">2</span>Jetzt du!</h2><button type="button" class="link-knopf" id="von-vorn">Von vorn anfangen</button></div><div class="arbeitsflaeche" id="spiel"></div></section>
      <section class="teil"><h2><span class="nr">3</span>Kontrolle</h2><p class="leise">Wenn du so weit bist, holst du dir die Kontrollkarte und vergleichst selbst.</p><p><button type="button" class="knopf" id="kontrolle-knopf" aria-expanded="false" aria-controls="kontrollkarte">Kontrollkarte holen</button></p><div class="kontrollkarte" id="kontrollkarte" hidden></div></section>
      <section class="teil"><h2><span class="nr">4</span>Neue Wörter</h2><div class="wortbereich" id="woerter"></div></section>
      <section class="teil"><h2><span class="nr">5</span>Am Tisch</h2><p class="tisch"><span aria-hidden="true">🖐️</span><span>${esc(x.tisch)}</span></p></section>
      <section class="teil"><h2><span class="nr">6</span>Mein Eintrag</h2><label class="eintrag-frage" for="eintrag">Was hast du entdeckt? Was möchtest du noch wissen?</label><textarea class="eintrag-feld" id="eintrag" rows="4">${esc(alt)}</textarea>
        <p class="fertig-zeile"><button type="button" class="knopf" id="fertig"><span aria-hidden="true">🧹</span> Fertig! Ich räume auf</button><span class="leise">Du entscheidest, wann du fertig bist.</span></p></section>
      <details class="erwachsene"><summary>Für Erwachsene: Kora in ChatGPT, Gemini oder Claude nutzen</summary>
        <p>Dieser Prompt macht aus Ihrem eigenen KI-Werkzeug einen Lernbegleiter für genau diese Station. Bitte nur gemeinsam mit dem Kind nutzen und nur mit einem Werkzeug, das Ihre Schule erlaubt. <strong>Keine Namen oder Fotos des Kindes eingeben.</strong></p>
        <textarea id="station-prompt" rows="10" readonly aria-label="Vorlagen-Prompt">${esc(prompt)}</textarea>
        <p class="kopier-zeile"><button type="button" class="knopf" id="station-prompt-kopieren">Prompt kopieren</button><span class="leise" id="station-prompt-status" aria-live="polite"></span></p>
      </details>
    </article>`;

    const spielStarten = () => {
      const alt2 = document.getElementById('spiel');
      const neu = alt2.cloneNode(false);
      alt2.replaceWith(neu);
      return SPIELE[x.spiel.art](neu, x.spiel);
    };
    let spiel = spielStarten();
    const kk = document.getElementById('kontrollkarte');
    const kk_knopf = document.getElementById('kontrolle-knopf');
    const kkFuellen = () => { kk.innerHTML = `<h3>Kontrollkarte</h3>${spiel.kontrolle()}`; };
    kk_knopf.addEventListener('click', () => {
      const auf = kk.hidden;
      kk.hidden = !auf;
      kk_knopf.setAttribute('aria-expanded', String(auf));
      kk_knopf.textContent = auf ? 'Kontrollkarte zurücklegen' : 'Kontrollkarte holen';
      if (auf) kkFuellen();
    });
    document.getElementById('arbeit').addEventListener('click', e => {
      if (e.target.id === 'von-vorn') spiel = spielStarten();
      if (!kk.hidden) setTimeout(kkFuellen, 0);
    });
    wortKarten(document.getElementById('woerter'), x.woerter);
    const feld = document.getElementById('eintrag');
    feld.addEventListener('input', () => { store.eintraege[s.id] = { text: feld.value, t: Date.now() }; save(); });
    document.getElementById('fertig').addEventListener('click', () => {
      uhrStoppen();
      const erstes = !store.done[s.id];
      store.done[s.id] = (store.done[s.id] || 0) + 1;
      if (erstes) store.stempel[s.id] = Date.now();
      save();
      einblenden(`<span class="stempel gross ${m.farbe}" aria-hidden="true"><span class="stempel-icon">${s.icon}</span><span class="stempel-wort">ENTDECKT</span></span><h2>Gestempelt!</h2><p>${erstes ? 'In deinem Riff wächst eine neue Koralle.' : 'Schön, dass du wiederholt hast.'}</p>`);
    });
    document.getElementById('station-prompt-kopieren').addEventListener('click', () => kopieren(prompt, document.getElementById('station-prompt-status'), document.getElementById('station-prompt')));
    kora.setzen({ titel: s.titel, woerter: x.woerter, hilfe: x.hilfe });
  }

  /* Modul-Abschluss */
  function ansichtAbschluss(m) {
    const x = R.abschluss[m.id];
    const schluessel = `t-${m.id}`;
    const alt = store.eintraege[schluessel] ? store.eintraege[schluessel].text : '';
    const zielZeile = (z, i) => {
      const key = `${m.id}-${i}`, v = store.ziele[key];
      return `<li><span>${esc(z.t)}</span><span class="wahl" role="group" aria-label="Wie gut kannst du das?">${[['kann', 'Kann ich!'], ['ueben', 'Übe ich noch']].map(([k, l]) => `<button type="button" class="wahl-knopf" data-ziel="${i}" data-wert="${k}" aria-pressed="${v === k}">${l}</button>`).join('')}</span>${v === 'ueben' ? `<span class="ziel-tipp">Nimm dir noch einmal <a href="#${z.station}">${esc(PER_ID[z.station].titel)}</a> vor.</span>` : ''}</li>`;
    };
    app.innerHTML = `
    <nav class="pfad"><a class="knopf leise-knopf" href="#riff">← Zurück zum Riff</a></nav>
    <article class="station ${m.farbe}">
      <header class="station-kopf">
        <span class="karte-icon gross" aria-hidden="true">🏁</span>
        <div class="station-titel"><span class="kicker">Modul ${m.nr} von ${R.module.length} · Abschluss</span><h1>${esc(m.titel)}</h1>
          <div class="kora-sagt"><img src="bilder/kora.png" alt="" width="72" height="72"><p>${esc(m.frage)} Schau zurück: Was weißt du jetzt?</p></div>
        </div>
      </header>
      <section class="teil"><h2><span class="nr">1</span>Deine Stationen</h2><div class="karten">${m.stationen.map(stationKarte).join('')}</div></section>
      <section class="teil"><h2><span class="nr">2</span>Was kannst du jetzt?</h2><p class="leise">Schätze dich selbst ein. Das sieht niemand außer dir.</p><ul class="ziele" id="ziele">${m.ziele.map(zielZeile).join('')}</ul></section>
      <section class="teil"><h2><span class="nr">3</span>Denk weiter</h2><p class="tisch"><span aria-hidden="true">🔍</span><span>${esc(x.frage)}</span></p>
        <label class="eintrag-frage" for="weiter">Deine Antwort</label><textarea class="eintrag-feld" id="weiter" rows="4">${esc(alt)}</textarea>
        <p class="fertig-zeile"><button type="button" class="knopf" id="kontrolle-knopf" aria-expanded="false" aria-controls="kontrollkarte">Kontrollkarte holen</button></p><div class="kontrollkarte" id="kontrollkarte" hidden><h3>Kontrollkarte</h3><p>${esc(x.kontrolle)}</p></div></section>
      <section class="teil"><p class="fertig-zeile"><button type="button" class="knopf" id="modul-fertig">Modul abschließen</button><span class="leise">${modulZahl(m)} von ${m.stationen.length} Stationen entdeckt. Du entscheidest, wann du so weit bist.</span></p></section>
    </article>`;
    document.getElementById('ziele').addEventListener('click', e => {
      const b = e.target.closest('[data-ziel]');
      if (!b) return;
      const i = +b.dataset.ziel;
      store.ziele[`${m.id}-${i}`] = b.dataset.wert;
      save();
      b.closest('li').outerHTML = zielZeile(m.ziele[i], i);
    });
    const feld = document.getElementById('weiter');
    feld.addEventListener('input', () => { store.eintraege[schluessel] = { text: feld.value, t: Date.now() }; save(); });
    const kk = document.getElementById('kontrollkarte'), knopf = document.getElementById('kontrolle-knopf');
    knopf.addEventListener('click', () => {
      kk.hidden = !kk.hidden;
      knopf.setAttribute('aria-expanded', String(!kk.hidden));
      knopf.textContent = kk.hidden ? 'Kontrollkarte holen' : 'Kontrollkarte zurücklegen';
    });
    document.getElementById('modul-fertig').addEventListener('click', () => {
      uhrStoppen();
      const erstes = !store.done[m.id];
      store.done[m.id] = (store.done[m.id] || 0) + 1;
      if (erstes) store.stempel[m.id] = Date.now();
      save();
      einblenden(`<span class="stempel gross ${m.farbe}" aria-hidden="true"><span class="stempel-icon">🏁</span><span class="stempel-wort">MODUL ${m.nr}</span></span><h2>Modul ${m.nr} geschafft!</h2><p>${erstes ? 'In deinem Riff wächst jetzt eine Riff-Pflanze.' : 'Du hast das Modul noch einmal abgeschlossen.'}</p>`);
    });
    kora.setzen({ titel: `Modul ${m.nr}: ${m.titel}`, woerter: [], hilfe: R.abschlussHilfe });
  }

  /* Modul 0: Die Große Erzählung */
  let filmStopp = null;
  function filmEinrichten(box) {
    const F = R.film;
    const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    box.innerHTML = `<div class="film-rahmen"><canvas width="${F.W}" height="${F.H}" aria-label="Trickfilm: Wie Menschen Maschinen das Lernen beibrachten. Die Sätze stehen im Bild, der ganze Text steht darunter."></canvas></div>
      <div class="film-leiste"><button type="button" class="knopf" id="film-start">▶ Abspielen</button><button type="button" class="knopf leise-knopf" id="film-ton" aria-pressed="true">Ton an</button><input type="range" id="film-stelle" min="0" max="1000" value="0" aria-label="Stelle im Film"><span class="film-zeit" id="film-zeit">0:00 / ${mmss(F.DAUER)}</span></div>
      <div class="film-kapitel" role="group" aria-label="Meilensteine">${F.SZENEN.map((s, i) => (i ? `<button type="button" data-kapitel="${i}">${s.jahr || 'Anfang'}</button>` : '')).join('')}</div>
      <p class="leise">Die Bilder sind gezeichnet und zeigen nicht die echten Personen.</p>`;
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), knopf = box.querySelector('#film-start'), stelle = box.querySelector('#film-stelle'), zeit = box.querySelector('#film-zeit'), tonKnopf = box.querySelector('#film-ton');
    const au = new Audio();
    au.preload = 'auto';
    let t = 2.2, laeuft = false, zuletzt = 0, raf = 0, geladen = -1, tonOk = true, wartetSeit = 0, ziel = null;
    au.addEventListener('error', () => { if (au.getAttribute('src')) tonOk = false; });
    au.addEventListener('loadedmetadata', () => { if (ziel !== null) { au.currentTime = ziel; ziel = null; } });
    /* Ton auf die aktuelle Stelle des Films setzen */
    const tonStellen = () => {
      const i = F.szeneBei(t), s = F.SZENEN[i];
      if (!s.ton || !tonOk) { au.pause(); geladen = i; return; }
      const stelleImTon = s.ton.ab + (t - s.start);
      if (geladen !== i) { geladen = i; ziel = stelleImTon; au.src = s.ton.datei; au.load(); } else { try { au.currentTime = stelleImTon; } catch (e) { ziel = stelleImTon; } }
      if (laeuft) { const p = au.play(); if (p && p.catch) p.catch(() => { tonOk = false; }); }
    };
    const malen = () => { F.draw(ctx, t); stelle.value = String(Math.round(t / F.DAUER * 1000)); zeit.textContent = `${mmss(t)} / ${mmss(F.DAUER)}`; };
    const schleife = jetzt => {
      if (!cv.isConnected) { laeuft = false; au.pause(); return; }
      const dt = (jetzt - zuletzt) / 1000;
      zuletzt = jetzt;
      const i = F.szeneBei(t), s = F.SZENEN[i];
      if (i !== geladen) tonStellen();
      if (s.ton && tonOk) {
        if (au.readyState >= 2 && !au.seeking && !au.paused) {
          wartetSeit = 0;
          t = Math.max(t, s.start + au.currentTime - s.ton.ab);
          if (t >= s.start + s.dauer - 0.02) t = s.start + s.dauer + 0.001;
        } else {
          wartetSeit += dt;
          if (wartetSeit > 3) tonOk = false;
        }
      } else t += dt;
      if (t >= F.DAUER) { t = F.DAUER - 0.01; laeuft = false; au.pause(); knopf.textContent = '↺ Noch einmal'; }
      malen();
      if (laeuft) raf = requestAnimationFrame(schleife);
    };
    const spielen = () => {
      if (t >= F.DAUER - 0.05) t = 0;
      laeuft = true;
      wartetSeit = 0;
      knopf.textContent = '❚❚ Pause';
      zuletzt = performance.now();
      tonStellen();
      raf = requestAnimationFrame(schleife);
    };
    const pause = () => { laeuft = false; cancelAnimationFrame(raf); au.pause(); knopf.textContent = '▶ Weiter'; };
    knopf.addEventListener('click', () => (laeuft ? pause() : spielen()));
    tonKnopf.addEventListener('click', () => {
      au.muted = !au.muted;
      tonKnopf.setAttribute('aria-pressed', String(!au.muted));
      tonKnopf.textContent = au.muted ? 'Ton aus' : 'Ton an';
    });
    stelle.addEventListener('input', () => { t = stelle.value / 1000 * F.DAUER; malen(); if (laeuft) tonStellen(); });
    box.querySelector('.film-kapitel').addEventListener('click', e => {
      const b = e.target.closest('[data-kapitel]');
      if (!b) return;
      t = F.SZENEN[+b.dataset.kapitel].start;
      malen();
      if (laeuft) tonStellen(); else spielen();
    });
    malen();
    const nachLaden = () => { if (!laeuft && cv.isConnected) malen(); };
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 34px Andika'), document.fonts.load('800 40px "Baloo 2"')]).then(nachLaden, () => {});
    const bild = new Image();
    bild.onload = nachLaden;
    bild.src = 'bilder/kora.png';
    F.bilderLaden(nachLaden);
    filmStopp = () => { laeuft = false; cancelAnimationFrame(raf); au.pause(); };
  }

  function ansichtErzaehlung() {
    const E = R.erzaehlungInhalt, F = R.film, id = R.erzaehlung.id;
    const alt = store.eintraege[id] ? store.eintraege[id].text : '';
    const szenenTexte = F.SZENEN.filter(s => s.saetze.length);
    const prompt = promptAus({ titel: 'Die Große Erzählung (Trickfilm über die Geschichte der KI)', ziel: R.erzaehlung.lernziel, ablauf: `Ablauf: ${szenenTexte.map(s => s.saetze.join(' ')).join(' ')}` });
    app.innerHTML = `
    <nav class="pfad"><a class="knopf leise-knopf" href="#riff">← Zurück zum Riff</a></nav>
    <article class="station erz">
      <header class="film-kopf"><span class="kicker">Modul 0 · Die Große Erzählung</span><h1>${esc(R.erzaehlung.titel)}</h1><p>Mach es dir gemütlich. Schau den Film an, oder lies die Geschichte unten in Ruhe.</p></header>
      <div class="film" id="film"></div>
      <section class="teil nachlesen"><h2>Zum Nachlesen</h2>${szenenTexte.map(s => `<div class="geschichte-teil"><span class="geschichte-jahr">${esc(s.jahr || 'Vor langer Zeit')}</span><p>${esc(s.saetze.join(' '))}</p></div>`).join('')}</section>
      <section class="teil"><h2>Die Zeitleiste</h2><p>Sie ist maßstabsgetreu: Jeder kleine Strich steht für zehn Jahre. Schau, wie lange fast nichts passiert und wie eng es ganz unten wird!</p>${F.zeitleiste()}</section>
      <section class="teil"><h2><span class="nr">?</span>Was möchtest du herausfinden?</h2><ul class="fragen">${E.fragen.map(f => `<li>${esc(f)}</li>`).join('')}</ul><p>Im Riff warten passende Stationen: <a href="#a1">Regel oder Beispiel?</a>, <a href="#b1">Die Trennlinie</a> und <a href="#c1">Das nächste Wort</a>.</p></section>
      <section class="teil"><h2><span class="nr">✎</span>Am Tisch</h2><p class="tisch"><span aria-hidden="true">🖐️</span><span>${esc(E.tisch)}</span></p></section>
      <section class="teil"><h2><span class="nr">✓</span>Mein Eintrag</h2><label class="eintrag-frage" for="eintrag">Was hast du entdeckt? Was möchtest du noch wissen?</label><textarea class="eintrag-feld" id="eintrag" rows="4">${esc(alt)}</textarea>
        <p class="fertig-zeile"><button type="button" class="knopf" id="fertig"><span aria-hidden="true">🧹</span> Fertig! Ich räume auf</button><span class="leise">Du entscheidest, wann du fertig bist.</span></p></section>
      <details class="erwachsene"><summary>Für Erwachsene: Kora in ChatGPT, Gemini oder Claude nutzen</summary>
        <p>Dieser Prompt macht aus Ihrem eigenen KI-Werkzeug einen Lernbegleiter für diesen Film. Bitte nur gemeinsam mit dem Kind nutzen und nur mit einem Werkzeug, das Ihre Schule erlaubt. <strong>Keine Namen oder Fotos des Kindes eingeben.</strong></p>
        <textarea id="station-prompt" rows="10" readonly aria-label="Vorlagen-Prompt">${esc(prompt)}</textarea>
        <p class="kopier-zeile"><button type="button" class="knopf" id="station-prompt-kopieren">Prompt kopieren</button><span class="leise" id="station-prompt-status" aria-live="polite"></span></p>
      </details>
    </article>`;
    filmEinrichten(document.getElementById('film'));
    const feld = document.getElementById('eintrag');
    feld.addEventListener('input', () => { store.eintraege[id] = { text: feld.value, t: Date.now() }; save(); });
    document.getElementById('fertig').addEventListener('click', () => {
      if (filmStopp) filmStopp();
      uhrStoppen();
      const erstes = !store.done[id];
      store.done[id] = (store.done[id] || 0) + 1;
      if (erstes) store.stempel[id] = Date.now();
      save();
      einblenden(`<span class="stempel gross erz" aria-hidden="true"><span class="stempel-icon">🎬</span><span class="stempel-wort">ENTDECKT</span></span><h2>Gestempelt!</h2><p>${erstes ? 'In deinem Riff scheint jetzt die Sonne.' : 'Schön, dass du wiederholt hast.'}</p>`);
    });
    document.getElementById('station-prompt-kopieren').addEventListener('click', () => kopieren(prompt, document.getElementById('station-prompt-status'), document.getElementById('station-prompt')));
    kora.setzen({ titel: 'Die Große Erzählung', woerter: [], hilfe: E.hilfe });
  }

  /* ---------- Navigation ---------- */
  function route() {
    const ziel = location.hash.slice(1) || 'riff';
    const station = PER_ID[ziel];
    const modulSeite = R.module.find(m => m.id === ziel);
    const aufHeft = ziel === 'heft';
    uhrStoppen();
    wartendeUhr = null;
    kora.leeren();
    if (filmStopp) { filmStopp(); filmStopp = null; }
    document.getElementById('einblendung').innerHTML = '';
    if (ziel === 'modul0') uhrStarten(R.erzaehlung.id);
    else if (station) uhrStarten(station.id);
    else if (modulSeite) uhrStarten(modulSeite.id);
    document.querySelectorAll('[data-nav]').forEach(a => {
      const aktiv = a.dataset.nav === (aufHeft ? 'heft' : 'riff');
      if (aktiv) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (aufHeft) ansichtHeft();
    else if (ziel === 'modul0') ansichtErzaehlung();
    else if (station && R.inhalte[station.id]) {
      ansichtStation(station, R.module.find(m => m.stationen.includes(station)));
    } else if (station) {
      const modul = R.module.find(m => m.stationen.includes(station));
      ansichtPlatzhalter(station.titel, `Modul ${modul.nr} · ${modul.titel}`, 'Hier wird noch gebaut. Bald kannst du diese Station ausprobieren.');
    } else if (modulSeite && R.abschluss[modulSeite.id]) {
      ansichtAbschluss(modulSeite);
    } else if (modulSeite) {
      ansichtPlatzhalter(modulSeite.titel, `Modul ${modulSeite.nr} von ${R.module.length} · Abschluss`, 'Hier wird noch gebaut. Bald schaust du hier zurück: Was weißt du jetzt?');
    } else ansichtRiff();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
