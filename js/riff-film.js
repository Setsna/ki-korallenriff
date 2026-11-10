/* Die Große Erzählung als Animation im Browser.
   Die Szenenbilder kommen aus Canva, die Bewegung darüber wird hier gezeichnet.
   draw(ctx, t) erzeugt jedes Bild allein aus der Zeit, darum passt es immer zum Schieberegler. */
(() => {
  /* Wird Bild oder Ton einer Szene getauscht: Zahl hier hochzählen, sonst zeigen die Geräte die alte Fassung. */
  const STAND = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3 };
  const stand = nr => (STAND[nr] ? `?v=${STAND[nr]}` : '');
  'use strict';
  const W = 1280, H = 720;
  const TINTE = '#17324D';
  const SCHRIFT = '"Baloo 2", "Andika", system-ui, sans-serif';
  const LESE = '"Andika", system-ui, sans-serif';
  const klemm = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const weich = x => { x = klemm(x); return x * x * (3 - 2 * x); };
  const auf = (lt, a, d = 0.5) => { const x = klemm((lt - a) / d); if (x <= 0) return 0; const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

  const koraBild = new Image();
  koraBild.src = 'bilder/kora.png';

  function kasten(ctx, x, y, w, h, r, fuell, rand = TINTE, breite = 5) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fuell) { ctx.fillStyle = fuell; ctx.fill(); }
    if (rand) { ctx.strokeStyle = rand; ctx.lineWidth = breite; ctx.stroke(); }
  }
  function kreis(ctx, x, y, r, fuell, rand, breite = 3) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fuell) { ctx.fillStyle = fuell; ctx.fill(); }
    if (rand) { ctx.strokeStyle = rand; ctx.lineWidth = breite; ctx.stroke(); }
  }
  function schrift(ctx, s, x, y, groesse = 32, farbe = TINTE, art = SCHRIFT, gewicht = 700) {
    ctx.font = `${gewicht} ${groesse}px ${art}`;
    ctx.fillStyle = farbe; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  }
  function umbrechen(ctx, text, breite) {
    const zeilen = []; let zeile = '';
    text.split(' ').forEach(w => {
      const test = zeile ? `${zeile} ${w}` : w;
      if (ctx.measureText(test).width > breite && zeile) { zeilen.push(zeile); zeile = w; } else zeile = test;
    });
    if (zeile) zeilen.push(zeile);
    return zeilen;
  }
  /* Hintergrund für die Titelszene */
  function riff(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#7FDDEB'); g.addColorStop(1, '#1F7CAE');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 0.16 + 0.04 * Math.sin(t * 0.7); ctx.fillStyle = '#FFF8D6';
    [[120, 210, 40], [430, 540, 300], [800, 900, 660], [1110, 1190, 1020]].forEach(([a, b, c]) => { ctx.beginPath(); ctx.moveTo(a, 0); ctx.lineTo(b, 0); ctx.lineTo(c + 140, H); ctx.lineTo(c - 20, H); ctx.fill(); });
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i < 14; i++) {
      const x = (i * 97 + 40 + Math.sin(t * 0.8 + i) * 12) % W, y = H - ((t * (22 + i * 3) + i * 83) % (H + 40));
      ctx.beginPath(); ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#EFD08E';
    ctx.beginPath(); ctx.moveTo(0, 610); ctx.bezierCurveTo(300, 570, 650, 640, 900, 600); ctx.bezierCurveTo(1050, 580, 1180, 600, W, 590); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    const farben = ['#F2668B', '#F7A23C', '#A56BE0', '#3CC6A0'];
    [[60, 620, 0], [1200, 600, 1], [1080, 610, 2], [420, 620, 3]].forEach(([x, y, i]) => {
      ctx.strokeStyle = farben[i]; ctx.lineWidth = 12; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 70); ctx.moveTo(x, y - 25); ctx.lineTo(x - 30, y - 60); ctx.moveTo(x, y - 35); ctx.lineTo(x + 28, y - 78); ctx.stroke();
    });
  }
  function kora(ctx, t, x = 118, y = 515, groesse = 200) {
    if (!koraBild.complete || !koraBild.naturalWidth) return;
    ctx.drawImage(koraBild, x - groesse / 2, y - groesse / 2 + Math.sin(t * 1.1) * 8, groesse, groesse);
  }

  /* Bildfeld: Die Bilder sind 2:1. Bewegung darüber rechnet in Anteilen des Bildes (u, v von 0 bis 1). */
  const FELD = { x: 30, y: 20, b: 1220, h: 570 };
  const BB = 1220, BH = 610, BY = -20;
  const U = u => u * BB, V = v => BY + v * BH;
  const bildSpeicher = {};
  function szenenBild(nr) {
    if (!bildSpeicher[nr]) { const i = new Image(); i.src = `bilder/film/szene-${String(nr).padStart(2, '0')}.jpg${stand(nr)}`; bildSpeicher[nr] = i; }
    return bildSpeicher[nr];
  }
  function bildfeld(ctx, lt, s) {
    const k = weich((lt - 0.05) / 0.5);
    ctx.fillStyle = '#123F66'; ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(FELD.x, FELD.y);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(0, 0, FELD.b, FELD.h, 26); ctx.clip();
    const bild = szenenBild(s.nr);
    const anteil = klemm(lt / s.dauer);
    const zoom = 1.015 + 0.05 * anteil, rechts = s.nr % 2 ? 1 : -1;
    ctx.translate(FELD.b / 2 + rechts * 10 * (anteil - 0.5), FELD.h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-FELD.b / 2, -FELD.h / 2);
    if (bild.complete && bild.naturalWidth) ctx.drawImage(bild, 0, BY, BB, BH);
    else {
      ctx.fillStyle = '#FFF8EA'; ctx.fillRect(0, 0, FELD.b, FELD.h);
      schrift(ctx, s.titel, FELD.b / 2, FELD.h / 2, 60, TINTE, SCHRIFT, 800);
    }
    if (s.bewegung) s.bewegung(ctx, lt, s);
    ctx.restore();
    kasten(ctx, 0, 0, FELD.b, FELD.h, 26, null, TINTE, 6);
    ctx.restore();
  }
  const satzStart = (s, i) => (s.zeit[i] ? s.zeit[i][0] : 1e9);

  function note(ctx, x, y, a, farbe) {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
    ctx.fillStyle = farbe; ctx.strokeStyle = farbe; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 10, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(11, -3); ctx.lineTo(11, -44); ctx.quadraticCurveTo(24, -36, 30, -24); ctx.stroke();
    ctx.restore();
  }
  function sprechblase(ctx, x, y, r, farbe, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = farbe; ctx.strokeStyle = 'rgba(23,50,77,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x - r, y - r * 0.7, r * 2, r * 1.4, r * 0.5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r * 0.3, y + r * 0.65); ctx.lineTo(x - r * 0.45, y + r * 1.05); ctx.lineTo(x + r * 0.1, y + r * 0.68); ctx.fill();
    ctx.restore();
  }

  /* Perzeptron: eigene Tafel über dem Bild, die Linie rückt nach jedem Fehler weiter */
  const BLAU = [[0.15, 0.2], [0.3, 0.12], [0.25, 0.35], [0.45, 0.22], [0.5, 0.08], [0.62, 0.2], [0.12, 0.45], [0.4, 0.4]];
  const ROT = [[0.6, 0.55], [0.75, 0.48], [0.85, 0.5], [0.7, 0.7], [0.45, 0.72], [0.3, 0.8], [0.85, 0.72], [0.55, 0.85]];
  function tafel(ctx, lt, s) {
    const x0 = U(0.655), y0 = V(0.05), b = U(0.965) - x0, h = V(0.9) - y0;
    kasten(ctx, x0, y0, b, h, 6, '#FBF3DD', 'rgba(107,66,38,.75)', 4);
    const P = (x, y) => [x0 + 16 + x * (b - 32), y0 + 16 + y * (h - 32)];
    const start = satzStart(s, 2), SCHRITTE = 7;
    const fort = klemm((lt - start) / 3.8);
    const stufe = Math.floor(fort * SCHRITTE);
    const zwischen = weich((fort * SCHRITTE - stufe) / 0.35);
    const anteil = lt < start ? 0 : klemm((stufe + zwischen) / SCHRITTE);
    const a = 0.1 + (0.65 - 0.1) * anteil, m = -0.3 * anteil;
    const linieY = x => a + m * x;
    BLAU.forEach(([x, y]) => {
      const [X, Y] = P(x, y);
      if (y > linieY(x)) kreis(ctx, X, Y, 16, null, '#D6336C', 3);
      kreis(ctx, X, Y, 9, '#2D7FD3', '#17324D', 2);
    });
    ROT.forEach(([x, y]) => {
      const [X, Y] = P(x, y);
      if (y < linieY(x)) kreis(ctx, X, Y, 16, null, '#D6336C', 3);
      kreis(ctx, X, Y, 9, '#E2553A', '#17324D', 2);
    });
    const [ax, ay] = P(-0.02, linieY(-0.02)), [bx, by] = P(1.02, linieY(1.02));
    ctx.strokeStyle = TINTE; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }

  const SZENEN = [
    { jahr: '', titel: 'Titel', saetze: [], fest: 5, titelbild: true },
    { nr: 1, jahr: '', titel: 'Werkzeuge', saetze: ['Vor langer, langer Zeit bauten Menschen Werkzeuge.', 'Einen Hebel, ein Rad und einen Abakus zum Rechnen.', 'Aber kann man auch ein Werkzeug zum Denken bauen?'],
      bewegung(ctx, lt, s) {
        if (lt < satzStart(s, 2)) return;
        const k = auf(lt, satzStart(s, 2), 0.6);
        ctx.save(); ctx.translate(U(0.83), V(0.28)); ctx.scale(k, k);
        kreis(ctx, -8, 66, 9, '#EFD3A0', TINTE, 3);
        kreis(ctx, 0, 0, 52, '#EFD3A0', TINTE, 4);
        schrift(ctx, '?', 0, 4, 70, TINTE, SCHRIFT, 800);
        ctx.restore();
      } },
    { nr: 2, jahr: '1843', titel: 'Ada Lovelace', saetze: ['1843: Ada Lovelace beschreibt eine große Rechenmaschine.', 'Sie ahnt: Die Maschine könnte sogar Musik erfinden!', 'Aber sie sagt auch: Die Maschine tut nur, was man ihr befiehlt.'],
      bewegung(ctx, lt, s) {
        const z = satzStart(s, 1);
        if (lt < z) return;
        const farben = ['#C93F6D', '#2F6F9C', '#3E7D4F', '#7A4CB0'], ein = klemm((lt - z) * 1.5);
        for (let i = 0; i < 8; i++) {
          const d = ((lt - z) * 0.3 + i / 8) % 1;
          note(ctx, U(0.72 + (i % 4) * 0.05) + Math.sin(d * 7 + i) * 18, V(0.42 - d * 0.36), ein * Math.sin(d * Math.PI), farben[i % 4]);
        }
      } },
    { nr: 3, jahr: '1950', titel: 'Alan Turing', saetze: ['1950: Alan Turing fragt: Können Maschinen denken?', 'Sein Spiel: Hinter zwei Vorhängen antworten ein Mensch und eine Maschine.', 'Merkst du noch, wer wer ist?'],
      bewegung(ctx, lt, s) {
        const z = satzStart(s, 2);
        if (lt < z) return;
        [[0.53, 0], [0.76, 0.5]].forEach(([u, p]) => {
          const k = auf(lt, z + p * 0.6, 0.5), w = Math.sin(lt * 2 + p * 3) * 6;
          ctx.save(); ctx.translate(U(u), V(0.2) + w); ctx.scale(k, k);
          kreis(ctx, 0, 0, 44, 'rgba(255,255,255,.92)', TINTE, 4);
          schrift(ctx, '?', 0, 4, 60, TINTE, SCHRIFT, 800);
          ctx.restore();
        });
      } },
    { nr: 4, jahr: '1956', titel: 'Ein Name', saetze: ['1956: Forschende geben dem Ganzen einen Namen: Künstliche Intelligenz.', 'Ihre Idee: Wir schreiben einfach alle Regeln auf!', 'Doch die Welt hat mehr Regeln, als auf jede Papierrolle passen.'] },
    { nr: 5, jahr: '1957', titel: 'Das Perzeptron', saetze: ['1957: Frank Rosenblatt baut das Perzeptron.', 'Es bekommt keine Regeln, sondern Beispiele.', 'Nach jedem Fehler rückt es seine Linie ein Stück weiter. So lernt es!'], bewegung: tafel },
    { nr: 6, jahr: '1966', titel: 'ELIZA', saetze: ['1966: Joseph Weizenbaum schreibt das Programm ELIZA.', 'ELIZA wiederholt nur Wörter. Trotzdem erzählen ihr Menschen ihre Sorgen.', 'Weizenbaum warnt: Trau Maschinen nicht mehr zu, als sie können.'] },
    { nr: 7, jahr: 'ca. 1974–1993', titel: 'KI-Winter', saetze: ['Dann wird es still. Die Computer sind zu langsam, und es fehlen Daten.', 'Man nennt diese Zeit den KI-Winter. Aber einige forschen weiter.'],
      bewegung(ctx, lt, s) {
        ctx.save();
        ctx.beginPath(); ctx.rect(U(0.53), V(0.08), U(0.91) - U(0.53), V(0.71) - V(0.08)); ctx.clip();
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 44; i++) {
          const x = U(0.53) + ((i * 47) % (U(0.91) - U(0.53))) + Math.sin(lt * 0.8 + i) * 8;
          const y = V(0.08) + ((lt * (20 + (i % 5) * 7) + i * 37) % (V(0.71) - V(0.08)));
          ctx.beginPath(); ctx.arc(x, y, 1.6 + (i % 3), 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        const licht = weich((lt - satzStart(s, 1) - 1.2) / 1.5);
        ctx.fillStyle = `rgba(5,14,28,${0.58 * (1 - licht)})`;
        ctx.fillRect(-60, -60, FELD.b + 120, FELD.h + 120);
      } },
    { nr: 8, jahr: '1997', titel: 'Deep Blue', saetze: ['1997: Der Computer Deep Blue gewinnt im Schach gegen den Weltmeister.', 'Aber Deep Blue kann nur Schach. Eine Katze erkennen? Keine Chance!'],
      bewegung(ctx, lt) {
        for (let a = 0; a < 3; a++) for (let b = 0; b < 8; b++) {
          const an = (a * 3 + b * 7 + Math.floor(lt * 3)) % 7 === 0;
          if (an) kreis(ctx, U(0.65 + a * 0.028), V(0.22 + b * 0.05), 4, '#FFD866', null);
        }
      } },
    { nr: 9, jahr: '2012', titel: 'Bilder erkennen', saetze: ['2012: Drei Dinge kommen zusammen.', 'Ganz viele Bilder, schnelle Grafikchips und künstliche Nervennetze.', 'Jetzt erkennt der Computer die Katze!'],
      bewegung(ctx, lt, s) {
        const z = satzStart(s, 2);
        if (lt < z) return;
        const p = 0.5 + 0.5 * Math.sin((lt - z) * 4);
        ctx.strokeStyle = `rgba(255,216,102,${0.65 + 0.35 * p})`; ctx.lineWidth = 7 + p * 4;
        ctx.strokeRect(U(0.615), V(0.36), U(0.725) - U(0.615), V(0.67) - V(0.36));
      } },
    { nr: 10, jahr: '2017', titel: 'Der Transformer', saetze: ['2017: Der Transformer wird erfunden.', 'Er schaut bei jedem Wort auf alle anderen Wörter im Satz.', 'So findet er heraus: Mit „sie“ ist die Katze gemeint.'],
      bewegung(ctx, lt, s) {
        if (lt > satzStart(s, 1)) for (let i = 0; i < 8; i++) {
          const d = ((lt - satzStart(s, 1)) * 0.5 + i / 8) % 1;
          kreis(ctx, U(0.24 + d * 0.66), V(0.3 + Math.sin(d * Math.PI) * -0.17), 6, 'rgba(255,240,160,.95)', null);
        }
        const z = satzStart(s, 2);
        if (lt > z) {
          const d = ((lt - z) * 0.6) % 1;
          kreis(ctx, U(0.8 + d * 0.06), V(0.42 + d * 0.3), 11, '#FFD866', '#FFFFFF', 3);
        }
      } },
    { nr: 11, jahr: '2022', titel: 'ChatGPT', saetze: ['2022: ChatGPT erscheint.', 'Millionen Menschen schreiben plötzlich mit einer KI.'],
      bewegung(ctx, lt) {
        const farben = ['#FF8E7F', '#FFC94A', '#5AB2E8', '#4FCBA6', '#C08CF2', '#FFFFFF'];
        for (let i = 0; i < 22; i++) {
          const d = (lt * 0.13 + i * 0.137) % 1;
          sprechblase(ctx, U(((i * 0.211) % 0.95) + 0.03) + Math.sin(d * 6 + i) * 8, V(0.62 - d * 0.62), 15 + (i % 3) * 5, farben[i % 6], Math.sin(d * Math.PI) * 0.92);
        }
      } },
    { nr: 12, jahr: 'heute', titel: 'Ein Echo von uns allen', saetze: ['Und heute bist du hier.', 'Eine KI hat nie eine Katze gestreichelt. Trotzdem erkennt sie eine Katze, denn sie hat aus den Bildern und Texten vieler Menschen gelernt.', 'Wenn du mit ihr schreibst, antwortet dir ein Echo von uns allen.', 'Was möchtest du herausfinden?'],
      bewegung(ctx, lt, s) {
        const z = satzStart(s, 2);
        if (lt < z) return;
        for (let i = 0; i < 4; i++) {
          const d = ((lt - z) * 0.32 + i / 4) % 1;
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d) * 0.75})`; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(U(0.375), V(0.86), 30 + d * 260, -1.25, -0.2); ctx.stroke();
        }
      } }
  ];

  /* Zeitplan nach den Aufnahmen: Wann beginnt und endet jeder Satz in der Datei (Sekunden).
     Die Stille am Anfang und Ende der Dateien wird übersprungen.
     Stimmen von ElevenLabs. Bearbeitung und Messung: Dateien/Werkzeuge/ton_bearbeiten.py */
  const AUFNAHME = {
    1: [[0.0, 3.86], [4.36, 8.38], [8.79, 12.2]],
    2: [[0.12, 5.31], [5.66, 9.22], [9.69, 13.56]],
    3: [[0.13, 5.1], [5.56, 10.24], [10.77, 12.59]],
    4: [[0.0, 6.2], [6.59, 9.75], [10.13, 14.29]],
    5: [[0.0, 4.83], [5.23, 7.87], [8.4, 13.71]],
    6: [[0.0, 5.32], [5.96, 10.51], [11.03, 15.23]],
    7: [[0.18, 4.57], [5.09, 9.56]],
    8: [[0.0, 5.78], [6.11, 11.55]],
    9: [[0.13, 3.5], [3.87, 8.51], [8.84, 11.08]],
    10: [[0.12, 3.39], [3.82, 7.12], [7.5, 11.23]],
    11: [[0.0, 3.51], [3.66, 7.24]],
    12: [[0.16, 1.41], [1.95, 10.44], [10.87, 14.3], [14.94, 16.59]]
  };
  let DAUER = 0;
  (function zeitplan() {
    let summe = 0;
    SZENEN.forEach(s => {
      s.start = summe; s.zeit = [];
      const aufnahme = AUFNAHME[s.nr];
      if (aufnahme) {
        const ab = Math.max(0, aufnahme[0][0] - 0.35), bis = aufnahme[aufnahme.length - 1][1];
        s.ton = { datei: `audio/szene-${String(s.nr).padStart(2, '0')}.m4a${stand(s.nr)}`, ab };
        aufnahme.forEach(([von, ende], i) => {
          const naechster = aufnahme[i + 1] ? aufnahme[i + 1][0] - 0.1 : bis + 0.5;
          s.zeit.push([von - ab - 0.1, naechster - ab]);
        });
        s.dauer = bis - ab + 0.8;
      } else s.dauer = s.fest;
      summe += s.dauer;
    });
    DAUER = summe;
  })();

  function untertitel(ctx, s, lt) {
    s.zeit.forEach(([a, b], i) => {
      if (lt < a || lt >= b) return;
      const alpha = Math.min(klemm((lt - a) / 0.3), klemm((b - lt) / 0.3));
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.font = `700 34px ${LESE}`;
      const zeilen = umbrechen(ctx, s.saetze[i], 1060), lh = 44, h = zeilen.length * lh + 30, y0 = H - 22 - h;
      kasten(ctx, W / 2 - 570, y0, 1140, h, 24, 'rgba(255,255,255,.95)', 'rgba(23,50,77,.4)', 3);
      zeilen.forEach((z, k) => schrift(ctx, z, W / 2, y0 + 15 + lh * (k + 0.5), 34, TINTE, LESE));
      ctx.restore();
    });
  }
  function jahrSchild(ctx, s, lt) {
    if (!s.jahr) return;
    const k = auf(lt, 0.35, 0.5);
    if (k <= 0) return;
    ctx.save();
    ctx.font = `800 40px ${SCHRIFT}`;
    const w = Math.max(150, ctx.measureText(s.jahr).width + 56);
    ctx.translate(40 + w / 2, 66); ctx.scale(k, k);
    kasten(ctx, -w / 2, -36, w, 72, 36, '#FFC94A', TINTE, 5);
    schrift(ctx, s.jahr, 0, 3, 40, TINTE, SCHRIFT, 800);
    ctx.restore();
  }
  function szeneBei(t) {
    t = klemm(t, 0, DAUER - 1e-6);
    for (let k = 0; k < SZENEN.length; k++) if (t < SZENEN[k].start + SZENEN[k].dauer) return k;
    return SZENEN.length - 1;
  }
  function draw(ctx, t) {
    const s = SZENEN[szeneBei(t)], lt = klemm(t, 0, DAUER) - s.start;
    ctx.clearRect(0, 0, W, H);
    if (s.titelbild) {
      riff(ctx, lt);
      kora(ctx, lt, 250, 400, 320);
      const k = auf(lt, 0.3, 0.6);
      ctx.save(); ctx.translate(800, 280); ctx.scale(k, k);
      schrift(ctx, 'Die Große Erzählung', 0, -40, 78, '#FFFFFF');
      schrift(ctx, 'Wie Menschen Maschinen', 0, 50, 42, '#FFFFFF', LESE);
      schrift(ctx, 'das Lernen beibrachten', 0, 102, 42, '#FFFFFF', LESE);
      ctx.restore();
    } else {
      bildfeld(ctx, lt, s);
    }
    jahrSchild(ctx, s, lt);
    untertitel(ctx, s, lt);
  }

  const EREIGNISSE = [[1843, 'Ada Lovelace'], [1950, 'Turings Frage'], [1956, 'Name „Künstliche Intelligenz“'], [1957, 'Perzeptron'], [1966, 'ELIZA'], [1997, 'Deep Blue'], [2012, 'Bilder erkennen'], [2017, 'Transformer'], [2022, 'ChatGPT'], [2026, 'heute']];
  function zeitleiste() {
    const Y0 = 1840, Y1 = 2030, k = 4.6, oben = 20, y = j => oben + (j - Y0) * k;
    let letztes = -Infinity;
    const ev = EREIGNISSE.map(([j, l]) => { const ty = y(j), ly = Math.max(ty, letztes + 21); letztes = ly; return { j, l, ty, ly }; });
    const hoehe = Math.max(y(Y1), letztes) + 24;
    let s = `<svg class="zeitleiste" viewBox="0 0 360 ${hoehe}" role="img" aria-label="Zeitleiste von 1840 bis heute, maßstabsgetreu. Die meisten Ereignisse liegen ganz am Ende.">`;
    s += `<rect class="zl-winter" x="64" y="${y(1974)}" width="12" height="${y(1993) - y(1974)}" rx="3"/><line class="zl-achse" x1="70" x2="70" y1="${y(Y0)}" y2="${y(Y1)}"/>`;
    for (let j = Y0; j <= Y1; j += 10) {
      s += `<line class="zl-strich" x1="${j % 50 === 0 ? 58 : 64}" x2="70" y1="${y(j)}" y2="${y(j)}"/>`;
      if (j % 20 === 0) s += `<text class="zl-jahr" x="54" y="${y(j) + 4}" text-anchor="end">${j}</text>`;
    }
    s += `<text class="zl-text zl-leise" x="92" y="${(y(1974) + y(1993)) / 2 + 4}">ca. 1974–1993 · KI-Winter</text>`;
    ev.forEach(e => { s += `<circle class="zl-punkt" cx="70" cy="${e.ty}" r="5"/><path class="zl-linie" d="M75 ${e.ty} L88 ${e.ly}"/><text class="zl-text" x="92" y="${e.ly + 4.5}"><tspan class="zl-j">${e.j}</tspan> ${e.l}</text>`; });
    return `${s}</svg>`;
  }

  /* Bilder vorab laden, damit es beim Springen nicht flackert */
  function bilderLaden(fertig) {
    SZENEN.forEach(s => { if (s.nr) { const b = szenenBild(s.nr); if (!b.complete) b.addEventListener('load', fertig, { once: true }); } });
  }

  window.RIFF.film = { W, H, SZENEN, get DAUER() { return DAUER; }, draw, zeitleiste, bilderLaden, szeneBei };
})();
