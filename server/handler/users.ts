import { NextApiHandlerWithConnections } from 'types/server';
import { User } from 'entities/User';
import parseUser from 'lib/parseUser';
import { success } from 'server/response';
import { ApiError, idFromQuery } from 'utils/server';

export const allUsers: NextApiHandlerWithConnections = async (req, res) => {
  const { db, session } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(User);
  const result = await repo.find();
  success(res, result);
};

export const singleUser: NextApiHandlerWithConnections = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');
  const id = idFromQuery(query.id);

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id,
    },
    relations: { region: true, allowedStations: true },
  });

  if (user === null) throw new ApiError('Benutzer nicht gefunden', 400);

  const result = parseUser(user);
  success(res, result);
};

export const createAllowedStation: NextApiHandlerWithConnections = async (
  req,
  res
) => {
  const { body, db } = req;
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id: Number(body.id),
    },
    relations: { region: true, allowedStations: true },
  });

  if (user === null) throw new ApiError('Benutzer nicht gefunden', 400);

  // todo save mit neuen allowed

  const result = parseUser(user);
  success(res, result);
};
