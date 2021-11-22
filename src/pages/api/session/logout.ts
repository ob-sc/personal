import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionApiRoute } from '../../../lib/withSession';

export default withSessionApiRoute((req: NextApiRequest, res: NextApiResponse) => {
  req.session.destroy();
  res.status(200).end();
});
