import type { NextApiHandler } from 'next';
import { withSessionApi } from '../../../src/lib/withSession';
import response from '../../../src/server/response';

const userHandler: NextApiHandler = (req, res) => {
  const {
    query: { id },
    method,
  } = req;
  const { error, success, methodError } = response(res);

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        success({ id });
        break;
      default:
        methodError(method, { get: true });
    }
  } catch (err) {
    error(err);
  }
};

export default withSessionApi(userHandler);
