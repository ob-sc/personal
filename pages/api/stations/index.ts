import type { NextApiHandler } from 'next';
import db from '../../../src/server/sequelize';
import { nullOnEmpty, unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { NewStationForm } from '../../../types/data';

const stationsHandler: NextApiHandler = async (req, res) => {
  const { method, body } = req;

  const allStations = async () => {
    const data = await db.stations.findAll();
    console.log(data);
    success(res, data);
  };

  const newStation = async (form: NewStationForm) => {
    const values = {
      id: nullOnEmpty(form.id),
      name: nullOnEmpty(form.name),
      address: nullOnEmpty(form.address),
      zip: nullOnEmpty(form.zip),
      city: nullOnEmpty(form.city),
      telephone: nullOnEmpty(form.telephone),
      fax: nullOnEmpty(form.fax),
      email: nullOnEmpty(form.email),
      region: nullOnEmpty(form.region),
    };

    await db.stations.create(values);
    success(res);
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
