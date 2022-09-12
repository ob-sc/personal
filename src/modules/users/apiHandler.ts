import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import { readBuffer, readUser, writeBuffer } from 'src/common/utils/user';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';
import { setBit, unsetBit } from 'src/common/utils/bitwise';

const notFound = new ApiError('Benutzer nicht gefunden', 404);

const allRelations = ['region', 'crent', 'hardware', 'allowed_stations'];

// todo allusers und singleuser beide mehr berechtigung aus sessions, nur eigene station, nicht deaktiviert etc

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
    relations: allRelations,
  });

  if (user === null) throw notFound;

  const result = readUser(user);
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
    relations: allRelations,
  });

  if (user === null) throw notFound;

  // todo save mit neuen allowed

  const result = readUser(user);
  success(res, result);
};

export const giveAccess: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, bit } = query;

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id: Number(id),
    },
    relations: allRelations,
  });

  if (user === null) throw notFound;

  const accessNumber = readBuffer(user.access);

  const newAccess = setBit(accessNumber, Number(bit));

  user.access = writeBuffer(newAccess);

  await repo.save(user);

  const result = readUser(user);
  success(res, result);
};

export const removeAccess: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, bit } = query;

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: {
      id: Number(id),
    },
    relations: allRelations,
  });

  if (user === null) throw notFound;

  const accessNumber = readBuffer(user.access);

  const newAccess = unsetBit(accessNumber, Number(bit));

  user.access = writeBuffer(newAccess);

  await repo.save(user);

  const result = readUser(user);
  success(res, result);
};
