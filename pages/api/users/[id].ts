import type { NextApiHandler } from 'next';
import db from '../../../src/server/sequelize';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const userIdHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const singleUser = async () => {
    const user = await db.users.findOne({ where: { id } });
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

export default withSessionApi(userIdHandler);

export const config = unresolved;
