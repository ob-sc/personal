import { DataTypes, Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import cfg from '../../config';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, ...options } = cfg.db[env];

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(database, username, password, options);

fs.readdirSync(__dirname)
  .filter((file: any) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts')
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
