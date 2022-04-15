import { NextApiResponse } from 'next';
import { ErrorResponse, SuccessResponse } from '../../types/server';
import logger from '../lib/log';

export const success = (
  res: NextApiResponse,
  data?: string | unknown[] | Record<'string', unknown> | null
) => {
  res.status(data ? 200 : 204);
  const body: SuccessResponse =
    typeof data === 'string' ? { message: data } : data;
  if (!data) res.end();
  else res.json(body);
};

export const error = (res: NextApiResponse, ...params: unknown[]) => {
  let status = 500;
  let message;
  let err: Error | undefined;
  let field;

  for (const arg of params) {
    if (arg === null) continue;
    if (typeof arg === 'number') status = arg;
    if (typeof arg === 'string') message = arg;
    if (arg instanceof Error) err = arg;
    if (typeof arg === 'object') {
      for (const [k, v] of Object.entries(arg)) {
        if (k === 'field') field = v;
      }
    }
  }

  if (message === undefined) message = err?.message ?? 'Unbekannter Fehler';
  logger.error(message);

  if (status === 403) {
    res
      .status(status)
      .json({ message: message ?? 'Authentifizierung erforderlich' });
    return;
  }

  const body: ErrorResponse = { message };

  if (field) body.field = field;

  res.status(status).json(body);
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
