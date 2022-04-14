import { NextApiHandler } from 'next';
import { sequelize } from '../../../src/db';
import logger from '../../../src/lib/log';
import { isDev, unresolved } from '../../../src/lib/util';
import { httpMethodError } from '../../../src/server/response';

const testSequelizeConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('DB ok');
  } catch (error) {
    logger.error('DB Fehler');
  }
};

const initHandler: NextApiHandler = (req, res) => {
  const { method } = req;

  const handleInit = () => {
    if (!isDev) {
      logger.error('Kann auf prod nicht initialisieren');
      return;
    }

    testSequelizeConnection().then(() => {
      sequelize.sync();
    });
  };

  switch (method?.toUpperCase()) {
    case 'POST':
      handleInit();
      break;
    default:
      httpMethodError(res, method, ['POST']);
  }
};

export default initHandler;

export const config = unresolved;
