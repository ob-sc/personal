# API

Die API ist same-origin ohne CORS, siehe [Dokumentation](https://nextjs.org/docs/api-routes/introduction#caveats).

## Session

| Methode | Endpunkt      |
| ------- | ------------- |
| POST    | /api/sessions |
| DELETE  | /api/sessions |

```json
{
  "username": "peter.lustig",
  "password": "taraxacum"
}
```

## Active Directory

| Methode | Endpunkt      |
| ------- | ------------- |
| GET     | /api/ad_users |

```json
{
  ""
}
```

## Stationen

| Methode | Endpunkt          |
| ------- | ----------------- |
| POST    | /api/stations     |
| GET     | /api/stations     |
| GET     | /api/stations/:id |

```json
{
  "id": 12,
  "name": "Hamburg City-Süd",
  "address": "Eiffestraße 580",
  "zip": 20537,
  "city": "Hamburg",
  "telephone": "+49 40 2197170",
  "fax": "+49 40 21971717",
  "email": "hamburg-city-sued@starcar.de",
  "region_id": 2,
  "subregion_id": null,
  "region": { ... },
  "subregion": null,
  "users": [ ... ]
}
```

## Regionen

| Methode | Endpunkt         |
| ------- | ---------------- |
| POST    | /api/regions     |
| GET     | /api/regions     |
| GET     | /api/regions/:id |
| DELETE  | /api/regions/:id |

```json
{
  "id": 2,
  "name": "Nord 2",
  "users": [ ... ],
  "stations": [ ... ],
  "substations": [ ... ]
}
```

## Benutzer

| Methode | Endpunkt                        |
| ------- | ------------------------------- |
| GET     | /api/users                      |
| GET     | /api/users/:id                  |
| GET     | /api/users/:id/allowed_stations |

```json
{
  ""
}
```
