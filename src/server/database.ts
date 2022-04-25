import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { NextApiHandlerWithDB } from '../../types/server';
import { dbConfig } from '../../config';
import { withSessionApi } from '../lib/withSession';
import { Region } from '../entities/Region';
import { Station } from '../entities/Station';
import { User } from '../entities/User';
import logger from '../lib/log';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const cfg = dbConfig[NODE_ENV];

const db = new DataSource({
  ...cfg,
  entities: [User, Station, Region],
});

/**
 * Middleware mit `withSessionApi()` und Datenbank init
 */
export const withSessionORM = (
  handler: NextApiHandlerWithDB,
  noAuth: boolean
) => {
  const withDbHandler: NextApiHandlerWithDB = async (req, res) => {
    if (res.dbInit !== true) {
      try {
        await db.initialize();
        res.dbInit = true;
        logger.debug('ORM Initialisierung okay');
      } catch (err) {
        logger.error(err);
      }
    }

    handler(req, res);
  };

  return withSessionApi(withDbHandler, noAuth);
};

export default db;
