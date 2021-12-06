import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { withSessionApi } from '../../../src/lib/withSession';
import response from '../../../src/server/response';

const userHandler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const { error, success, methodError } = response(res);

  try {
    let data;
    switch (method?.toUpperCase()) {
      case 'GET':
        data = await db.users.findAll();
        success(data);
        break;
      default:
        methodError(method, { get: true });
    }
  } catch (err) {
    error(err);
  }
};

export default withSessionApi(userHandler);
