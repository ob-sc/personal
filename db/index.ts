import { Model, Sequelize } from 'sequelize';
import cfg from '../config';
import log from '../lib/log';
import users, { UserAttributes } from './users';

const env = process.env.NODE_ENV ?? 'development';
const config = cfg.db[env];
const { database, username, password, ...options } = config;

// cfg aus env, sonst leerer string. jedenfalls nicht undefined (siehe config.ts)
export const sequelize = new Sequelize(database!, username!, password!, options);

class User extends Model<UserAttributes> implements UserAttributes {
  id!: string;
  domain!: string;
  username!: string;
}

User.init(users, { tableName: 'users', sequelize });

User.sync();

// User.create({
//   id: '5ea5e0b251080508555bcb59',
//   username: 'bergen',
//   domain: 'starcar',
// });

export const UserModel = User;

// export const User = users(sequelize); // users(sequelize).belongsTo(Foo, { as: 'bar' })

// const db: Database = { User };

// aus sequelize init, ka warum ich das machen sollte, sind das erstelle instanz und klasse?
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
