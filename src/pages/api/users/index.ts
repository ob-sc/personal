import { NextApiHandlerWithConnections } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { allUsers } from 'src/modules/users/apiHandler';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method } = req;
    switch (method?.toUpperCase()) {
      case 'GET':
        await allUsers(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, '/users');

export const config = unresolved;
