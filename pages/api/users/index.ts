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
        success(data);
        break;
      default:
        httpMethodError(method, ['get']);
    }
  } catch (err) {
    error(err);
  }
};

export default withSessionApi(userHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};
