import { NextApiResponse } from 'next';
import logger from '../lib/log';

export const success = (
  res: NextApiResponse,
  data?: string | object[] | object | null
) => {
  res.status(data ? 200 : 204);
  if (!data) res.end();
  else res.json(typeof data === 'string' ? { message: data } : data);
};

export const error = (res: NextApiResponse, ...params: unknown[]) => {
  let status = 500;
  let message;
  let err: Error | undefined;

  for (const arg of params) {
    if (typeof arg === 'number') status = arg;
    if (typeof arg === 'string') message = arg;
    if (arg instanceof Error) err = arg;
  }

  if (message === undefined) message = err?.message ?? 'Unbekannter Fehler';
  logger.error(message);

  if (status === 403) {
    res
      .status(status)
      .json({ message: message ?? 'Authentifizierung erforderlich' });
    return;
  }

  res.status(status).json({ message });
};

export const httpMethodError = (
  res: NextApiResponse,
  method: string | undefined,
  allowed: ('GET' | 'POST' | 'PUT' | 'DELETE')[]
) => {
  const upperMethods = allowed.map((m) => m.toUpperCase());

  res
    .setHeader('Allow', upperMethods)
    .status(405)
    .json({
      message: method
        ? `Methode ${method} nicht erlaubt`
        : 'Keine Methode angegeben',
    });
};
