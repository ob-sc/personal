import { NextApiHandlerWithConnections } from 'types/server';
import { Region } from 'entities/Region';
import { unresolved } from 'utils/server';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError } from 'server/response';
import { removeRegion, singleRegion } from 'server/handler/regions';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { query, method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const regionRepository = db.getRepository(Region);

    switch (method?.toUpperCase()) {
      case 'GET':
        await singleRegion(res, regionRepository, { query });
        break;
      case 'DELETE':
        await removeRegion(res, regionRepository, { query });
        break;
      default:
        httpMethodError(res, method, ['GET', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'regions');

export const config = unresolved;
