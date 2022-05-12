import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { singleUser } from 'server/handler/users';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method } = req;
    switch (method?.toUpperCase()) {
      case 'GET':
        await singleUser(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'users');

export const config = unresolved;
