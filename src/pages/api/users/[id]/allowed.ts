import { NextApiHandlerWithConnections } from 'src/common/types/server';
import { withSessionApi } from 'src/common/middleware/withSession';
import { unresolved } from 'src/common/utils/server';
import { error, httpMethodError } from 'src/common/utils/response';
import { createAllowedStation } from 'src/modules/users/apiHandler';

// todo api/allowed-stations oder weiter api/users/allowed?

const handler: NextApiHandlerWithConnections = async (req, res) => {
  try {
    const { method } = req;

    switch (method?.toUpperCase()) {
      case 'POST':
        await createAllowedStation(req, res);
        break;
      default:
        httpMethodError(res, method, ['POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(handler, '/users/[id]/allowed');

export const config = unresolved;
