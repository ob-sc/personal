import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { dbConfig } from '../../config';
import logger from '../lib/log';
import UserModel, { users } from './users';
import StationModel, { stations } from './stations';

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

UserModel.init(users, { tableName: 'users', sequelize });
StationModel.init(stations, { tableName: 'stations', sequelize });

const db = { users: UserModel, stations: StationModel };

export default db;
