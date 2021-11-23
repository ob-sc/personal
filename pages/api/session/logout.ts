import { NextApiHandler } from 'next';
import log from '../../../lib/log';
import { withSessionApi } from '../../../lib/withSession';

const logoutRoute: NextApiHandler = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Session entfernt' });
};

export default withSessionApi(logoutRoute);
