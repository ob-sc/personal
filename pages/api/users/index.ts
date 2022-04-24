import type { NextApiHandler } from 'next';
import db from '../../../src/server/database';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';

const usersHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  const userRepository = db.getRepository(User);

  const allUsers = async () => {
    const data = await userRepository.find();
    success(res, data);
  };

  try {
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

export default withSessionApi(usersHandler);

export const config = unresolved;
