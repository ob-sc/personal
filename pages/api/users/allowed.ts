import { NextApiHandlerWithConnections } from 'types/server';
import { withSessionApi } from 'lib/withSession';
import { unresolved } from 'utils/server';
import { error, httpMethodError } from 'server/response';
import { createAllowedStation } from 'server/handler/users';

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

export default withSessionApi(handler, 'users');

export const config = unresolved;
