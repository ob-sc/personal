import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from 'src/config';
import { User } from 'src/entities/User';
import { Station } from 'src/entities/Station';
import { Region } from 'src/entities/Region';
import logger from 'src/common/utils/log';

export type Entity = User | Station | Region;

export type StringValueEntitiy = Record<keyof Entity, string>;

const entities = [User, Station, Region];

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
