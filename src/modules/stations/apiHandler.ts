import { validate } from 'class-validator';
import { ApiHandlerWithConn } from 'src/common/types/server';
import { Station } from 'src/entities/Station';
import { success } from 'src/common/utils/response';
import { nullOnEmptyNum, nullOnEmptyTrim } from 'src/common/utils/shared';
import {
  ApiError,
  flattenObjectToProperty,
  handleValidationErrors,
  idFromQuery,
  requiredField,
} from 'src/common/utils/server';
import { StationForm } from 'src/pages/stations/new';
import { dbErrorText } from 'src/config/constants';

// Hier sind alle CRUD Funktionen zu finden (als Referenz für andere Module)

const NOTFOUND = 'Station nicht gefunden';

/** Neues Stations-Entity aus einem bestehenden oder einer leeren Vorlage */
export const stationFromObject = (
  values: StationForm,
  entity: Station
): Station => {
  const newStation = { ...entity };

  // id, name und region_id dürfen nicht null sein
  newStation.id = Number(values.id);
  newStation.name = values.name.trim();
  newStation.address = nullOnEmptyTrim(values.address);
  newStation.zip = nullOnEmptyNum(values.zip);
  newStation.city = nullOnEmptyTrim(values.city);
  newStation.telephone = nullOnEmptyTrim(values.telephone);
  newStation.fax = nullOnEmptyTrim(values.fax);
  newStation.email = nullOnEmptyTrim(values.email);
  newStation.region_id = Number(values.region_id);
  newStation.subregion_id = nullOnEmptyNum(values.subregion_id);

  return newStation;
};

/** `GET` Alle Stationen mit relations `region` und `subregion` */
export const allStations: ApiHandlerWithConn = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(Station);

  // todo where mit stationen (bzw region)

  const stations = await repo.find({
    relations: { region: true, subregion: true },
  });

  const flatStations = stations.map((station) =>
    flattenObjectToProperty({ ...station })
  );

  success(res, flatStations);
};

/** `POST` Erstelle eine neue Station, nicht idempotent wegen der ID und dem Namen */
export const createStation: ApiHandlerWithConn<StationForm> = async (
  req,
  res
) => {
  const { db, body } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(Station);

  requiredField(body.id, body.name, body.region_id);

  const station = stationFromObject(body, new Station());

  const errors = await validate(station);
  if (errors.length > 0) handleValidationErrors(errors);

  await repo.insert(station);
  success(res, station, 201);
};

// [id] queries ab hier

/** `GET` Einzelne Station mit allen relations */
export const singleStation: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Station);

  // todo where mit stationen (bzw region)
  const result = await repo.findOne({
    where: {
      id,
    },
    relations: { region: true, subregion: true, users: true },
  });

  if (result === null) throw new ApiError(NOTFOUND, 400);

  success(res, result);
};

/**
 * `PUT`
 *
 * Hier wird trotz `PUT` nie eine Station angelegt werden.
 * `id` kommt immer als Query Parameter einer schon bestehenden Seite,
 * es wird immer eine gefunden und angepasst.
 *
 * `./api.ts` hat deshalb zwei Parameter, `id` und `values`.
 *
 * Trotzdem ist es theoretisch möglich eine Station bei nicht gefundener
 * `id` zu erstellen, nur um RESTful zu sein.
 */
export const updateStation: ApiHandlerWithConn<StationForm> = async (
  req,
  res
) => {
  const { db, body, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Station);

  requiredField(body.name, body.region_id);

  const result = (await repo.findOne({ where: { id } })) ?? new Station();

  const station = stationFromObject({ ...body, id: String(id) }, result);

  const errors = await validate(station);
  if (errors.length > 0) handleValidationErrors(errors);

  await repo.save(station);
  success(res, station);
};

// todo noch testen
/** `PATCH` Deaktivieren einer Station */
export const disableStation: ApiHandlerWithConn = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Station);

  const result = await repo.findOne({ where: { id } });
  if (result === null) throw new ApiError(NOTFOUND, 400);

  result.active = false;

  await repo.save(result);

  success(res, result);
};

/** `DELETE` Endgültiges Löschen einer Station */
export const deleteStation: ApiHandlerWithConn = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Station);

  const result = await repo.findOne({ where: { id } });
  if (result === null) throw new ApiError(NOTFOUND, 400);
  await repo.remove(result);

  success(res);
};
