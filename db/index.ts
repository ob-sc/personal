import { Sequelize } from 'sequelize';
import cfg from '../config';
import User, { users } from './users';

const env = process.env.NODE_ENV ?? 'development';
const config = cfg.db[env];
const { database, username, password, ...options } = config;

// cfg aus env, sonst leerer string. jedenfalls nicht undefined (siehe config.ts)
export const sequelize = new Sequelize(database!, username!, password!, options);

User.init(users, { tableName: 'users', sequelize });

// User.sync();

// User.create({
//   id: '5ea5e0b251080508555bcb59',
//   username: 'bergen',
//   domain: 'starcar',
// });

const db = { users: User };

export default db;
