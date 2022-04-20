import { Sequelize } from 'sequelize-typescript';
import mysql2 from 'mysql2';
import { dbConfig } from '../../config';
import logger from '../lib/log';
import User from '../models/User';
import Station from '../models/Station';
import Region from '../models/Region';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const config = dbConfig[NODE_ENV];
const { database, username, password, ...options } = config;

// workaround für "Error: Please install mysql2 package manually" in Docker
if (options.dialect === 'mysql') {
  options.dialectModule = mysql2;
}

const hasOptions =
  database !== undefined && username !== undefined && password !== undefined;

if (!hasOptions) {
  logger.error('Fehler bei Sequelize Optionen');
  process.exit(1);
}

export const sequelize = new Sequelize(database, username, password, options);

sequelize.addModels([User, Station, Region]);

const db = { users: User, stations: Station, regions: Region };

export default db;
