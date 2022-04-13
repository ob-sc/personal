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

// cfg aus env, sonst leerer string. jedenfalls nicht undefined (siehe config.ts)
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const sequelize = new Sequelize(
  database!,
  username!,
  password!,
  options
);

const testSequelizeConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Datenbank verbunden');
  } catch (error) {
    logger.error('Datenbank nicht verbunden');
  }
};

testSequelizeConnection();

User.init(users, { tableName: 'users', sequelize });
// Station.init(stations, { tableName: 'stations', sequelize });

// modelle erstellen etc
// sequelize.sync();

// INSERT INTO development.users (`domain`,`username`,`access`,`stations`,`createdAt`,`updatedAt`) VALUES ("starcar","bergen","admin","12,18","2021-12-01 13:20:42","2021-12-01 13:20:42");

const db = { users: User };

export default db;
