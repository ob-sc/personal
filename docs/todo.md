# personal

## todo

- eslint geht nicht in src

- mobil layout

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

## icons

ah:

- eintragen etc uhr? zeiten uhr? iwo uhr

## eh

seite persönliche Daten / Einstellungen oder so:

- man kann daten aus session sehen & direkt in jacando ändern?

### console

```js
if (isDev) {
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
