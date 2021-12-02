import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { withSessionApi } from '../../../src/lib/withSession';

const userHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method?.toUpperCase() === 'GET') {
    const users = await db.users.findAll();

    res.status(200).json(users);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default withSessionApi(userHandler);
