import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import { Region } from 'src/entities/Region';
import { readBuffer, readUser, writeBuffer } from 'src/common/utils/user';
import { success } from 'src/common/utils/response';
import { ApiError, idFromQuery } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';
import { setBit, unsetBit } from 'src/common/utils/bitwise';
import { notFound as regionNotFound } from 'src/modules/regions/apiHandler';
import { notFound as stationNotFound } from 'src/modules/stations/apiHandler';
import { Station } from 'src/entities/Station';
import { Crent } from 'src/entities/Crent';

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
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, station } = query;

  const userRepo = db.getRepository(User);
  const stationRepo = db.getRepository(Station);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
    relations: ['allowed_stations'],
  });
  if (user === null) throw notFound;

  const stationFromId = await stationRepo.findOne({
    where: { id: Number(station) },
  });
  if (stationFromId === null) throw stationNotFound;

  const previousAllowed = !Array.isArray(user.allowed_stations)
    ? []
    : user.allowed_stations;

  user.allowed_stations = [...previousAllowed, stationFromId];
  await userRepo.save(user);

  const result = readUser(user);
  success(res, result);
};

export const removeAllowedStation: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, station } = query;

  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
    relations: ['allowed_stations'],
  });
  if (user === null) throw notFound;

  const allowedStations = Array.isArray(user.allowed_stations)
    ? [...user.allowed_stations]
    : [];

  const allowedStationIndex = allowedStations.findIndex(
    (allowedStation) => allowedStation.id === Number(station)
  );

  if (allowedStationIndex === -1) {
    throw new ApiError('Gewählte Station ist nicht freigegeben', 401);
  }

  allowedStations.splice(allowedStationIndex, 1);
  user.allowed_stations = allowedStations;
  await userRepo.save(user);

  const result = readUser(user);
  success(res, result);
};

export const giveAccess: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, bit } = query;

  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: { id: Number(id) },
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
    where: { id: Number(id) },
  });
  if (user === null) throw notFound;

  const accessNumber = readBuffer(user.access);
  const newAccess = unsetBit(accessNumber, Number(bit));
  user.access = writeBuffer(newAccess);
  await repo.save(user);

  const result = readUser(user);
  success(res, result);
};

export const giveRegion: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, region } = query;

  const userRepo = db.getRepository(User);
  const regionRepo = db.getRepository(Region);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
  });
  if (user === null) throw notFound;

  const regionFromId = await regionRepo.findOne({
    where: { id: Number(region) },
  });
  if (regionFromId === null) throw regionNotFound;

  user.region = regionFromId;
  await userRepo.save(user);

  const result = readUser(user);
  success(res, result);
};

export const removeRegion: ApiHandlerWithConn = async (req, res) => {
  const { query, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id } = query;

  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
  });
  if (user === null) throw notFound;

  await userRepo.save({ id: user.id, region_id: null });

  const result = readUser(user);
  success(res, result);
};

export const storeCrent: ApiHandlerWithConn = async (req, res) => {
  const { body, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, username, personell_id, register_id } = body;

  const userRepo = db.getRepository(User);
  const crentRepo = db.getRepository(Crent);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
    relations: ['crent'],
  });
  if (user === null) throw notFound;

  const crent = await crentRepo.save({
    username,
    personell_id,
    register_id: register_id || null,
  });

  await userRepo.save({ id: user.id, crent });

  const result = readUser(user);
  success(res, result);
};

export const storeQlik: ApiHandlerWithConn = async (req, res) => {
  const { body, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, qlik } = body;

  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
  });
  if (user === null) throw notFound;

  await userRepo.save({ id: user.id, qlik });

  const result = readUser(user);
  success(res, result);
};

export const storeHardware: ApiHandlerWithConn = async (req, res) => {
  const { body, db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const { id, hardware } = body;

  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: { id: Number(id) },
  });
  if (user === null) throw notFound;

  await userRepo.save({ id: user.id, hardware });

  const result = readUser(user);
  success(res, result);
};
