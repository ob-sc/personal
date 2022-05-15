import { NextApiHandlerWithConnections } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { removeRegion, singleRegion } from 'src/modules/regions/apiHandler';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method } = req;
    switch (method?.toUpperCase()) {
      case 'GET':
        await singleRegion(req, res);
        break;
      case 'DELETE':
        await removeRegion(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, '/regions');

export const config = unresolved;
