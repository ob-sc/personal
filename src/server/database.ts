import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from 'config';
import { User } from 'src/entities/User';
import { Station } from 'src/entities/Station';
import { Region } from 'src/entities/Region';
import logger from 'src/lib/log';

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
