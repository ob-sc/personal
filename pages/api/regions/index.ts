import { NextApiHandlerWithConnections } from 'types/server';
import { Region } from 'entities/Region';
import { unresolved } from 'utils/server';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError } from 'server/response';
import { allRegions, createRegion } from 'server/handler/regions';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { body, method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const regionRepository = db.getRepository(Region);

    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions(res, regionRepository);
        break;
      case 'POST':
        await createRegion(res, regionRepository, { body });
        break;
      default:
        httpMethodError(res, method, ['GET', 'POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'regions');

export const config = unresolved;
