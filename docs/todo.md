# monorepo

eslint ts einstellungen, dann aus eslintrc den unfug raus

## stack

mein server erstellt das frontend beim request dynamisch

- nextjs
  - ui lib? material 5?
- (express api)
- mysql
  - sequelize
- nginx
- docker
- ubuntu server

## dir

src wird aufgeteilt:

- util/ <- der ist jetzt für beide
- pages/
  - api/ <- was ist mit dem? wo kommt meine api (hier in back) eigentlich hin?
  - ...
- front/
  - styles/
  - components/
  - hooks/
  - ...
- back/
  - middlerware/
  - routes/
  - app.ts
  - config.ts
  - index.ts
- im projekt-root ist dann ssl/, upload/, backup/
- sicherung dann nur den docker bind mount backup ordner

ansonsten ist root:

- types/ (aus za-types)
- eslint, prettier config
  - aus den jeweiligen "globalen" repos
    - dann auch npm packages weg wenn ich die repos geschlossen habe
- public/
  - starcar S als logo, verschiedene auflösungen
  - dann kram aus onboarding
- upload/
- ssl/
  - cert und key aus za-express
- (db/)
- env
  - für api und next oder beides zusammen
  - kommt aus next (siehe unten env)

## plan

- ein nextjs repo mit express backend
  - statt eine api anzusprechen ist mein frontend mein backend (grob gesagt)
- spart mir die ganze arkwarde namensgeberei
  - nicht mehr zeiterfassung und onboarding etc
  - auf der Seite dann einfach aufteilen:
    - einen part mit aushilfen: eintragen etc
    - anderer part für sl / gbl:
      - mitarbeiter neu (onboarding)
      - wochenende
      - accounts in station
      - passwörter
      - etc
- es ist ein personal-tool
  - direkt anbindung zu jacando, da kommen alle persönlichen Daten her
    - persönliche Daten können bei uns nicht verloren gehen, außer agentur und extern
    - evtl kann man sogar benutzer an jacando anbinden, damit sie sich selber dokumente runterladen, urlaub eintragen etc können
- damit gibt es nurnoch ein docker compose mit:
  - app
  - mysql
  - nginx
    - kriegt dann nur noch den build

## env

https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables

## api

- controller nurnoch getTempworker() für GET /api/tempworker, deleteWorkshif() für DELETE /api/workshifts etc

## types

- db wildcard als result ist eig unfug
  - db wildcard allgemein rausnehmen und dann result unknown?
- einzelne dateien überdenken
  - evtl anders strukturieren
  - vor allem mit monorepo im hinterkopf
- achtung: types aus za-express müssten neuer sein

## wichtig

- schaff ich active directory zugriff?

- eigene mysql db in docker container aufbauen, daten aus prod und dev importieren und dann erst rumbasteln
- test und za_dev können dann weg. es wird ab dann nurnoch die db aus docker container genutzt?

- auch direkt sequelize? neue db mit docker aufbauen, sequelize direkt von anfang, dann in mysql die anderen db importieren und mit insert gemischt mit selects den kram da reinhauen

  - bei ah einfach die personalnummer aus jacando aus query mit allen ma und die id daraus einfügen

- alles wird umbenannt, jede spalte in db, jede tabelle, jede route. alles englisch

dann zum darstellen im frontend:

- aus backend mysql db mit sequelize die daten holen (zb aus zeiten)
- mit der jacando id aus mysql in jacando den ma abfragen
- daten mit daten aus db ergänzen
- als json an frontend

---

## und jetzt?

- docker compose: mysql und node app

- sequelize auf neuer mysql db

- datenmodell und struktur in neuer db

- alte daten in neue struktur importieren

- api onboarding und benutzer etc ändern
  - starcar_dev kann dann schon live mit docker
  - starcar_prod lasse ich einfach noch auf sc-39
  - andere datenbanken (\_test, \_za_dev etc) können weg

---

es geht nicht, dass die infra komplett von bfi diktiert wurde. docker komplett front- & backend und dann die db (und /upload) komplett täglich (bei crent?) sichern.

dort sind dann nur noch sichere daten, personenbezogen nur agentur und extern (wann löschen?)

## ldap

dazu auch (unter add): http://ldapjs.org/client.html

```
// user and pass are for existing user with rights to add a user
function myLDAPBind(user, pass, callback) {
const client = ldap.createClient({
url: URL,
});
const newDN = 'cn=new guy,ou=Users,dc=example,dc=org';
const newUser = {
cn: 'new guy',
sn: 'guy',
uid: 'nguy',
mail: 'nguy@example.org',
objectClass: 'inetOrgPerson',
userPassword: ssha.create('Password01'),
};
client.bind(user, pass, (err) => {
if (err) throw err;
client.add(newDN, newUser, callback);
});
}
```

## n

- DB braucht dringend Update. Statt migrieren einfach neue DB hochziehen und mit Daten aus alter füllen. Macht Sinn im Kontext mit Jacando / LDAP.

### console

```js
if (isDev()) {
  // eslint-disable-next-line no-console
  console.log(
    `%cDEV  `,
    'font-size: 64px; font-weight: 600; font-family: sans-serif; color: #ffb300;text-shadow: 1px 1px #000, 2px 2px #100, 3px 3px #200, 4px 4px #300, 5px 5px #400, 6px 6px #500, 7px 7px #600, 8px 8px #700, 9px 9px #800, 10px 10px #900, 11px 11px #a00, 12px 12px #b00, 13px 13px #c00, 14px 14px #d00, 15px 15px #e00, 16px 16px #f00'
  );
} else {
  // eslint-disable-next-line no-console
  console.log(
    '%c STARCAR',
    'font-size: 64px; font-weight: 600; font-family: sans-serif; color: #feed01; text-shadow: 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, -1px -1px #000, -2px -2px #000, -3px -3px #000, -4px -4px #000, -5px -5px #000, -6px -6px #000, -7px -7px #000, -8px -8px #000'
  );
}
```
