import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import parseUser from 'src/common/utils/parseUser';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';

const notFound = new ApiError('Benutzer nicht gefunden', 404);

// todo allusers und singleuser beide mehr berechtigung aus sessions, nur eigene station etc

export const allUsers: ApiHandlerWithConn = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(User);
  const result = await repo.find();
  success(res, result);
};

export const singleUser: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);
  const id = idFromQuery(query.id);

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id,
    },
    relations: ['region', 'allowed_stations'],
  });

  if (user === null) throw notFound;

  const result = parseUser(user);
  success(res, result);
};

export const createAllowedStation: ApiHandlerWithConn = async (req, res) => {
  const { body, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id: Number(body.id),
    },
    relations: ['region', 'allowed_stations'],
  });

  if (user === null) throw notFound;

  // todo save mit neuen allowed

  const result = parseUser(user);
  success(res, result);
};
