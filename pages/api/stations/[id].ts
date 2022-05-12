import { NextApiHandlerWithConnections } from 'types/server';
import { Station } from 'entities/Station';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { idFromQuery, unresolved } from 'utils/server';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const {
      query: { id },
      method,
      db,
    } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const stationRepository = db.getRepository(Station);

    const singleStation = async () => {
      const station = await stationRepository.findOne({
        where: {
          id: idFromQuery(id),
        },
        relations: { region: true, subregion: true, users: true },
      });

      if (station === null) {
        error(res, 'Benutzer nicht gefunden');
        return;
      }

      success(res, station);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await singleStation();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'stations');

export const config = unresolved;
