import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { allFloats, replaceFloat } from 'src/modules/settings/apiHandler';
import { noAccessText } from 'src/config/constants';

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method } = req;
    const { write } = req.session.user?.access.temps ?? {};

    switch (method?.toUpperCase()) {
      case 'GET':
        if (!write) throw new ApiError(noAccessText, 403);
        await allFloats(req, res);
        break;
      case 'PUT':
        if (!write) throw new ApiError(noAccessText, 403);
        await replaceFloat(req, res);
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler);

export const config = unresolved;
