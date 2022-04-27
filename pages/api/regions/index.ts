import { NextApiHandler } from 'next';
import db from '../../../src/server/database';
import { Region } from '../../../src/entities/Region';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const regionHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  const regionRepository = db.getRepository(Region);

  const allRegions = async () => {
    const data = await regionRepository.find();
    success(res, data);
  };

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        await allRegions();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(regionHandler, 'regions');

export const config = unresolved;
