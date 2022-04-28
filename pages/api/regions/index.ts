import { NextApiHandlerWithDB } from '../../../src/utils/server';
import { Region } from '../../../src/entities/Region';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const handler: NextApiHandlerWithDB = async (req, res) => {
  try {
    const { method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const regionRepository = db.getRepository(Region);

    const allRegions = async () => {
      const data = await regionRepository.find();
      success(res, data);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'regions');

export const config = unresolved;
