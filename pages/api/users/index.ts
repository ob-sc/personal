import { User } from 'entities/User';
import { withSessionApi } from 'lib/withSession';
import { error, httpMethodError, success } from 'server/response';
import { unresolved } from 'utils/server';
import { NextApiHandlerWithConnections } from 'types/server';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method, db } = req;
    if (!db) throw new Error('Datenbank nicht verfügbar');

    const userRepository = db.getRepository(User);

    const allUsers = async () => {
      const data = await userRepository.find();
      success(res, data);
    };

    switch (method?.toUpperCase()) {
      case 'GET':
        await allUsers();
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
