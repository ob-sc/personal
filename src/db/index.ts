import { Sequelize } from 'sequelize';
import { dbConfig } from '../../config';
import User, { users } from './users';
// import Station, { stations } from './stations';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const config = dbConfig[NODE_ENV];
const { database, username, password, ...options } = config;

// cfg aus env, sonst leerer string. jedenfalls nicht undefined (siehe config.ts)
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const sequelize = new Sequelize(database!, username!, password!, options);

User.init(users, { tableName: 'users', sequelize });
// Station.init(stations, { tableName: 'stations', sequelize });

sequelize.sync();

// INSERT INTO development.users (`domain`,`username`,`access`,`stations`,`createdAt`,`updatedAt`) VALUES ("starcar","bergen","admin","12,18","2021-12-01 13:20:42","2021-12-01 13:20:42");

const db = { users: User };

export default db;
