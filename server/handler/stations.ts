import { validate } from 'class-validator';
import { NextApiHandlerWithConnections } from 'types/server';
import { Station } from 'entities/Station';
import { success } from 'server/response';
import { nullOnEmpty, nullOnEmptyNum } from 'utils/shared';
import { ApiError, idFromQuery, requiredField } from 'utils/server';
import { NewStationForm } from 'types/forms';

export const allStations: NextApiHandlerWithConnections = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(Station);

  const result = await repo.find({
    relations: { region: true, subregion: true },
  });
  success(res, result);
};

export const singleStation: NextApiHandlerWithConnections = async (
  req,
  res
) => {
  const { query, db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(Station);

  const id = idFromQuery(query.id);
  const result = await repo.findOne({
    where: {
      id,
    },
    relations: { region: true, subregion: true, users: true },
  });

  if (result === null) throw new ApiError('Benutzer nicht gefunden', 400);

  success(res, result);
};

export const createStation: NextApiHandlerWithConnections<
  NewStationForm
> = async (req, res) => {
  const { db, body } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(Station);

  requiredField(body.id, body.name, body.region_id);

  const station = new Station();

  station.id = Number(body.id);
  station.name = body.name;
  station.address = nullOnEmpty(body.address);
  station.zip = nullOnEmptyNum(body.zip);
  station.city = nullOnEmpty(body.city);
  station.telephone = nullOnEmpty(body.telephone);
  station.fax = nullOnEmpty(body.fax);
  station.email = nullOnEmpty(body.email);
  station.region_id = Number(body.region_id);
  station.subregion_id = nullOnEmptyNum(body.subregion_id);

  const errors = await validate(station);
  if (errors.length > 0) throw new ApiError(JSON.stringify(errors), 400);

  await repo.insert(station);
  success(res);
};
