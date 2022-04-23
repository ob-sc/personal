import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from '../../config';
import AllowedStation from '../entities/AllowedStation';
import Region from '../entities/Region';
import Station from '../entities/Station';
import User from '../entities/User';
import logger from '../lib/log';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const cfg = dbConfig[NODE_ENV];

const db = new DataSource({
  ...cfg,
  entities: [User, Station, Region, AllowedStation],
});

(async function () {
  try {
    await db.initialize();
  } catch (err) {
    logger.error(err);
  }
})();

export default db;
