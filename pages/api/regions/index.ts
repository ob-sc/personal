import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { unresolved } from 'utils/server';
import { Region } from 'entities/Region';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const regionRepository = db.getRepository(Region);

    const allRegions = async () => {
      const data = await regionRepository.find();
      success(res, data);
    };

    const newRegion = async () => {
      const { body } = req;
      const region = new Region();
      region.name = body.name;
      const data = await regionRepository.save(region);
      success(res, data);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions();
        break;
      case 'POST':
        await newRegion();
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
