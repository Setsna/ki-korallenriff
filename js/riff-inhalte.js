/* Inhalte der Stationen: KI-Lernziele mit Beispielen aus dem Riff.
   Stationen ohne Eintrag hier zeigen noch die Platzhalter-Seite. */
window.RIFF.inhalte = {
  a1: {
    du_uebst: 'Ein normales Programm macht genau, was Menschen ihm sagen. Eine KI lernt aus ganz vielen Beispielen.',
    schritte: [
      'Ein Taschenrechner rechnet 2 + 3. Ein Mensch hat ihm die Regel dafür gegeben.',
      'Kannst du eine Regel aufschreiben, mit der man jeden Fisch erkennt? Große, kleine, gestreifte Fische …',
      'Das ist sehr schwer! Darum zeigt man einer KI ganz viele Fischfotos. Sie findet selbst heraus, was Fische gemeinsam haben.',
      'Jetzt bist du dran: Sortiere die Karten.'
    ],
    spiel: {
      art: 'sortieren',
      hinweis: 'Frag dich bei jeder Karte: Gibt es dafür eine einfache Regel?',
      gruppen: [['regel', 'Eine Regel reicht'], ['bsp', 'Viele Beispiele nötig']],
      karten: [
        { t: '2 + 3 Muscheln zusammenzählen', gruppe: 'regel', warum: 'Plus rechnen geht immer gleich.' },
        { t: 'Auf einem Foto einen Clownfisch finden', gruppe: 'bsp', warum: 'Auf jedem Foto sieht er etwas anders aus. Dafür braucht man viele Beispiele.' },
        { t: 'Fischnamen nach dem ABC ordnen', gruppe: 'regel', warum: 'Das ABC hat eine feste Reihenfolge.' },
        { t: 'Die Handschrift in deinem Tauchbuch lesen', gruppe: 'bsp', warum: 'Jeder schreibt anders. Die KI lernt aus vielen Schriftproben.' },
        { t: 'Den Tauch-Wecker nach 30 Minuten klingeln lassen', gruppe: 'regel', warum: 'Wenn 30 Minuten um sind: klingeln. Fertig!' },
        { t: 'Verstehen, was du ins Mikrofon sagst', gruppe: 'bsp', warum: 'Jede Stimme klingt anders. Dafür braucht es viele Beispiele.' },
        { t: 'Am Gesang erkennen, welcher Wal gerade singt', gruppe: 'bsp', warum: 'Dafür gibt es keine einfache Regel. Die KI hört viele Aufnahmen.' },
        { t: 'Bis 100 zählen', gruppe: 'regel', warum: 'Immer eins dazu. Eine ganz einfache Regel.' }
      ]
    },
    woerter: [
      { t: 'Regel', d: 'Eine feste Anweisung. Sie wird immer gleich ausgeführt.' },
      { t: 'Beispiele', d: 'Viele Bilder, Texte oder Töne, aus denen eine KI lernt.' },
      { t: 'KI', d: 'Ein Computer, der aus Beispielen lernt.' }
    ],
    tisch: 'Schreib eine Regel auf, mit der man jeden Fisch erkennt. Zeig sie jemandem. Findet die Person ein Tier, das zu deiner Regel passt, aber kein Fisch ist?',
    hilfe: {
      tipps: [
        'Lies die Karte laut. Stell dir vor, du müsstest es einem Roboter in einem Satz erklären.',
        'Wenn es immer gleich geht, egal was passiert, reicht eine Regel. Zum Beispiel beim Rechnen.',
        'Wenn es jedes Mal ein bisschen anders aussieht oder klingt, wie Gesichter, Stimmen oder Handschrift, braucht der Computer viele Beispiele.'
      ],
      erklaerung: 'Stell dir vor, du bringst deinem kleinen Bruder bei, Fische zu erkennen. Du kannst nicht jede Regel aufschreiben. Also zeigst du ihm ganz viele Fische. Genau so lernt eine KI.'
    }
  },
  a2: {
    du_uebst: 'Für einen Computer sind Dinge Zahlen. Was sich ähnlich ist, liegt nah beieinander.',
    schritte: [
      'Ein Computer sieht keine Fische. Er sieht Zahlen: wie lang sie sind und wie hoch.',
      'Jeder Fisch wird ein Punkt auf dem Brett. Lange Fische liegen rechts, hohe Fische oben.',
      'Bei einem neuen Fisch schaut der Computer auf seine drei nächsten Nachbarn. Was die meisten sind, das sagt er.',
      'Rate zuerst selbst. Dann leg den Fisch aufs Brett.'
    ],
    spiel: { art: 'brett' },
    woerter: [
      { t: 'Merkmal', d: 'Etwas, das man messen kann. Zum Beispiel: wie lang oder wie hoch.' },
      { t: 'Nachbar', d: 'Ein Punkt, der ganz nah liegt.' },
      { t: 'Sortieren', d: 'Etwas in die passende Gruppe legen.' }
    ],
    tisch: 'Wiege und miss drei Früchte aus der Küche. Mal für jede einen Punkt auf Karopapier. Welche liegen nah beieinander?',
    hilfe: {
      tipps: [
        'Schau, wo dein Fisch auf dem Brett liegen würde: Wie lang ist er? Wie hoch?',
        'Lang heißt weiter rechts. Hoch heißt weiter oben. Such die Stelle mit dem Finger.',
        'Welche Fische liegen ganz nah an dieser Stelle? So entscheidet auch der Computer.'
      ],
      erklaerung: 'Stell dir einen Pausenhof vor. Wer nah beieinander steht, gehört oft zu einer Gruppe. Der Computer macht das mit Fischen: Wer nah liegt, ist sich ähnlich.'
    }
  },
  b1: {
    du_uebst: 'Ein Computer lernt, indem er Fehler macht und sich jedes Mal ein kleines bisschen verbessert.',
    schritte: [
      'Auf dem Brett liegen Falterfische und Trompetenfische. Eine Linie soll sie trennen: oben Falterfische, unten Trompetenfische.',
      'Schieb die Linie mit den Reglern. Ein Kreis zeigt dir, welcher Fisch auf der falschen Seite liegt.',
      'Dann schau zu, wie der Computer übt. Er beginnt falsch und rückt nach jedem Fehler ein Stückchen weiter.'
    ],
    spiel: { art: 'trennlinie' },
    woerter: [
      { t: 'Modell', d: 'Das, was der Computer gelernt hat. Hier: wo die Linie liegt.' },
      { t: 'Training', d: 'Immer wieder üben und dabei besser werden.' },
      { t: 'Fehler', d: 'Etwas liegt auf der falschen Seite. Daraus lernt der Computer.' }
    ],
    tisch: 'Leg große und kleine Knöpfe gemischt auf den Tisch. Trenne sie mit einem Faden. Schieb den Faden, bis alles stimmt.',
    hilfe: {
      tipps: [
        'Wo liegen die Falterfische, wo die Trompetenfische? Oben oder unten?',
        'Schieb beide Regler so, dass die Linie zwischen den beiden Gruppen liegt.',
        'Schau auf die Kreise. Jeder Kreis zeigt einen Fisch auf der falschen Seite. Schieb die Linie ein bisschen in seine Richtung.'
      ],
      erklaerung: 'Wie beim Fahrradfahren-Lernen: Du wackelst, fällst fast um und machst es beim nächsten Mal ein bisschen besser. Der Computer übt genauso, Schritt für Schritt.'
    }
  },
  b2: {
    du_uebst: 'Ein Computer kennt nur das, was in seinen Beispielen vorkommt.',
    schritte: [
      'Der Computer lernt aus einer Kiste mit Fischbildern.',
      'Wähle eine Kiste und lass den Computer üben.',
      'Zeig ihm neue Fische. Rate vorher: Was wird er sagen?',
      'Probier danach die andere Kiste.'
    ],
    spiel: { art: 'kisten' },
    woerter: [
      { t: 'Trainingsdaten', d: 'Die Beispiele, aus denen der Computer lernt.' },
      { t: 'Testen', d: 'Mit neuen Dingen prüfen, was der Computer kann.' },
      { t: 'Einseitig', d: 'In den Beispielen kommt immer nur das Gleiche vor.' }
    ],
    tisch: 'Mal fünf Fische, aber alle nur rot. Zeig sie jemandem und frag: Welche Farbe haben Fische? Was fehlt in deinen Bildern?',
    hilfe: {
      tipps: [
        'Schau dir die Fische in der Kiste genau an. Welche Farben gibt es?',
        'Der Computer achtet nur auf das, was in seiner Kiste wichtig war. War das die Farbe oder die Form?',
        'Hat er diese Farbe schon einmal gesehen? Wenn nicht, wie soll er sie dann kennen?'
      ],
      erklaerung: 'Wenn du nur orange Falterfische kennst, wunderst du dich vielleicht über einen gelben. Dem Computer geht es genauso. Er kennt nur, was er geübt hat.'
    }
  },
  c1: {
    du_uebst: 'Ein Chatbot schreibt Wort für Wort. Er nimmt meistens ein Wort, das oft folgt.',
    schritte: [
      'Ein Chatbot hat ganz viele Texte gelesen. Er hat gezählt, welches Wort oft nach welchem kommt.',
      'Unser kleines Programm kennt nur zehn Sätze.',
      'Wähle ein erstes Wort. Dann such das nächste aus oder lass würfeln. Ein langer Balken heißt: kommt oft vor.'
    ],
    spiel: { art: 'naechstesWort' },
    woerter: [
      { t: 'Chatbot', d: 'Ein Programm, das sich wie im Gespräch Wort für Wort eine Antwort ausdenkt.' },
      { t: 'Wahrscheinlich', d: 'Kommt oft vor. Darum wird es oft gewählt.' },
      { t: 'Zufall', d: 'Niemand bestimmt es vorher, wie beim Würfeln.' }
    ],
    tisch: 'Nimm ein Bilderbuch. Schreib alle Wörter auf Kärtchen, die nach „und“ kommen. Zieh blind eins. Mach so mit dem nächsten Wort weiter. Was für ein Satz kommt heraus?',
    hilfe: {
      tipps: [
        'Fang mit „Der“, „Die“ oder „Das“ an.',
        'Schau auf die Balken. Ein langer Balken bedeutet: Dieses Wort kommt im Text oft danach.',
        'Lies die zehn Sätze unten. Findest du dein Wortpaar dort?'
      ],
      erklaerung: 'Wenn jemand sagt: „Es war einmal …“, weißt du schon, wie es oft weitergeht. Ein Chatbot rät das nächste Wort genauso, nur mit ganz viel Übung.'
    }
  },
  c2: {
    du_uebst: 'Ein Chatbot zerlegt Wörter in Stücke und macht aus jedem Stück eine Nummer.',
    schritte: [
      'Ein Chatbot liest nicht Buchstabe für Buchstabe. Er zerlegt Wörter in Stücke.',
      'Kurze, häufige Wörter sind ein Stück. Lange oder seltene Wörter werden zerschnitten.',
      'Jedes Stück hat eine Nummer. Für den Computer ist dein Satz eine Reihe von Zahlen.',
      'Schreib unten etwas hinein!'
    ],
    spiel: { art: 'wortstuecke' },
    woerter: [
      { t: 'Token', d: 'Ein kleines Wortstück, mit dem der Computer rechnet.' },
      { t: 'Nummer', d: 'Jedes Wortstück hat seine eigene Zahl.' },
      { t: 'Zerlegen', d: 'In kleine Teile schneiden.' }
    ],
    tisch: 'Schreib einen Satz auf einen Papierstreifen. Schneide ihn in Silben. Wie viele Stücke hast du?',
    hilfe: {
      tipps: [
        'Tipp ein kurzes Wort ein, zum Beispiel „Fisch“. Wie viele Stücke siehst du?',
        'Jetzt ein langes Wort, zum Beispiel „Seepferdchen“. Was passiert?',
        'Probier deinen Vornamen. Kennt das Wörterbuch ihn, oder wird er in Buchstaben zerlegt?'
      ],
      erklaerung: 'Stell dir vor, du baust Wörter aus Bausteinen. Häufige Wörter sind ein großer Stein. Seltene Wörter baust du aus vielen kleinen Steinen.'
    }
  },
  c3: {
    du_uebst: 'Ein Chatbot kann Sätze bauen, die richtig klingen, aber gar nicht stimmen.',
    schritte: [
      'Das kleine Programm aus „Das nächste Wort“ hat Sätze geschrieben.',
      'Was meinst du: Steht der Satz so im Text, oder hat das Programm ihn erfunden?',
      'Schau dann im Text nach. Woher kommt jedes Wortpaar?'
    ],
    spiel: { art: 'klingtRichtig' },
    woerter: [
      { t: 'Flunkern', d: 'Etwas erfinden und es ganz sicher sagen. Bei KI heißt das „Halluzination“.' },
      { t: 'Nachprüfen', d: 'In einem Buch oder bei einem Menschen schauen, ob es stimmt.' },
      { t: 'Klingt richtig', d: 'Hört sich gut an. Ob es stimmt, weiß man damit noch nicht.' }
    ],
    tisch: 'Frag mit einem Erwachsenen einen Chatbot nach einem Buch, das es gar nicht gibt. Erzählt er dir trotzdem etwas darüber?',
    hilfe: {
      tipps: [
        'Lies den Satz und frag dich: Habe ich genau diesen Satz in den zehn Sätzen gelesen?',
        'Tipp auf „Im Text nachschauen“. Steht der ganze Satz da?',
        'Schau dir die Wortpaare an. Kommen sie alle aus demselben Satz oder aus verschiedenen?'
      ],
      erklaerung: 'Stell dir vor, du schneidest Wörter aus verschiedenen Zeitungen aus und klebst sie zusammen. Jedes Wort ist echt, aber der neue Satz kann Quatsch sein. So flunkert ein Chatbot.'
    }
  },
  d1: {
    du_uebst: 'Je genauer du der KI sagst, was du willst, desto besser passt die Antwort.',
    schritte: [
      'Eine KI weiß nur, was du ihr sagst. Alles andere muss sie raten.',
      'Der Auftrag heißt: Erzähl mir eine Geschichte.',
      'Tippe auf die Bausteine. Schau, wie sich die Geschichte verändert.'
    ],
    spiel: { art: 'auftrag' },
    woerter: [
      { t: 'Prompt', d: 'Der Auftrag, den du einer KI schreibst.' },
      { t: 'Genau', d: 'Mit allem, was man wissen muss.' },
      { t: 'Raten', d: 'Etwas vermuten, weil man es nicht weiß.' }
    ],
    tisch: 'Sag zu jemandem nur: „Mal mir ein Meerestier.“ Was kommt heraus? Dann sag genau, welches Tier, welche Farbe und wo es ist.',
    hilfe: {
      tipps: [
        'Lies die Geschichte ohne Bausteine. Fehlt dir etwas?',
        'Tipp den Baustein „Wer?“ an. Was ändert sich?',
        'Probier alle Bausteine und prüf die Geschichte mit den Kästchen unten.'
      ],
      erklaerung: 'Wenn du sagst: „Bring mir was zu trinken“, bekommst du vielleicht Milch statt Saft. Wenn du genau sagst, was du willst, klappt es besser. Bei einer KI ist das genauso.'
    }
  },
  d2: {
    du_uebst: 'Was du in einen Chat schreibst, kommt bei einer Firma an. Privates gehört nicht hinein.',
    schritte: [
      'Wenn du einer KI etwas schreibst, kommt es bei einer Firma an.',
      'Manches ist ganz harmlos. Anderes ist privat und bleibt bei dir.',
      'Sortiere die Karten.'
    ],
    spiel: {
      art: 'sortieren',
      hinweis: 'Frag dich: Kann jemand damit herausfinden, wer ich bin oder wo ich wohne?',
      gruppen: [['ok', 'Darf rein'], ['nein', 'Bleibt bei mir']],
      karten: [
        { t: 'Eine Frage über Meeresschildkröten', gruppe: 'ok', warum: 'Da steht nichts über dich drin.' },
        { t: 'Deine Adresse', gruppe: 'nein', warum: 'Damit weiß jemand, wo du wohnst.' },
        { t: 'Ein Witz, den du dir ausgedacht hast', gruppe: 'ok', warum: 'Ein Witz verrät nichts Privates.' },
        { t: 'Ein Foto von dir', gruppe: 'nein', warum: 'Dein Gesicht gehört dir.' },
        { t: 'Dein Passwort', gruppe: 'nein', warum: 'Ein Passwort verrätst du niemandem. Nie.' },
        { t: 'Wie viele Arme hat ein Seestern?', gruppe: 'ok', warum: 'Eine Wissensfrage. Die darf rein.' },
        { t: 'Der Name deiner Schule', gruppe: 'nein', warum: 'Damit kann man herausfinden, wo du jeden Tag bist.' },
        { t: 'Deine Telefonnummer', gruppe: 'nein', warum: 'Damit kann dich jeder anrufen.' }
      ],
      notiz: 'Ganz wichtig: Frag immer einen Erwachsenen, bevor du einen Chat mit einer KI benutzt.'
    },
    woerter: [
      { t: 'Privat', d: 'Etwas, das nur dich und deine Familie etwas angeht.' },
      { t: 'Passwort', d: 'Ein geheimes Wort. Das verrätst du niemandem.' },
      { t: 'Datenschutz', d: 'Regeln, die deine privaten Sachen schützen.' }
    ],
    tisch: 'Mal ein Plakat mit zwei Seiten: „Darf in den Chat“ und „Bleibt bei mir“. Was fällt dir noch ein?',
    hilfe: {
      tipps: [
        'Frag dich: Steht auf der Karte etwas über mich?',
        'Kann jemand damit herausfinden, wer ich bin, wo ich wohne oder wo ich zur Schule gehe?',
        'Wenn ja, bleibt es bei dir. Wenn nein, darf es in den Chat.'
      ],
      erklaerung: 'Einem fremden Menschen auf der Straße verrätst du auch nicht deine Adresse. Ein Chat mit einer KI ist ein bisschen wie ein Fremder.'
    }
  }
};

/* Modul-Abschluss: „Denk weiter“ */
window.RIFF.abschluss = {
  m1: {
    frage: 'Ein Tablet erkennt auf Fotos, wer darauf zu sehen ist. Braucht es dafür eine Regel oder viele Beispiele?',
    kontrolle: 'Viele Beispiele! Jedes Gesicht ist anders. Das Tablet misst Dinge wie den Abstand der Augen. Ähnliche Gesichter liegen dann nah beieinander, wie die Fische auf dem Brett.'
  },
  m2: {
    frage: 'Ein Roboter soll Fische erkennen. Er hat nur Fotos von orangen Fischen gesehen. Was passiert, wenn ein blauer Fisch kommt?',
    kontrolle: 'Vielleicht erkennt er den blauen Fisch nicht. Er hat nur mit orangen Fischen geübt. Darum braucht ein Computer viele verschiedene Beispiele.'
  },
  m3: {
    frage: 'Ein Chatbot sagt: „Ada Lovelace hatte einen Hund namens Bello.“ Stimmt das? Was machst du?',
    kontrolle: 'Das klingt richtig, kann aber erfunden sein. Schau in einem Buch nach oder frag einen Erwachsenen. Glaub einem Chatbot nicht alles.'
  },
  m4: {
    frage: 'Schreib einen Auftrag an eine KI: Sie soll dir ein Rätsel über dein Lieblingsmeerestier ausdenken. Verrate dabei nichts Privates!',
    kontrolle: 'Prüf deinen Auftrag: Steht drin, welches Tier? Wie schwer das Rätsel sein soll? Wie lang? Und steht nirgends dein Name, deine Adresse oder deine Schule? Dann ist er gut.'
  }
};
window.RIFF.abschlussHilfe = {
  tipps: [
    'Lies die Frage noch einmal ganz langsam.',
    'Denk an die Stationen in diesem Modul. Welche passt zu der Frage?',
    'Schreib deine Antwort auf. Dann hol dir die Kontrollkarte und vergleiche.'
  ],
  erklaerung: 'Hier schaust du zurück. Es gibt keine Note. Du überlegst nur, was du schon weißt und was du noch einmal üben möchtest.'
};

window.RIFF.erzaehlungInhalt = {
  fragen: ['Wer war Ada Lovelace?', 'Was ist der Unterschied zwischen einem Roboter und einer KI?', 'Warum hat Joseph Weizenbaum vor Computern gewarnt?', 'Aus welchen Texten hat eine KI gelernt?'],
  tisch: 'Bau eine Zeitleiste aus einer Kassenrolle: 1 Zentimeter für jedes Jahr ab 1843. Sie wird fast zwei Meter lang! Mal die Ereignisse aus dem Film dazu. Schau, wie eng es am Ende wird.',
  hilfe: {
    tipps: [
      'Schau den Film an. Welches Jahr hat dir am besten gefallen?',
      'Such dir unten eine Frage bei „Was möchtest du herausfinden?“ aus.',
      'Frag einen Erwachsenen oder schau in einem Buch nach. Schreib in dein Heft, was du herausgefunden hast.'
    ],
    erklaerung: 'Der Film erzählt, wie Menschen fast 200 Jahre lang versucht haben, Maschinen das Lernen beizubringen. Erst ganz am Ende hat es richtig gut geklappt.'
  }
};

window.RIFF.kinderfragen = [
  ['Kann KI denken?', 'Nicht so wie du. Eine KI rechnet aus, welche Antwort wahrscheinlich passt. Sie weiß nicht wirklich, was sie sagt.'],
  ['Hat KI Gefühle?', 'Nein. Eine KI kann so schreiben, als wäre sie fröhlich oder traurig. Fühlen kann sie aber nichts.'],
  ['Bist du eine KI, Kora?', 'Nein! Ich bin eine Figur aus dem Korallenriff. Meine Tipps hat ein Mensch vorher für dich aufgeschrieben.'],
  ['Woher weiß eine KI so viel?', 'Sie hat ganz viele Texte von Menschen gelesen. Daraus hat sie gelernt, wie Sätze oft weitergehen.'],
  ['Kann KI Fehler machen?', 'Ja! Sie kann flunkern. Darum: immer nachprüfen. In der Station „Klingt richtig“ siehst du, wie das passiert.'],
  ['Ist KI gefährlich?', 'KI ist ein Werkzeug, wie eine Schere. Man muss lernen, gut damit umzugehen. Darum bist du ja hier!']
];
