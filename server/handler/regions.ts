import { NextApiHandlerWithConnections } from 'types/server';
import { Region } from 'entities/Region';
import { success } from 'server/response';
import { ApiError, idFromQuery } from 'utils/server';

export const allRegions: NextApiHandlerWithConnections = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(Region);

  const result = await repo.find();
  success(res, result);
};

export const singleRegion: NextApiHandlerWithConnections = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Region);

  const region = await repo.findOne({
    where: { id },
    relations: { users: true, stations: true, substations: true },
  });

  if (region === null) throw new ApiError('Region nicht gefunden', 400);

  success(res, region);
};

export const createRegion: NextApiHandlerWithConnections = async (req, res) => {
  const {
    body: { name },
    db,
  } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(Region);

  const region = new Region();
  region.name = name;
  const result = await repo.save(region);

  success(res, result, 201);
};

export const removeRegion: NextApiHandlerWithConnections = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Region);

  const result = await repo.findOne({ where: { id } });
  if (result === null) throw new ApiError('Region nicht gefunden', 400);
  await repo.remove(result);

  success(res, 'Region gelöscht');
};
