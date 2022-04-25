import { NextApiHandlerWithDB } from '../../../types/server';
import db from '../../../src/server/database';
import {
  nullOnEmpty,
  nullOnEmptyNum,
  unresolved,
} from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { Station } from '../../../src/entities/Station';
import { requiredField } from '../../../src/utils/server';
import { NewStationForm } from '../../stations/new';

const stationsHandler: NextApiHandlerWithDB = async (req, res) => {
  const { method, body } = req;

  const stationRepository = db.getRepository(Station);

  const allStations = async () => {
    const data = await stationRepository.find();
    success(res, data);
  };

  const newStation = async (form: NewStationForm) => {
    requiredField(form.id, form.name, form.region_id);

    const station = new Station();

    station.id = Number(form.id);
    station.name = form.name;
    station.address = nullOnEmpty(form.address);
    station.zip = nullOnEmptyNum(form.zip);
    station.city = nullOnEmpty(form.city);
    station.telephone = nullOnEmpty(form.telephone);
    station.fax = nullOnEmpty(form.fax);
    station.email = nullOnEmpty(form.email);
    station.region_id = Number(form.region_id);
    station.subregion_id = nullOnEmptyNum(form.subregion_id);

    await stationRepository.save(station);
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
