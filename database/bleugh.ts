import { DataTypes, Sequelize } from 'sequelize';
import cfg from '../config';

const sequelize = new Sequelize(cfg.db.database, cfg.db.user, cfg.db.secret, {
  host: 'localhost',
  dialect: 'mysql',
});

// todo sequelize einfach laufen lassen oder jeden request neue connection?
// evtl iwie wieder schließen?

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  domain: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING },
});

export default test;

// 5ea5e0b251080508555bcb59	starcar	bergen
