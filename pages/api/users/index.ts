import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { withSessionApi } from '../../../src/lib/withSession';
import response from '../../../src/server/response';

const userHandler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { error, success, httpMethodError } = response(res);

  try {
    let data;
    switch (method?.toUpperCase()) {
      case 'GET':
        data = await db.users.findAll();
        return success(data);
        break;
      default:
        return httpMethodError(method, { get: true });
    }
  } catch (err) {
    return error(err);
  }

  success('stalled');
};

export default withSessionApi(userHandler);
