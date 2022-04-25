import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from '../../config';
import { Region } from '../entities/Region';
import { Station } from '../entities/Station';
import { User } from '../entities/User';
import logger from '../lib/log';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const cfg = dbConfig[NODE_ENV];

const db = new DataSource({
  ...cfg,
  entities: [User, Station, Region],
});

async function ormInit() {
  if (db.isInitialized !== true) {
    try {
      await db.initialize();
    } catch (err) {
      logger.error(err);
    }
  }

  return db;
}

export default await ormInit();
