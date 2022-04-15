import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { unresolved } from '../../../src/lib/util';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const stationsHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  const allStations = async () => {
    const data = await db.stations.findAll();
    success(res, data);
  };

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        allStations();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(stationsHandler);

export const config = unresolved;
