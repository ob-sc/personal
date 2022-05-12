# Allgemein

Neues Konzept, es gibt als Kern Stationen, Mitarbeiter (Benutzer) und Aushilfen zu verwalten.

Home ist eine Seite, die je nach Bedarf eingerichtet wird. Disponenten (und SL / IDL) können dort Zeiten der Aushilfen eintragen.
TODO SL bekommen dort die Auswertung der Station? (Monatsabrechnung etc)

## Stationen

Stationen werden angelegt, bearbeitet oder gelöscht.

TODO Am besten nur von Perso / EDV verwalten, ggf Steffi?

## Benutzer

Benutzer werden angelegt (von Perso) und bekommen Accounts (von EDV) (onboarding), werden abgemeldet (offboarding), wechseln eine Station / Position. Es werden für die Mitarbeiter auch Wochenendschichten eingetragen.

Das Active Directory wird ausgelesen, in der Datenbank bestehende Benutzer werden ggf aktualisiert, neue Benutzer werden ohne Berechtigungen angelegt. Die Datenbank funktioniert als Cache, aber auch als Erweiterung vom AD. In der DB von Perso / EDV angepasst werden nur die Berechtigung, Region und freigegebene Stationen.

## Aushilfen

Aushilfen werden angelegt, bearbeitet oder gelöscht und bekommen Zeiten eingetragen. Ihre Gehälter werden ausgewertet.
