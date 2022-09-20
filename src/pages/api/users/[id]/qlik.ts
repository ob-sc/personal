import { ApiHandlerWithConn } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { ApiError, unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { storeQlik } from 'src/modules/users/apiHandler';
import { noAccessText } from 'src/config/constants';

const handler: ApiHandlerWithConn = async (req, res) => {
  try {
    const { method, session } = req;
    const { write } = session.user?.access.users ?? {};

    switch (method?.toUpperCase()) {
      case 'PUT':
        if (!write) throw new ApiError(noAccessText, 403);
        await storeQlik(req, res);
        break;
      default:
        httpMethodError(res, method, ['PUT']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler);

export const config = unresolved;
