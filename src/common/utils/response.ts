import { NextApiResponse } from 'next';
import { errorText } from 'src/config/constants';
import {
  ErrorResponse,
  PermittedMethod,
  SuccessResponse,
} from 'src/common/types/server';
import logger from 'src/common/utils/log';
import { ApiError } from 'src/common/utils/server';

/** Antwort mit Code 200 (bzw 204) */
export const success = (
  res: NextApiResponse,
  data?: string | object[] | object | null,
  status?: number
) => {
  res.status(status ? status : data ? 200 : 204);
  const body: SuccessResponse =
    typeof data === 'string' ? { message: data } : data;
  if (!data) res.end();
  else res.json(body);
};

type ErrorResponseParam = number | string | Error | string[] | null;

/**
 * `res` muss als Parameter gegeben werden, der Rest ist optional.
 * Wichtig: Nur ein Parameter pro Typ.
 * Typen werden wie folgt ausgelesen:
 * - `number` als Status Code
 * - `string` als Nachricht
 * - `Array` als fehlerhafte Formularfelder
 * - `Error` als (Api-)Error-Objekt
 */
export const error = (
  res: NextApiResponse,
  ...params: (ErrorResponseParam | unknown)[]
) => {
  let status = 500;
  let message: string | undefined;
  let err: ApiError | Error | undefined;
  let fields: string[] = [];

  for (const arg of params) {
    if (arg === null) continue;
    if (typeof arg === 'number') status = arg;
    if (typeof arg === 'string') message = arg;
    if (Array.isArray(arg)) fields = arg;
    if (arg instanceof ApiError) {
      // eslint-disable-next-line prefer-destructuring
      fields = arg.fields;
      status = arg.statusCode;
      err = arg;
    } else if (arg instanceof Error) err = arg;
  }

  if (message === undefined) {
    message =
      err?.message ??
      (status === 401 ? 'Authentifizierung erforderlich' : errorText);
  }
  logger.error(message);

  const body: ErrorResponse = { message, fields };

  res.status(status).json(body);
};

/** Antwort wenn eine Request-Methode nicht unterstützt wird */
export const httpMethodError = (
  res: NextApiResponse,
  method: string | undefined,
  allowed: PermittedMethod[]
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
