import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { ApiError, unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { allStations, createStation } from 'server/handler/stations';
import { accessConstants, noAccessText } from 'config/constants';

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const {
      method,
      session: {
        user: { access },
      },
    } = req;

    const { permitted } = accessConstants(access);

    switch (method?.toUpperCase()) {
      case 'GET':
        await allStations(req, res);
        break;
      case 'POST':
        if (!permitted['/stations/new']) throw new ApiError(noAccessText);
        await createStation(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET', 'POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, '/stations');

export const config = unresolved;
