import { NextApiHandlerWithConnections } from 'types/server';
import { Region } from 'src/entities/Region';
import { withSessionApi } from 'src/lib/withSession';
import { error, httpMethodError, success } from 'src/server/response';
import { numFromParam, unresolved } from 'src/utils/server';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const {
      query: { id },
      method,
      db,
    } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const regionRepository = db.getRepository(Region);

    const singleRegion = async () => {
      const region = await regionRepository.findOne({
        where: {
          id: numFromParam(id),
        },
        relations: { users: true, stations: true, subStations: true },
      });

      if (region === null) {
        error(res, 'Benutzer nicht gefunden');
        return;
      }

      success(res, region);
    };

    const removeRegion = async () => {
      const region = await regionRepository.findOne({
        where: { id: numFromParam(id) },
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
        await singleRegion();
        break;
      case 'DELETE':
        await removeRegion();
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
