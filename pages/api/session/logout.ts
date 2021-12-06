import { NextApiHandler } from 'next';
import { withSessionApi } from '../../../src/lib/withSession';
import response from '../../../src/server/response';

const logoutRoute: NextApiHandler = (req, res) => {
  const { success } = response(res);
  req.session.destroy();
  success('Session entfernt');
};

export default withSessionApi(logoutRoute);
