import { ApiHandlerWithConn } from 'src/common/types/server';
import { Region } from 'src/entities/Region';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';

export const allRegions: ApiHandlerWithConn = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(Region);

  const result = await repo.find();
  success(res, result);
};

export const createRegion: ApiHandlerWithConn<{ name: string }> = async (
  req,
  res
) => {
  const {
    body: { name },
    db,
  } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(Region);

  const region = new Region();
  region.name = name.trim();
  const result = await repo.save(region);

  success(res, result, 201);
};

// [id]

export const singleRegion: ApiHandlerWithConn = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Region);

  const region = await repo.findOne({
    where: { id },
    relations: { users: true, stations: true, substations: true },
  });

  if (region === null) throw new ApiError('Region nicht gefunden', 400);

  success(res, region);
};

export const deleteRegion: ApiHandlerWithConn = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Region);

  const result = await repo.findOne({ where: { id } });
  if (result === null) throw new ApiError('Region nicht gefunden', 400);
  await repo.remove(result);

  success(res, 'Region gelöscht');
};
