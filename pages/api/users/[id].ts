import { NextApiHandler } from 'next';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';
import parseUser from '../../../src/lib/parseUser';

const userIdHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const userRepository = db.getRepository(User);

  const singleUser = async () => {
    const user = await userRepository.findOne({
      where: {
        id: Number(Array.isArray(id) ? id[0] : id),
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
