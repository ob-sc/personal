import { NextApiHandlerWithConnections } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { allStations, createStation } from 'src/modules/stations/apiHandler';
import { accessConstants, noAccessText } from 'src/config/constants';

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
