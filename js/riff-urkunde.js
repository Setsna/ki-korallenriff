/* Urkunde und Tauchbuch-Blatt als PDF. Alles entsteht auf dem Gerät, nichts geht an einen Server.
   Jede Seite wird auf ein Canvas gezeichnet (A4 mit 150 dpi) und als JPEG in ein kleines PDF gelegt. */
(function () {
  'use strict';

  const B = 1240, H = 1754; // A4 hochkant, 150 dpi
  const TINTE = '#17324D', LEISE = '#4C6478', KORALLE = '#FF8E7F';
  const BLASE = '#D3F1E6'; // Pastell-Minze, passend zu Koras Panzer
  const FARBEN = { sonne: '#FFC94A', koralle: '#FF8E7F', meer: '#5AB2E8', minze: '#4FCBA6' };

  const bildCache = {};
  function bild(src) {
    if (!bildCache[src]) {
      bildCache[src] = new Promise((ok, nein) => {
        const img = new Image();
        img.onload = () => ok(img);
        img.onerror = () => nein(new Error(`Bild fehlt: ${src}`));
        img.src = src;
      });
    }
    return bildCache[src];
  }

  async function schriftenLaden() {
    if (!document.fonts || !document.fonts.load) return;
    await Promise.all(['800 100px "Baloo 2"', '700 60px "Baloo 2"', '600 25px "Baloo 2"', '400 40px "Andika"', '700 40px "Andika"']
      .map(f => document.fonts.load(f).catch(() => null)));
  }

  function neueSeite() {
    const c = document.createElement('canvas');
    c.width = B; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, B, H);
    return { c, ctx };
  }

  function rundesRechteck(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* Text mittig setzen und verkleinern, bis er in die Breite passt. */
  function zeile(ctx, text, x, y, schrift, groesse, maxB, farbe) {
    let g = groesse;
    do { ctx.font = `${schrift.replace('#', g)}`; g -= 2; } while (ctx.measureText(text).width > maxB && g > 20);
    ctx.fillStyle = farbe;
    ctx.fillText(text, x, y);
  }

  function umbrechen(ctx, text, maxB) {
    const woerter = text.split(/\s+/);
    const zeilen = [];
    let z = '';
    woerter.forEach(w => {
      const probe = z ? `${z} ${w}` : w;
      if (ctx.measureText(probe).width > maxB && z) { zeilen.push(z); z = w; } else z = probe;
    });
    if (z) zeilen.push(z);
    return zeilen;
  }

  /* Vorderseite: die Urkunde. form ist 'in' (Forscherin) oder 'er' (Forscher). */
  async function vorderseite({ name, form, module }) {
    await schriftenLaden();
    const [grund, kora] = await Promise.all([bild('bilder/urkunde.jpg'), bild('bilder/kora.png')]);
    const { c, ctx } = neueSeite();

    // Hintergrund füllt die Seite, an den Seiten wird etwas abgeschnitten
    const k = Math.max(B / grund.width, H / grund.height);
    const gw = grund.width * k, gh = grund.height * k;
    ctx.drawImage(grund, (B - gw) / 2, (H - gh) / 2, gw, gh);

    // Helles Feld für den Text
    ctx.save();
    rundesRechteck(ctx, 110, 150, B - 220, 1190, 48);
    ctx.fillStyle = 'rgba(255, 253, 243, .6)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(23, 50, 77, .55)';
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const mitte = B / 2;

    zeile(ctx, 'URKUNDE', mitte, 330, '800 #px "Baloo 2"', 150, 880, TINTE);
    zeile(ctx, 'Tauchgang im KI-Korallenriff', mitte, 410, '700 #px "Baloo 2"', 58, 900, LEISE);

    // Kora mit Sprechblase
    ctx.drawImage(kora, 150, 440, 260, 260);
    ctx.save();
    rundesRechteck(ctx, 420, 480, 650, 150, 36);
    ctx.fillStyle = BLASE;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = TINTE;
    ctx.stroke();
    // Spitze zu Kora: füllt die Lücke im Rand und zieht nur die zwei Außenkanten nach
    ctx.beginPath();
    ctx.moveTo(424, 548); ctx.lineTo(384, 600); ctx.lineTo(424, 588);
    ctx.closePath();
    ctx.fillStyle = BLASE;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(422, 548); ctx.lineTo(384, 600); ctx.lineTo(422, 588);
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.font = '400 40px "Andika"';
    ctx.fillStyle = TINTE;
    ctx.fillText('Ich bin Kora. Ich war bei', 460, 545);
    ctx.fillText('deinem Tauchgang dabei!', 460, 595);
    ctx.textAlign = 'center';

    // Name
    zeile(ctx, name, mitte, 830, '800 #px "Baloo 2"', 130, 900, TINTE);
    ctx.fillStyle = KORALLE;
    rundesRechteck(ctx, mitte - 320, 858, 640, 12, 6);
    ctx.fill();

    const titel = form === 'er' ? 'KI-Riff-Forscher' : 'KI-Riff-Forscherin';
    ctx.font = '400 46px "Andika"';
    ctx.fillStyle = TINTE;
    ctx.fillText('hat alle 9 Stationen im Riff erforscht', mitte, 950);
    ctx.fillText('und ist jetzt', mitte, 1010);
    zeile(ctx, titel, mitte, 1100, '800 #px "Baloo 2"', 92, 900, TINTE);

    // Die vier Module als farbige Plaketten
    ctx.font = '700 30px "Baloo 2"';
    const pl = module.map(m => ({ t: `${m.nr} · ${m.titel}`, f: FARBEN[m.farbe] || FARBEN.meer }));
    const breiten = pl.map(p => ctx.measureText(p.t).width + 44);
    const reihen = [[0, 1], [2, 3]];
    reihen.forEach((r, ri) => {
      const ges = r.reduce((n, i) => n + breiten[i], 0) + 20 * (r.length - 1);
      let x = mitte - ges / 2;
      const y = 1160 + ri * 70;
      r.forEach(i => {
        ctx.save();
        rundesRechteck(ctx, x, y, breiten[i], 54, 27);
        ctx.fillStyle = pl[i].f;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = TINTE;
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = TINTE;
        ctx.fillText(pl[i].t, x + breiten[i] / 2, y + 38);
        x += breiten[i] + 20;
      });
    });

    // Datum und Unterschrift
    ctx.save();
    rundesRechteck(ctx, 150, 1430, B - 300, 210, 36);
    ctx.fillStyle = 'rgba(255, 255, 255, .9)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(23, 50, 77, .55)';
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = TINTE;
    ctx.lineWidth = 3;
    [[200, 560], [680, 1040]].forEach(([a, e]) => { ctx.beginPath(); ctx.moveTo(a, 1560); ctx.lineTo(e, 1560); ctx.stroke(); });
    ctx.font = '400 32px "Andika"';
    ctx.fillStyle = LEISE;
    ctx.fillText('Datum', 380, 1605);
    ctx.fillText('Unterschrift der Lehrkraft', 860, 1605);

    return c;
  }

  const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  const farbeVon = f => FARBEN[f] || '#7DA7C4';

  /* Rückseite: Stempel, "Das kann ich schon" und die Einträge.
     stempel: [{icon, titel, farbe, da}], kann: [Satz], eintraege: [{icon, titel, farbe, text}] */
  async function rueckseite({ name, stempel, kann, eintraege }) {
    await schriftenLaden();
    const [grund, kora] = await Promise.all([bild('bilder/urkunde.jpg'), bild('bilder/kora.png')]);
    const { c, ctx } = neueSeite();
    const k = Math.max(B / grund.width, H / grund.height);
    ctx.drawImage(grund, (B - grund.width * k) / 2, (H - grund.height * k) / 2, grund.width * k, grund.height * k);
    ctx.save();
    rundesRechteck(ctx, 60, 60, B - 120, H - 120, 40);
    ctx.fillStyle = 'rgba(255, 253, 243, .92)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(23, 50, 77, .45)';
    ctx.stroke();
    ctx.restore();

    const L = 110, R = B - 110;
    ctx.textBaseline = 'alphabetic';

    // Kopf
    ctx.drawImage(kora, 96, 80, 150, 150);
    ctx.textAlign = 'left';
    zeile(ctx, 'Mein Tauchbuch', 270, 165, '800 #px "Baloo 2"', 78, R - 270, TINTE);
    zeile(ctx, `von ${name}`, 270, 218, '700 #px "Baloo 2"', 44, R - 270, LEISE);

    const ueberschrift = (text, y) => {
      ctx.textAlign = 'left';
      ctx.font = '800 44px "Baloo 2"';
      ctx.fillStyle = TINTE;
      ctx.fillText(text, L, y);
      ctx.fillStyle = KORALLE;
      rundesRechteck(ctx, L, y + 12, 90, 8, 4);
      ctx.fill();
    };

    // Stempel: 5 pro Reihe
    ueberschrift('Meine Stempel', 310);
    const spalte = (R - L) / 5;
    stempel.forEach((s, i) => {
      const cx = L + spalte * (i % 5) + spalte / 2;
      const cy = 410 + Math.floor(i / 5) * 205;
      ctx.save();
      ctx.translate(cx, cy);
      if (s.da) ctx.rotate(-6 * Math.PI / 180);
      ctx.beginPath();
      ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.fillStyle = s.da ? farbeVon(s.farbe) : '#EEF1F3';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = s.da ? TINTE : '#8CA3B3';
      if (!s.da) ctx.setLineDash([10, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = s.da ? 1 : 0.35;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `52px ${EMOJI}`;
      ctx.fillText(s.icon, 0, 4);
      ctx.restore();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '600 25px "Baloo 2"';
      ctx.fillStyle = s.da ? TINTE : LEISE;
      umbrechen(ctx, s.titel, spalte - 14).slice(0, 2).forEach((z, n) => ctx.fillText(z, cx, cy + 96 + n * 27));
    });

    // "Das kann ich schon" und Einträge teilen sich den Rest der Seite.
    // Die Schrift wird kleiner, bis alles passt. Passt es auch klein nicht, wird gekürzt.
    const oben = 410 + 205 + 200, unten = H - 110;
    const plan = g => {
      const ops = [];
      let y = oben;
      const zl = g * 1.32;
      ops.push({ t: 'kopf', text: 'Das kann ich schon', y });
      y += 40 + g * 1.1;
      ctx.font = `400 ${g}px "Andika"`;
      if (!kann.length) { ops.push({ t: 'text', text: 'Noch nichts markiert.', x: L, y, g, farbe: LEISE }); y += zl; }
      kann.forEach(satz => {
        umbrechen(ctx, satz, R - L - 50).forEach((z, n) => {
          if (n === 0) ops.push({ t: 'haken', x: L, y, g });
          ops.push({ t: 'text', text: z, x: L + 50, y, g, farbe: TINTE });
          y += zl;
        });
        y += g * 0.25;
      });
      y += 30;
      ops.push({ t: 'kopf', text: 'Meine Einträge', y: y + 20 });
      y += 60 + g * 1.1;
      if (!eintraege.length) { ops.push({ t: 'text', text: 'Noch keine Einträge.', x: L, y, g, farbe: LEISE }); y += zl; }
      eintraege.forEach(e => {
        const start = y - g;
        ops.push({ t: 'titel', text: `${e.icon}  ${e.titel}`, x: L + 26, y, g, nr: e });
        y += zl;
        ctx.font = `400 ${g}px "Andika"`;
        e.text.split(/\n+/).forEach(absatz => umbrechen(ctx, absatz, R - L - 26).forEach(z => {
          ops.push({ t: 'text', text: z, x: L + 26, y, g, farbe: TINTE, nr: e });
          y += zl;
        }));
        ops.push({ t: 'balken', y: start, h: y - start - g * 0.6, farbe: farbeVon(e.farbe), nr: e });
        y += g * 0.5;
      });
      return { ops, ende: y };
    };
    let g = 30, p = plan(g);
    while (p.ende > unten && g > 18) { g -= 1; p = plan(g); }
    let gekuerzt = false;
    if (p.ende > unten) {
      const grenze = unten - g * 1.6;
      p.ops = p.ops.filter(o => o.y <= grenze || o.t === 'balken' && o.y <= grenze);
      p.ops.forEach(o => { if (o.t === 'balken' && o.y + o.h > grenze) o.h = Math.max(0, grenze - o.y - g * 0.6); });
      // Ein Eintrag, von dem nur der Titel übrig bliebe, fällt ganz weg
      const mitText = new Set(p.ops.filter(o => o.t === 'text' && o.nr).map(o => o.nr));
      p.ops = p.ops.filter(o => !o.nr || mitText.has(o.nr));
      gekuerzt = true;
    }
    p.ops.forEach(o => {
      ctx.textAlign = 'left';
      if (o.t === 'kopf') ueberschrift(o.text, o.y);
      else if (o.t === 'haken') { ctx.font = `700 ${o.g}px "Andika"`; ctx.fillStyle = '#0B6B4F'; ctx.fillText('✓', o.x + 6, o.y); }
      else if (o.t === 'titel') { ctx.font = `700 ${o.g}px "Baloo 2", ${EMOJI}`; ctx.fillStyle = TINTE; ctx.fillText(o.text, o.x, o.y); }
      else if (o.t === 'text') { ctx.font = `400 ${o.g}px "Andika"`; ctx.fillStyle = o.farbe; ctx.fillText(o.text, o.x, o.y); }
      else if (o.t === 'balken') { ctx.fillStyle = o.farbe; rundesRechteck(ctx, L, o.y, 8, o.h, 4); ctx.fill(); }
    });
    if (gekuerzt) {
      ctx.font = `400 ${g}px "Andika"`;
      ctx.fillStyle = LEISE;
      ctx.fillText('… Alle Einträge findest du in deinem Tauchbuch auf dem iPad.', L + 26, unten - g * 0.3);
    }
    return c;
  }

  /* ---------- Kleines PDF aus JPEG-Seiten ---------- */
  function jpegBytes(canvas) {
    const daten = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
    const b = new Uint8Array(daten.length);
    for (let i = 0; i < daten.length; i++) b[i] = daten.charCodeAt(i);
    return b;
  }

  function pdfAusSeiten(canvasse) {
    const teile = [];
    let laenge = 0;
    const offsets = [];
    const text = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; teile.push(b); laenge += b.length; };
    const roh = b => { teile.push(b); laenge += b.length; };
    const obj = (nr, inhalt) => { offsets[nr] = laenge; text(`${nr} 0 obj\n${inhalt}\nendobj\n`); };

    const W = 595.28, Hp = 841.89;
    const n = canvasse.length;
    // 1 Katalog, 2 Seitenbaum, danach je Seite: Seite, Inhalt, Bild
    const seitenNr = i => 3 + i * 3;
    text('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, `<< /Type /Pages /Count ${n} /Kids [${canvasse.map((_, i) => `${seitenNr(i)} 0 R`).join(' ')}] >>`);
    canvasse.forEach((cv, i) => {
      const s = seitenNr(i);
      obj(s, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${Hp}] /Resources << /XObject << /Im${i} ${s + 2} 0 R >> >> /Contents ${s + 1} 0 R >>`);
      const strom = `q ${W} 0 0 ${Hp} 0 0 cm /Im${i} Do Q`;
      obj(s + 1, `<< /Length ${strom.length} >>\nstream\n${strom}\nendstream`);
      const jpg = jpegBytes(cv);
      offsets[s + 2] = laenge;
      text(`${s + 2} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
      roh(jpg);
      text('\nendstream\nendobj\n');
    });
    const anzahl = 3 + n * 3;
    const xref = laenge;
    let x = `xref\n0 ${anzahl}\n0000000000 65535 f \n`;
    for (let i = 1; i < anzahl; i++) x += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    text(`${x}trailer\n<< /Size ${anzahl} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(teile, { type: 'application/pdf' });
  }

  window.RiffUrkunde = { vorderseite, rueckseite, pdfAusSeiten };
})();
