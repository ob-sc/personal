import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from 'config';
import { User } from 'entities/User';
import { Station } from 'entities/Station';
import { Region } from 'entities/Region';
import logger from 'lib/log';

export const entities = [User, Station, Region];

async function getDatabaseConnection() {
  const NODE_ENV = process.env.NODE_ENV ?? 'development';
  const cfg = dbConfig[NODE_ENV];
  const errMsg = `Keine DB config gefunden für '${NODE_ENV}'`;
  if (!cfg) throw new Error(errMsg);

  const dataSource = new DataSource({
    ...cfg,
    entities,
  });

  try {
    return dataSource.isInitialized
      ? dataSource
      : await dataSource.initialize();
  } catch (err) {
    logger.error(err);
    return null;
  }
}

export default getDatabaseConnection;
