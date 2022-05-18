import { ApiHandlerWithConn } from 'src/common/types/server';
import { Region } from 'src/entities/Region';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery, requiredField } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';

const notFound = new ApiError('Region nicht gefunden', 404);

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

  requiredField(name);

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
    relations: ['users', 'stations'],
  });

  if (region === null) throw notFound;

  success(res, region);
};

/** `DELETE` Endgültiges Löschen einer Region */
export const deleteRegion: ApiHandlerWithConn = async (req, res) => {
  const { db, query } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(Region);

  const result = await repo.findOne({ where: { id } });
  if (result === null) throw notFound;
  await repo.remove(result);

  success(res, 'Region gelöscht');
};
