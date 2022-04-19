import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { NewStationForm } from '../../../types/forms';
import { validateForm } from '../../../src/utils/server';

const stationsHandler: NextApiHandler = async (req, res) => {
  const { method, body } = req;

  const allStations = async () => {
    const data = await db.stations.findAll();
    success(res, data);
  };

  const newStation = async (form: NewStationForm) => {
    const fields = await db.stations.describe();

    // spread für typescript index signature
    const { values, errors } = await validateForm(fields, { ...form });

    console.log(form);
    console.log(values);
    console.log(errors);

    if (errors.length === 0) {
      await db.stations.create(values as any);
      success(res);
    }
  };

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        await allStations();
        break;
      case 'POST':
        await newStation(body);
        break;
      default:
        httpMethodError(res, method, ['GET', 'POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(stationsHandler);

export const config = unresolved;
