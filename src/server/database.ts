import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from '../../config';
import { Region } from '../entities/Region';
import { Station } from '../entities/Station';
import { User } from '../entities/User';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const cfg = dbConfig[NODE_ENV];

const db = new DataSource({
  ...cfg,
  entities: [User, Station, Region],
});

// (async function () {
//   console.log('hi');
//   try {
//     await db.initialize();
//   } catch (err) {
//     logger.error(err);
//   }
// })();

async function initConnection() {
  return db.initialize();
}

export default await initConnection();
