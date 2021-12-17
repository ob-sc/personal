import { NextApiResponse } from 'next';
import logger from '../lib/log';

const response = (res: NextApiResponse) => ({
  success: (data?: string | object[] | object) => {
    res.status(data ? 200 : 204);
    if (!data) res.end();
    else res.json(typeof data === 'string' ? { message: data } : data);
  },

  error: (...params: unknown[]) => {
    let status = 500;
    let message = 'Es ist ein Fehler aufgetreten';
    let err: Error | undefined;

    for (const arg of params) {
      if (typeof arg === 'number') status = arg;
      if (typeof arg === 'string') message = arg;
      if (arg instanceof Error) err = arg;
    }

    if (status >= 400) logger.error(err?.message ?? message);
    res.status(status).json({ message, error: err?.message });
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
