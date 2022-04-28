import { NextApiHandler } from 'next';
import { unresolved } from '../../../src/utils/shared';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';
import { User } from '../../../src/entities/User';
import parseUser from '../../../src/lib/parseUser';

const allowedStationHandler: NextApiHandler = async (req, res) => {
  const { body, method } = req;

  const userRepository = db.getRepository(User);

  const postAllowedStation = async () => {
    const user = await userRepository.findOne({
      where: {
        id: Number(body.id),
      },
      relations: { region: true, allowedStations: true },
    });

    if (user === null) {
      error(res, 'Benutzer nicht gefunden');
      return;
    }

    // todo save mit neuen allowed

    const parsed = parseUser(user);
    success(res, parsed);
  };

  try {
    switch (method?.toUpperCase()) {
      case 'POST':
        await postAllowedStation();
        break;
      default:
        httpMethodError(res, method, ['POST']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(allowedStationHandler, 'users');

export const config = unresolved;
