import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import {
  deleteStation,
  singleStation,
  updateStation,
} from 'src/modules/stations/apiHandler';
import { noAccessText } from 'src/config/constants';

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method } = req;
    const { read, write } = req.session.user?.access.stations ?? {};

    switch (method?.toUpperCase()) {
      case 'GET':
        if (!read) throw new ApiError(noAccessText, 403);
        await singleStation(req, res);
        break;
      case 'PUT':
        if (!write) throw new ApiError(noAccessText, 403);
        await updateStation(req, res);
        break;
      case 'DELETE':
        if (!write) throw new ApiError(noAccessText, 403);
        await deleteStation(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET', 'PUT', 'DELETE']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler);

export const config = unresolved;
