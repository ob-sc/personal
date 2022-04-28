import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from '../../config';
import { Region } from '../entities/Region';
import { Station } from '../entities/Station';
import { User } from '../entities/User';
import logger from '../lib/log';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const cfg = dbConfig[NODE_ENV];
const errMsg = `Keine DB config gefunden für '${NODE_ENV}'`;
if (!cfg) throw new Error(errMsg);

const entities = [User, Station, Region];

export const dataSource = new DataSource({
  ...cfg,
  entities,
});

async function getDatabaseConnection() {
  try {
    return dataSource.initialize();
  } catch (err) {
    logger.error(err);
    return null;
  }
}

export default getDatabaseConnection;
