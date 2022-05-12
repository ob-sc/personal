import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { allRegions, createRegion } from 'server/handler/regions';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method } = req;
    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions(req, res);
        break;
      case 'POST':
        await createRegion(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET', 'POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, 'regions');

export const config = unresolved;
