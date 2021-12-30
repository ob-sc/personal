import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { unresolved } from '../../../src/lib/util';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const userHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  const allUsers = async () => {
    const data = await db.users.findAll();
    success(res, data);
  };

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        allUsers();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(userHandler);

export const config = unresolved;
