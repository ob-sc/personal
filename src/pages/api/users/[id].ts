import type { NextApiHandler } from 'next';

const userHandler: NextApiHandler = (req, res) => {
  const {
    query: { id, name },
    method,
  } = req;

  switch (method?.toUpperCase()) {
    case 'GET':
      res.status(200).json({ id, name: `User ${id}` });
      break;
    case 'POST':
      res.status(200).json({ id, name: name || `User ${id}` });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default userHandler;
