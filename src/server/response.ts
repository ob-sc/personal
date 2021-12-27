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
    let message;
    let err: Error | undefined;

    for (const arg of params) {
      if (typeof arg === 'number') status = arg;
      if (typeof arg === 'string') message = arg;
      if (arg instanceof Error) err = arg;
    }

    if (message === undefined) message = err?.message ?? 'Unbekannter Fehler';

    if (status >= 400) logger.error(err?.message ?? message);
    res.status(status).json({ message });
  },

  httpMethodError: (method: string | undefined, allowed: ('get' | 'post' | 'put' | 'delete')[]) => {
    const upperMethods = allowed.map((m) => m.toUpperCase());

    res
      .setHeader('Allow', upperMethods)
      .status(405)
      .json({ message: method ? `Methode ${method} nicht erlaubt` : 'Keine Methode angegeben' });
  },
});

export default response;
