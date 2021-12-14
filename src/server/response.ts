import { NextApiResponse } from 'next';
import logger from '../lib/log';

const response = (res: NextApiResponse) => ({
  success: (data?: string | object[] | object) => {
    res.status(200);
    if (!data) res.end();
    else res.json(typeof data === 'string' ? { message: data } : data);
  },

  error: (...args: (unknown | number | string)[]) => {
    let status = 500;
    let message = 'Es ist ein Fehler aufgetreten';
    let err: null | object | Error = null;

    for (const arg of args) {
      if (typeof arg === 'number') status = arg;
      if (typeof arg === 'string') message = arg;
      if (typeof arg === 'object') err = arg;
    }

    if (status >= 500) logger.error(err ?? message);
    res.status(status).json({ message, error: err });
  },

  httpMethodError: (method: string | undefined, allowed: { [key: string]: boolean }) => {
    const allowedMethods: string[] = [];

    for (const [k, v] of Object.entries(allowed)) {
      if (v === true) allowedMethods.push(k.toUpperCase());
    }

    res
      .setHeader('Allow', allowedMethods)
      .status(405)
      .json({ error: method ? `Methode ${method} nicht erlaubt` : 'Keine Methode angegeben' });
  },
});

export default response;
