import { NextApiHandler } from 'next';
import db from '../../../src/server/database';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';

const userIdHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const userRepository = db.getRepository(User);

  const singleUser = async () => {
    const user = await userRepository.findOneBy({
      id: parseInt(Array.isArray(id) ? id[0] : id, 10),
    });
    success(res, user);
  };

  try {
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

export default withSessionApi(userIdHandler, 'users');

export const config = unresolved;
