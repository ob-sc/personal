import { Sequelize } from 'sequelize';
import { dbConfig } from '../config';
import User, { users } from './users';
import Station, { stations } from './stations';
import log from '../lib/log';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const config = dbConfig[NODE_ENV];
const { database, username, password, ...options } = config;

// cfg aus env, sonst leerer string. jedenfalls nicht undefined (siehe config.ts)
export const sequelize = new Sequelize(database!, username!, password!, options);

User.init(users, { tableName: 'users', sequelize });
Station.init(stations, { tableName: 'stations', sequelize });

// sequelize.sync();

// User.create({
//   id: '5ea5e0b251080508555bcb59',
//   username: 'bergen',
//   domain: 'starcar',
// });

const db = { users: User };

export default db;
