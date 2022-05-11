import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'src/lib/withSession';
import { error, httpMethodError, success } from 'src/server/response';
import { unresolved } from 'src/utils/server';
import { Region } from 'src/entities/Region';

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

    const removeRegion = async () => {
      const { body } = req;
      const region = await regionRepository.findOne({
        where: { id: Number(body.id) },
      });
      if (region === null) {
        error(res, 'Region nicht gefunden');
        return;
      }
      await regionRepository.remove(region);
      success(res, 'Region gelöscht');
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions();
        break;
      case 'POST':
        await newRegion();
        break;
      case 'DELETE':
        await removeRegion();
        break;
      default:
        httpMethodError(res, method, ['GET', 'POST', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'regions');

export const config = unresolved;
