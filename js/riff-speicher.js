/* Tauchgang im KI-Korallenriff: Speicher (seit dem Konto-Umbau, 14.11.2026).
   - Das Kind meldet sich mit dem Zugangscode des Perlentauchers an (js/konto-cloud.js).
   - Der Fortschritt liegt im Browser, ein Eintrag je Code (js/konto-speicher.js), und wird
     im Hintergrund mit kr_stand/<code> in Firebase abgeglichen.
   - Die Einträge („Mein Eintrag“, „Denk weiter“) bleiben NUR auf diesem Gerät, eigener Schlüssel je Code.
     Sie gehören nicht zum Stand und gehen nie in die Datenbank (Spec Konto-Umbau, Entscheidung 5).
   - ?vorschau=N zeigt nur auf dem eigenen Rechner (localhost) einen Beispielstand und speichert nichts.
   - Kein Löschknopf für Kinder. Zurücksetzen macht die Lehrkraft im Lehrerbereich des Perlentauchers.
   Die drei Baukasten-Module stehen in index.html vor dieser Datei, riff.js danach. */
(() => {
  'use strict';
  const R = window.RIFF;
  const LK = window.LagunenKonto;
  const A = LK.abgleich;

  /* Alles, was einen Stempel, eine Lernzeit und ein „Fertig!“ haben kann: Film, 9 Stationen, 4 Modul-Abschlüsse */
  const IDS = [R.erzaehlung.id, ...R.module.flatMap(m => [...m.stationen.map(s => s.id), m.id])];
  /* Selbsteinschätzung im Modul-Abschluss: "m1-0" … */
  const ZIELE = R.module.flatMap(m => m.ziele.map((z, i) => `${m.id}-${i}`));
  const ZIEL_WERTE = ['kann', 'ueben'];
  const zielOk = v => ZIEL_WERTE.includes(v);
  /* Orte für Einträge: Film, Stationen, „Denk weiter“ je Modul (t-m1 …) */
  const EINTRAG_ORTE = [R.erzaehlung.id, ...R.module.flatMap(m => [...m.stationen.map(s => s.id), `t-${m.id}`])];
  const EINTRAG_MAX = 2000;

  /* ---------- Der Stand in kr_stand/<code> ----------
     done     { id: Anzahl }      wie oft „Fertig!“ getippt wurde (Wiederholungen)
     stempel  { id: Zeitpunkt }   der erste Abschluss
     zeit     { id: Sekunden }    Lernzeit
     ziele    { "m1-0": "kann" | "ueben" }
     angelegt, geaendert (setzt konto-speicher.js). Kein Name, keine Einträge. */
  const ganz = x => Math.round(A.zahl(x));
  function sauber(roh) {
    const r = A.karte(roh);
    const d = A.karte(r.done), sp = A.karte(r.stempel), z = A.karte(r.zeit), zi = A.karte(r.ziele);
    const done = {}, stempel = {}, zeit = {}, ziele = {};
    for (const id of IDS) {
      const n = d[id] === true ? 1 : ganz(d[id]);
      if (n) done[id] = n;
      const t = ganz(sp[id]);
      if (t) stempel[id] = t;
      const s = ganz(z[id]);
      if (s) zeit[id] = s;
    }
    for (const k of ZIELE) if (zielOk(zi[k])) ziele[k] = zi[k];
    return { done, stempel, zeit, ziele };
  }

  /* Zwei Stände zusammenführen (Bausteine aus js/konto-abgleich.js) */
  function mische(basis, lokal, fern) {
    const b = sauber(basis), l = sauber(lokal), f = sauber(fern);
    const done = {}, zeit = {}, ziele = {};
    for (const id of IDS) {
      const n = A.zuwachs(b.done[id], l.done[id], f.done[id]);
      if (n) done[id] = n;
      const s = A.zuwachs(b.zeit[id], l.zeit[id], f.zeit[id]);
      if (s) zeit[id] = s;
    }
    for (const k of ZIELE) {
      const v = A.hierGeaendert(b.ziele[k], l.ziele[k], f.ziele[k], zielOk);
      if (v) ziele[k] = v;
    }
    const aus = {
      done,
      stempel: A.vereinigeFrueh(l.stempel, f.stempel),
      zeit, ziele,
      geaendert: A.spaeter(A.karte(lokal).geaendert, A.karte(fern).geaendert)
    };
    const angelegt = A.frueher(A.karte(lokal).angelegt, A.karte(fern).angelegt);
    if (angelegt) aus.angelegt = angelegt;
    return aus;
  }

  /* Nach dem Zurücksetzen durch die Lehrkraft: leer anfangen */
  const neuanfang = (lokal, jetzt) => ({ done: {}, stempel: {}, zeit: {}, ziele: {}, angelegt: jetzt, geaendert: jetzt });

  /* ---------- Vorschau (nur auf dem eigenen Rechner) ---------- */
  const LOKAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const vorschauWert = new URLSearchParams(location.search).get('vorschau');
  const vorschauAn = LOKAL && vorschauWert !== null && /^\d{1,2}$/.test(vorschauWert);
  const STATIONEN = R.module.flatMap(m => m.stationen);
  let vorschauEintraege = {};
  function vorschauStand() {
    if (!vorschauAn) return null;
    const n = Math.min(Number(vorschauWert), STATIONEN.length);
    const k = { done: {}, stempel: {}, zeit: {}, ziele: {} };
    const jetzt = Date.now();
    STATIONEN.slice(0, n).forEach((s, i) => { k.done[s.id] = 1; k.stempel[s.id] = jetzt; k.zeit[s.id] = (7 + i * 2) * 60; });
    if (n > 0) {
      k.done.erz = 1; k.stempel.erz = jetzt; k.zeit.erz = 11 * 60;
      vorschauEintraege.a1 = { text: 'Beispiel-Eintrag: Eine Regel für jeden Clownfisch zu finden, ist echt schwer.', t: jetzt };
    }
    if (n > 1) vorschauEintraege.a2 = { text: 'Beispiel-Eintrag: Ähnliche Fische liegen nah beieinander.\nWarum eigentlich?', t: jetzt };
    R.module.forEach(m => {
      m.ziele.forEach((z, i) => { if (k.done[z.station]) k.ziele[`${m.id}-${i}`] = 'kann'; });
      if (m.stationen.every(s => k.done[s.id])) k.done[m.id] = 1;
    });
    return k;
  }

  /* ---------- Speicher und Cloud ---------- */
  const S = LK.speicher({
    schluessel: 'ki-korallenriff-v3',
    nameMax: 20,
    leer: () => ({ done: {}, stempel: {}, zeit: {}, ziele: {} }),
    normalisiere: sauber,
    mische,
    vorschau: vorschauStand
  });

  /* Gemeinsames Konto: das Firebase-Projekt des Perlentauchers.
     Diese Angaben sind keine Geheimnisse, sie stehen bei jeder Firebase-Seite im Quelltext.
     Geschützt werden die Daten durch die Regeln in der Firebase-Konsole. */
  const FIREBASE = {
    apiKey: 'AIzaSyBX3MUJq69uFyejbEiJimGeAtHMER3OCdE',
    authDomain: 'lernplattform-44aa1.firebaseapp.com',
    projectId: 'lernplattform-44aa1',
    storageBucket: 'lernplattform-44aa1.firebasestorage.app',
    messagingSenderId: '213839225177',
    appId: '1:213839225177:web:4cf676269e50c708466c48'
  };
  const cloud = LK.cloud({
    firebase: FIREBASE,
    sammlung: 'kr_stand',
    speicher: S, mische, neuanfang,
    brauchtAngaben: false,
    schreibPauseMs: 2500,
    nameMax: 20
  });

  /* ---------- Einträge: nur auf diesem Gerät ---------- */
  const eintragSchluessel = c => `${S.schluesselFuer(c)}.eintraege`;
  let eintragCode = null, eintragCache = {};
  /* Alle Einträge des angemeldeten Kindes: { ort: { text, t } } */
  function eintraege() {
    if (S.istVorschau) return vorschauEintraege;
    const c = S.code();
    if (!c) return {};
    if (c !== eintragCode) {
      eintragCode = c;
      eintragCache = {};
      try {
        const d = JSON.parse(localStorage.getItem(eintragSchluessel(c)) || 'null');
        for (const [id, e] of Object.entries(A.karte(d))) {
          if (EINTRAG_ORTE.includes(id) && A.istObjekt(e) && typeof e.text === 'string' && e.text.trim()) {
            eintragCache[id] = { text: e.text.slice(0, EINTRAG_MAX), t: A.zahl(e.t) };
          }
        }
      } catch (e) { /* unlesbar: leer anfangen, der alte Text bleibt im Speicher liegen */ }
    }
    return eintragCache;
  }
  /* Eigener Eintrag an einem Ort. Leerer Text löscht den Eintrag. */
  function eintragSetzen(id, text) {
    if (S.istVorschau) return true;
    const c = S.code();
    if (!c || !EINTRAG_ORTE.includes(id)) return false;
    const alle = eintraege();
    const s = String(text || '').slice(0, EINTRAG_MAX);
    if (s.trim()) alle[id] = { text: s, t: Date.now() };
    else delete alle[id];
    try { localStorage.setItem(eintragSchluessel(c), JSON.stringify(alle)); } catch (e) { return false; }
    return true;
  }

  /* ---------- Fortschritt ---------- */
  /* „Fertig!“ getippt. Gibt zurück, ob es das erste Mal war (dann gibt es den Stempel). */
  function fertigMachen(id) {
    const k = S.aktiv();
    if (!k || !IDS.includes(id)) return false;
    const erstes = !k.done[id];
    k.done[id] = (Number(k.done[id]) || 0) + 1;
    if (!k.stempel[id]) k.stempel[id] = Date.now();
    S.speichern();
    return erstes;
  }
  /* Lernzeit gutschreiben (Sekunden) */
  function zeitDazu(id, sek) {
    const k = S.aktiv();
    const s = Math.round(Number(sek));
    if (!k || !IDS.includes(id) || !(s > 0)) return false;
    k.zeit[id] = (Number(k.zeit[id]) || 0) + s;
    return S.speichern();
  }
  /* Selbsteinschätzung: "kann" oder "ueben" */
  function zielSetzen(schluessel, wert) {
    const k = S.aktiv();
    if (!k || !ZIELE.includes(schluessel) || !zielOk(wert)) return false;
    k.ziele[schluessel] = wert;
    return S.speichern();
  }

  /* Für die Ansichten: liest immer den aktuellen Stand (nach einem Abgleich sind die Unterobjekte neu). */
  const LEER = { name: '', done: {}, stempel: {}, zeit: {}, ziele: {} };
  const stand = {
    get name() { return (S.aktiv() || LEER).name; },
    get done() { return (S.aktiv() || LEER).done; },
    get stempel() { return (S.aktiv() || LEER).stempel; },
    get zeit() { return (S.aktiv() || LEER).zeit; },
    get ziele() { return (S.aktiv() || LEER).ziele; },
    get eintraege() { return eintraege(); }
  };

  window.RiffSpeicher = {
    S, cloud, sauber, mische, neuanfang, stand,
    IDS, ZIELE, EINTRAG_ORTE, EINTRAG_MAX,
    istVorschau: S.istVorschau,
    eintraege, eintragSetzen, fertigMachen, zeitDazu, zielSetzen
  };
})();
