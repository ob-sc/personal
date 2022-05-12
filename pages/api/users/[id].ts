import { NextApiHandlerWithConnections } from 'types/server';
import { User } from 'entities/User';
import parseUser from 'lib/parseUser';
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

    const userRepository = db.getRepository(User);

    const singleUser = async () => {
      const user = await userRepository.findOne({
        where: {
          id: idFromQuery(id),
        },
        relations: { region: true, allowedStations: true },
      });

      if (user === null) {
        error(res, 'Benutzer nicht gefunden');
        return;
      }

      const parsed = parseUser(user);
      success(res, parsed);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await singleUser();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'users');

export const config = unresolved;
