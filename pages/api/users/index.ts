import { NextApiHandlerWithDB } from '../../../src/utils/server';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';

const handler: NextApiHandlerWithDB = async (req, res) => {
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
