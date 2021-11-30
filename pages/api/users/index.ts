import type { NextApiHandler } from 'next';
import Jacando from '../../../src/server/jacando';
import { Employee } from '../../../types/api';

const userHandler: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method?.toUpperCase() === 'GET') {
    const jacando = new Jacando('/employees');
    const employees: Employee[] = await jacando.get();
    res.status(200).json(employees);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
  }
};

export default userHandler;
