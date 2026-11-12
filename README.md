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
| `js/riff-urkunde.js` | Urkunde und Tauchbuch-Blatt: zeichnet beide Seiten und baut daraus ein PDF, ohne Bibliothek |
| `css/riff.css` | Das gesamte Aussehen (immer dunkel) |
| `bilder/kora.png` | Kora |
| `manifest.webmanifest`, `bilder/app-*.png` | Für „Zum Home-Bildschirm“: Name, Farben und App-Symbol (Kora) |
| `bilder/urkunde.jpg` | Hintergrund von Urkunde und Tauchbuch-Blatt (Canva) |
| `bilder/film/` | Die zwölf Szenenbilder des Films |
| `audio/` | Die zwölf Tonspuren des Films (Stimme: ElevenLabs, bearbeitet mit `Dateien/Werkzeuge/ton_bearbeiten.py`) |
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

Die Stimme ist mit KI erzeugt (ElevenLabs, Modell Eleven v3, eine Stimme für alle Szenen).
Die Untertitel kommen aus den Sätzen in `js/riff-film.js`, nicht aus der Aufnahme. Der gesprochene Text muss deshalb wortgleich bleiben.

So wird eine Szene neu vertont:

1. Den Text aus der Kopiervorlage (mit Audio-Tags) in ElevenLabs erzeugen und als `szene-NN.mp3` speichern.
2. Die MP3 nach `Dateien/Audio-Originale/ElevenLabs/` legen.
3. `py Dateien/Werkzeuge/ton_bearbeiten.py NN` ausführen. Das Skript schneidet die Stille ab, bearbeitet den Klang
   (`highpass=f=80,deesser=i=0.45:m=0.5:f=0.5,equalizer=f=4500:t=q:w=1.4:g=-2.5,highshelf=f=9000:g=-3,loudnorm=I=-18:LRA=9:TP=-1.5`, danach `volume` auf -21 LUFS),
   schreibt `audio/szene-NN.m4a` und misst die Satzzeiten.
4. Die ausgegebenen Zeiten in `js/riff-film.js` bei `AUFNAHME` einsetzen und `STAND` der Szene hochzählen.

Alle Bewegungen im Film hängen an den Satzanfängen und passen sich deshalb von selbst an.

**Achtung:** Die Kopiervorlage (`Ausgaben/ElevenLabs Sprechtexte Film.md`), die MP3s und das Skript liegen nur lokal, weil `.gitignore` sie sperrt. Auf GitHub sind sie nicht zu finden.

## Vorschau

`?vorschau=N` zeigt das Riff mit N fertigen Stationen (0 bis 9), zum Beispiel:
https://setsna.github.io/ki-korallenriff/?vorschau=5

In der Vorschau wird nichts gespeichert.

## Gestaltung

Feste Bildschirmgrößen, nach denen sich die Seite richtet:

| Breite | Gerät |
|---|---|
| unter 640 px | Handy |
| 640–999 px | iPad hoch |
| 1000–1599 px | iPad quer, Laptop |
| ab 1600 px | Tafel (Schrift wird größer) |

Die Seite ist immer dunkel, auch wenn das Gerät auf hell eingestellt ist. Neue Elemente in allen vier Größen prüfen.
Alles, was man antippt, ist mindestens 44 px hoch. Text hat mindestens 4,5:1 Kontrast.

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
Deshalb hängt hinter jeder lokalen `js`- und `css`-Datei in `index.html`, `impressum.html` und `datenschutz.html` ein `?v=30`.
**Wer etwas an `js` oder `css` ändert, zählt diese Zahl in allen drei Dateien um eins hoch.**
Dann laden die Geräte beim nächsten Öffnen der Seite die neue Fassung.

Bild und Ton haben eine eigene Nummer: Wird eine Szene getauscht, die Zahl in `STAND` am Anfang von `js/riff-film.js` hochzählen.

Direkt nach dem Hochladen kann die Seite selbst noch ein paar Minuten alt sein, weil auch `index.html` kurz zwischengespeichert wird.

## Hochladen

`.gitignore` sperrt zunächst alles und gibt nur die fertige Seite frei.
Arbeitsdateien und Originale bleiben dadurch lokal. Eine neue Datei oder ein neuer Ordner auf oberster Ebene muss dort erst eingetragen werden.

## Technik

Reines HTML, CSS und JavaScript ohne Framework. Gehostet auf GitHub Pages.
Die Szenenbilder und Kora sind mit Canva erstellt. Die Stimme im Film ist mit KI erzeugt (elevenlabs.io). Die Schriften Andika, Baloo 2 und IBM Plex Mono stehen unter der SIL Open Font License, die Lizenztexte liegen in `schriften/`.

Alle drei Seiten tragen `<meta name="robots" content="noindex, nofollow">`. Die Seite ist öffentlich erreichbar, soll aber nicht über Suchmaschinen gefunden werden.
