# Jacando

## todo

- ich speichere in meiner db nur noch einzelne jacando ids zu den ma und aushilfen, die daten kommen dann bei jedem request aus jacando

  - dafür jacando middleware

  - was ist mit ma, die nicht in jacando sind? zb agenturen und p24. die dann trotzdem normal in onboarding?

- kann ich einen nextjs server haben, der direkt auch meinen node express server im repo hat? im frontend alles zusammen (za, onboarding & rollen)

  - dann auch ma anlegen, verwalten, löschen etc mit meinem tool

  - das hätte dann den vorteil, dass wir jedes risiko los sind. mitarbeiterdaten nur bei jacando, ohne jacando kann man gehälter etc nicht zuweisen

- sollte man stundenlöhne, zugänge etc auch in jacando speichern? dann kann man das komplett als datenbank mit allen persönlichen Daten benutzen. Das ist allerdings viel pflegeaufwand

---

## onboarding:

- name durch jacando einträge
- wenn hit: direkt jacando id eintragen
- wenn nicht gefunden: mögliche hits anzeigen
- bei jedem gegenüberstellen

---

## rollen:

ich kann einfach in der jacando db alle ma abfragen und anbieten, zumindest alle nicht-aushilfen? jeder nur seine station / region? aushilfen und nicht-aushilfen müsste ich an der pn unterscheiden können
