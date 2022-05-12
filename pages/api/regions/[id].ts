import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { removeRegion, singleRegion } from 'server/handler/regions';

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

export default withSessionApi(handler, 'regions');

export const config = unresolved;
