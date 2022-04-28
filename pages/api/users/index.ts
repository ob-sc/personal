import { NextApiHandler } from 'next';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';

const userHandler: NextApiHandler = async (req, res) => {
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

export default withSessionApi(userHandler, 'users');

export const config = unresolved;
