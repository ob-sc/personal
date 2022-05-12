import { NextApiHandlerWithConnections } from 'types/server';
import { User } from 'entities/User';
import parseUser from 'lib/parseUser';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { unresolved } from 'utils/server';

// todo api/allowed-stations oder weiter api/users/allowed?

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { body, method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const userRepository = db.getRepository(User);

    const postAllowedStation = async () => {
      const user = await userRepository.findOne({
        where: {
          id: Number(body.id),
        },
        relations: { region: true, allowedStations: true },
      });

      if (user === null) {
        error(res, 'Benutzer nicht gefunden');
        return;
      }

      // todo save mit neuen allowed+

      const parsed = parseUser(user);
      success(res, parsed);
    };

    switch (method?.toUpperCase()) {
      case 'POST':
        await postAllowedStation();
        break;
      default:
        httpMethodError(res, method, ['POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'users');

export const config = unresolved;
