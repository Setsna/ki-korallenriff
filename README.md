# Tauchgang im KI-Korallenriff

Lernseite für Kinder der Klassen 3 und 4 (8 bis 10 Jahre).
Sie erklärt, wie KI funktioniert. Das Korallenriff ist nur die Einkleidung, mit Kora, der Meeresschildkröte, als Begleiterin.
Es gibt keine Punkte und keinen Zeitdruck: Mit jeder fertigen Station wächst eine Koralle im eigenen Riff.

**Adresse:** https://setsna.github.io/ki-korallenriff/

## Was liegt wo?

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst der Seite mit Kopf, Fußzeile und Kora-Hilfe |
| `js/riff.js` | Speicher, Riff, Hauptseite, Tauchbuch, Abschlussseiten, Frag Kora und Film-Player |
| `js/riff-daten.js` | Module und Stationen mit Lernzielen, Reihenfolge und Lern-Konzept |
| `js/riff-inhalte.js` | Texte der Stationen und Modul-Abschlüsse, dazu die Kinderfragen |
| `js/riff-spiele.js` | Die Mini-Spiele der Stationen |
| `js/riff-film.js` | Szenen, Sprechtext, Satzzeiten, Bewegungen und Zeitleiste von Modul 0 |
| `css/riff.css` | Das gesamte Aussehen, auch der Dunkelmodus |
| `bilder/kora.png` | Kora |
| `bilder/film/` | Die zwölf Szenenbilder des Films |
| `audio/` | Die zwölf eingesprochenen Tonspuren des Films |
| `schriften/` | Selbst gehostete Schriften mit ihren Lizenzen |
| `impressum.html` | Impressum |
| `datenschutz.html` | Datenschutzerklärung |

## Module und Stationen

| Modul | Stationen |
|---|---|
| 0 · Die Große Erzählung | Film mit Geschichte der KI, Text zum Nachlesen und Zeitleiste |
| 1 · Muster erkennen | Regel oder Beispiel? · Nah und fern |
| 2 · Aus Beispielen lernen | Die Trennlinie · Die zwei Kisten |
| 3 · Wie Chatbots schreiben | Das nächste Wort · Wortstücke · Klingt richtig |
| 4 · KI im Alltag | Ein guter Auftrag · Was darf in den Chat? |

Jede Station hat sechs Abschnitte: So geht's, Jetzt du!, Kontrolle, Neue Wörter, Am Tisch und Mein Eintrag.
Jedes der Module 1 bis 4 endet mit einer Abschlussseite.
Alle Stationen bleiben anklickbar. Noch nicht empfohlene Stationen zeigen nur „erst: …“ und stehen nicht unter „Heute bereit für dich“.

Die Riff-Beispiele sind Einkleidung. Lernziele und Fachbegriffe bleiben immer bei KI, Meeresbiologie und Umweltschutz sind nicht das Thema.
Die Fischwerte in den Spielen sind vereinfachte Spielwerte und auf der Seite auch so gekennzeichnet.

## Der Film in Modul 0

Der Film ist kein Video, sondern eine Animation auf einem Canvas mit eigener Tonspur je Szene. Die Tonspur steuert die Filmzeit.
Fällt der Ton aus, läuft der Film stumm mit eingeblendetem Text weiter.

Wird eine Aufnahme neu gesprochen, müssen zwei Dinge mitgeändert werden:

1. Die Tonbearbeitung mit ffmpeg wiederholen:
   `highpass=f=80,deesser=i=0.45:m=0.5:f=0.5,equalizer=f=4500:t=q:w=1.4:g=-2.5,highshelf=f=9000:g=-3,loudnorm=I=-18:LRA=9:TP=-1.5`, danach pro Datei `volume` auf -21 LUFS.
2. Die Satzzeiten in `js/riff-film.js` (`AUFNAHME`) neu eintragen.

## Vorschau

`?vorschau=N` zeigt das Riff mit N fertigen Stationen (0 bis 9), zum Beispiel:
https://setsna.github.io/ki-korallenriff/?vorschau=5

In der Vorschau wird nichts gespeichert.

## Wo der Fortschritt liegt

Nur im Browser des Geräts, unter dem Schlüssel `ki-korallenriff-v2` im `localStorage`, je Kind: Vorname, fertige Stationen, Stempel, Lernzeiten, Einträge und Einschätzungen.
Ein alter Stand unter `ki-korallenriff-v1` wird beim ersten Öffnen als erstes Kind übernommen.
Die Kinder arbeiten auf den iPads mit eigenen Accounts, deshalb reicht im Normalfall ein Kind pro Speicher: Es gibt einmal seinen Namen ein und landet danach direkt in seinem Riff.
Sind im selben Browser mehrere Kinder angelegt, fragt die Seite „Wer taucht heute?“ (Wahl gilt für die Sitzung, `sessionStorage`) und zeigt „Kind wechseln“. Einen Passwortschutz zwischen den Kindern gibt es nicht.
Die Seite bittet den Browser per `navigator.storage.persist()`, die Daten nicht von selbst zu löschen. Ob er zustimmt, entscheidet der Browser.
Es gibt keine Anmeldung und keine Datenbank, und die Stände wandern nicht zwischen Geräten.
„Alles löschen / Neu anfangen“ im Tauchbuch löscht nur den Stand des gewählten Kindes.

## Datenschutz

Die Seite setzt keine Cookies und lädt nichts von fremden Servern nach, auch die Schriften liegen hier im Repository.
**Wer ändert, welche Daten gespeichert werden, oder einen neuen Dienst einbindet, muss `datenschutz.html` mitändern.**

## Nach einer Änderung: Versionsnummer hochzählen

Browser merken sich `js` und `css` eine Weile und liefern sonst die alte Fassung aus.
Deshalb hängt hinter jeder lokalen `js`- und `css`-Datei in `index.html`, `impressum.html` und `datenschutz.html` ein `?v=8`.
**Wer etwas an `js` oder `css` ändert, zählt diese Zahl in allen drei Dateien um eins hoch.**
Dann laden die Geräte beim nächsten Öffnen der Seite die neue Fassung.

Bild und Ton haben eine eigene Nummer: Wird eine Szene getauscht, die Zahl in `STAND` am Anfang von `js/riff-film.js` hochzählen.

Direkt nach dem Hochladen kann die Seite selbst noch ein paar Minuten alt sein, weil auch `index.html` kurz zwischengespeichert wird.

## Hochladen

`.gitignore` sperrt zunächst alles und gibt nur die fertige Seite frei.
Arbeitsdateien und Originale bleiben dadurch lokal. Eine neue Datei oder ein neuer Ordner auf oberster Ebene muss dort erst eingetragen werden.

## Technik

Reines HTML, CSS und JavaScript ohne Framework. Gehostet auf GitHub Pages.
Die Szenenbilder und Kora sind mit Canva erstellt. Die Schriften Andika, Baloo 2 und IBM Plex Mono stehen unter der SIL Open Font License, die Lizenztexte liegen in `schriften/`.

Alle drei Seiten tragen `<meta name="robots" content="noindex, nofollow">`. Die Seite ist öffentlich erreichbar, soll aber nicht über Suchmaschinen gefunden werden.
