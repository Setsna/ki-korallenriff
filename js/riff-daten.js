/* Inhalte der Hauptseite: Module, Stationen und empfohlene Reihenfolge.
   "braucht" nennt die Station,
   die vorher empfohlen wird; zugänglich bleibt alles. */
window.RIFF = {
  erzaehlung: {
    id: 'erz',
    titel: 'Wie Menschen Maschinen das Lernen beibrachten',
    text: 'Ein Trickfilm über die Geschichte der KI. Fang hier an, wenn du magst.',
    dauer: 'ca. 10 Min.',
    lernziel: 'Die Geschichte der KI von Ada Lovelace 1843 bis heute kennenlernen und eigene Forschungsfragen finden.'
  },
  module: [
    {
      id: 'm1', nr: 1, titel: 'Muster erkennen', frage: 'Was ist anders an einer KI?', farbe: 'sonne',
      ziele: [{ t: 'Ich weiß, wann eine Regel reicht und wann ein Computer viele Beispiele braucht.', station: 'a1' }, { t: 'Ich weiß, dass ein Computer Dinge mit Zahlen vergleicht.', station: 'a2' }],
      lernziel: 'Ein normales Programm macht genau, was Menschen ihm sagen. Eine KI lernt aus ganz vielen Beispielen. Für einen Computer sind Dinge Zahlen, und was sich ähnlich ist, liegt nah beieinander.',
      stationen: [
        { id: 'a1', icon: '🐠', titel: 'Regel oder Beispiel?', sub: 'Was ist anders an einer KI?', dauer: 'ca. 10 Min.', braucht: null },
        { id: 'a2', icon: '📏', titel: 'Nah und fern', sub: 'Ähnliches liegt nah beieinander', dauer: 'ca. 10 Min.', braucht: 'a1' }
      ]
    },
    {
      id: 'm2', nr: 2, titel: 'Aus Beispielen lernen', frage: 'Wie lernt ein Computer?', farbe: 'koralle',
      ziele: [{ t: 'Ich weiß, dass ein Computer durch Üben und Fehler besser wird.', station: 'b1' }, { t: 'Ich weiß, dass ein Computer nur kennt, was in seinen Beispielen vorkommt.', station: 'b2' }],
      lernziel: 'Ein Computer lernt, indem er Fehler macht und sich jedes Mal ein kleines bisschen verbessert. Er kennt nur das, was in seinen Beispielen vorkommt.',
      stationen: [
        { id: 'b1', icon: '✏️', titel: 'Die Trennlinie', sub: 'So übt ein Computer', dauer: 'ca. 10 Min.', braucht: 'a2' },
        { id: 'b2', icon: '📦', titel: 'Die zwei Kisten', sub: 'Lernen mit guten Beispielen', dauer: 'ca. 10 Min.', braucht: 'b1' }
      ]
    },
    {
      id: 'm3', nr: 3, titel: 'Wie Chatbots schreiben', frage: 'Wie schreibt ein Chatbot, und warum flunkert er manchmal?', farbe: 'meer',
      ziele: [{ t: 'Ich weiß, dass ein Chatbot das nächste Wort vorhersagt.', station: 'c1' }, { t: 'Ich weiß, dass ein Chatbot Wörter in Stücke zerlegt.', station: 'c2' }, { t: 'Ich weiß, dass ein Chatbot flunkern kann und ich nachprüfen muss.', station: 'c3' }],
      lernziel: 'Ein Chatbot schreibt Wort für Wort und nimmt meistens ein Wort, das oft folgt. Er zerlegt Wörter in Stücke und macht aus jedem Stück eine Nummer. Er kann Sätze bauen, die richtig klingen, aber gar nicht stimmen.',
      stationen: [
        { id: 'c1', icon: '💬', titel: 'Das nächste Wort', sub: 'Wie ein Chatbot schreibt', dauer: 'ca. 10 Min.', braucht: 'a1' },
        { id: 'c2', icon: '🧩', titel: 'Wortstücke', sub: 'Wie ein Computer Wörter liest', dauer: 'ca. 10 Min.', braucht: 'c1' },
        { id: 'c3', icon: '❓', titel: 'Klingt richtig', sub: 'Wenn der Computer flunkert', dauer: 'ca. 10 Min.', braucht: 'c1' }
      ]
    },
    {
      id: 'm4', nr: 4, titel: 'KI im Alltag', frage: 'Wie benutze ich KI klug und sicher?', farbe: 'minze',
      ziele: [{ t: 'Ich kann einer KI genau sagen, was ich möchte.', station: 'd1' }, { t: 'Ich weiß, was privat ist und nicht in den Chat gehört.', station: 'd2' }],
      lernziel: 'Je genauer du der KI sagst, was du willst, desto besser passt die Antwort. Was du in einen Chat schreibst, kommt bei einer Firma an. Privates gehört nicht hinein.',
      stationen: [
        { id: 'd1', icon: '📝', titel: 'Ein guter Auftrag', sub: 'Der KI genau sagen, was du willst', dauer: 'ca. 10 Min.', braucht: 'c1' },
        { id: 'd2', icon: '🤫', titel: 'Was darf in den Chat?', sub: 'Privates bleibt bei dir', dauer: 'ca. 10 Min.', braucht: 'a1' }
      ]
    }
  ],
  regeln: [
    { symbol: 'hand', text: 'Du suchst dir aus, womit du arbeitest.' },
    { symbol: 'auge', text: 'Erst anschauen, wie es geht. Dann selbst ausprobieren.' },
    { symbol: 'lupe', text: 'Das Material zeigt dir, wo etwas nicht passt. Die Kontrollkarte holst du dir selbst.' },
    { symbol: 'wiederholen', text: 'Wiederholen ist super. So oft du magst!' },
    { symbol: 'laecheln', text: 'Hier gibt es keine Punkte und keine Uhr, die drängelt.' },
    { symbol: 'besen', text: 'Du sagst, wann du fertig bist. Dann räumst du auf.' }
  ],
  konzept: [
    ['Vorbereitete Umgebung', 'Riff mit Modul 0 (Die Große Erzählung) und vier Modulen, neun Stationen und je einem Modul-Abschluss'],
    ['Begrenzung', 'Höchstens drei Angebote unter „Heute bereit für dich“; alles bleibt zugänglich'],
    ['Isolation der Schwierigkeit', 'Jede Station übt eine Idee in etwa 10 Minuten'],
    ['Fehlerkontrolle', 'Das Kind holt sich die Kontrollkarte selbst und vergleicht seine Lösung'],
    ['Dreistufenlektion', 'Neue Wörter: Anschauen, Zeigen, Sagen'],
    ['Hilfe zur Selbsthilfe', 'Kora gibt gestufte Tipps statt Lösungen, ganz ohne KI-Dienst'],
    ['Selbsteinschätzung', '„Ich weiß …“-Sätze und eine Übertragungsaufgabe je Modul; Lernzeit nur zur Selbstbeobachtung im Tauchbuch']
  ],

  /* Für Lehrkräfte: Bezug jeder Station zum OECD/EU-Rahmen „Lernende für das KI-Zeitalter befähigen“ (2026).
     Seiten = gedruckte Seitenzahlen der Veröffentlichung. Die Zuordnung ist eine eigene fachliche Einschätzung. */
  lehrkraft: {
    bezug: {
      erz: { kompetenz: 'Haltung „Neugierig“ (S. 24)', wissen: '1.4: Es gibt viele Arten von KI-Systemen (S. 19)', material: 'Kassenrolle (fast 2 m), Lineal, Stifte' },
      a1: { kompetenz: 'Mit KI bewusst umgehen 2: KI ist ein nichtmenschliches Werkzeug, das aus Datenmustern Ergebnisse liefert (S. 28)', wissen: '1.1, 1.2: Algorithmen, Muster, Lernen aus Trainingsdaten (S. 19)', material: 'Papier, Stift' },
      a2: { kompetenz: 'Fähigkeit „Informatisches Denken“: Mustererkennung, Abstraktion (S. 22)', wissen: '1.1: Daten verarbeiten, Muster erkennen (S. 19)', material: 'drei Früchte, Küchenwaage, Lineal, Karopapier' },
      b1: { kompetenz: 'Fähigkeit „Informatisches Denken“ (S. 22)', wissen: '2.4: Training durch Versuch und Irrtum mit Rückmeldung (S. 20)', material: 'große und kleine Knöpfe, ein Faden' },
      b2: { kompetenz: 'Mit KI bewusst umgehen 6: erklären, wie KI Verzerrungen verstärken kann (S. 30)', wissen: '2.4, 2.5: Menschen wählen die Daten aus, KI übernimmt Verzerrungen (S. 20)', material: 'Papier, rote Stifte' },
      c1: { kompetenz: 'Mit KI bewusst umgehen 2 (S. 28)', wissen: '1.3: Generative KI nutzt Wahrscheinlichkeiten, ohne echtes Verständnis (S. 19)', material: 'Bilderbuch, Kärtchen' },
      c2: { kompetenz: 'Fähigkeit „Informatisches Denken“: Zerlegung (S. 22)', wissen: '1.1 (S. 19)', material: 'Papierstreifen, Schere' },
      c3: { kompetenz: 'Mit KI bewusst umgehen 3: bewerten, ob KI-Ergebnisse angenommen, überarbeitet oder abgelehnt werden; grundlegend: verstehen, warum man sie überprüft (S. 29)', wissen: '3.2: Überzeugende Texte, Fakt und Erfindung schwer zu unterscheiden („Halluzinationen“) (S. 20)', material: 'ein Gerät mit Chatbot, nur gemeinsam mit einem Erwachsenen' },
      d1: { kompetenz: 'KI gezielt einsetzen 3: ein Problem aufschlüsseln (S. 39); „Informatisches Denken“: Ziele so beschreiben, dass KI sie verarbeiten kann (S. 22)', wissen: '3.3: Gleiche Eingabe, verschiedene Ausgaben (S. 20)', material: 'Papier, Buntstifte, ein Partnerkind' },
      d2: { kompetenz: 'Fähigkeit „Zusammenarbeit“: wissen, welche Informationen man mit KI teilt und welche nicht (S. 21)', wissen: '2.3: KI-Systeme erfassen Daten aus Interaktionen (S. 20)', material: 'Plakatpapier, Stifte' }
    }
  }
};
