import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { dbConfig } from '../../config';
import logger from '../lib/log';
import User, { users } from './users';
// import Station, { stations } from './stations';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const config = dbConfig[NODE_ENV];
const { database, username, password, ...options } = config;

// workaround für "Error: Please install mysql2 package manually"
if (options.dialect === 'mysql') {
  options.dialectModule = mysql2;
}

const hasOptions =
  database !== undefined && username !== undefined && password !== undefined;

if (!hasOptions) {
  logger.error('Fehler bei Sequelize initialisierung');
  process.exit(1);
}

export const sequelize = new Sequelize(database, username, password, options);

User.init(users, { tableName: 'users', sequelize });
// Station.init(stations, { tableName: 'stations', sequelize });

const db = { users: User };

export default db;
