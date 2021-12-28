import type { NextApiHandler } from 'next';
import { withSessionApi } from '../../../src/lib/withSession';
import response from '../../../src/server/response';

const userHandler: NextApiHandler = (req, res) => {
  const {
    query: { id },
    method,
  } = req;
  const { error, success, httpMethodError } = response(res);

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        console.log(id, '  users id success');
        success({ id });
        break;
      default:
        console.log(method, '  users id method error');
        httpMethodError(method, ['get']);
    }
  } catch (err) {
    console.log(err, '  users id error');
    error(err);
  }
};

export default withSessionApi(userHandler);
