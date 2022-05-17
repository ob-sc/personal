import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import parseUser from 'src/common/utils/parseUser';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery } from 'src/common/utils/server';

export const allUsers: ApiHandlerWithConn = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(User);
  const result = await repo.find();
  success(res, result);
};

export const singleUser: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');
  const id = idFromQuery(query.id);

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id,
    },
    relations: { region: true, allowed_stations: true },
  });

  if (user === null) throw new ApiError('Benutzer nicht gefunden', 400);

  const result = parseUser(user);
  success(res, result);
};

export const createAllowedStation: ApiHandlerWithConn = async (req, res) => {
  const { body, db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id: Number(body.id),
    },
    relations: { region: true, allowed_stations: true },
  });

  if (user === null) throw new ApiError('Benutzer nicht gefunden', 400);

  // todo save mit neuen allowed

  const result = parseUser(user);
  success(res, result);
};
