import { NextApiResponse } from 'next';
import { ErrorResponse, SuccessResponse } from 'types/server';
import logger from 'src/lib/log';

/**
 * Antwort mit Code 200 (bzw 204)
 * @example
 * success(res,  { msg: "Riecht gut!" } )
 * success(res, "Riecht auch gut!" )
 */
export const success = (
  res: NextApiResponse,
  data?: string | object[] | object | null
) => {
  res.status(data ? 200 : 204);
  const body: SuccessResponse =
    typeof data === 'string' ? { message: data } : data;
  if (!data) res.end();
  else res.json(body);
};

type ErrorResponseParam = number | string | Error | string[] | null;

/**
 * `res` muss als Parameter gegeben werden, der Rest ist optional.
 * Nur ein Parameter pro Typ.
 * Typen werden wie folgt ausgelesen:
 * - `number` als Status Code
 * - `string` als Nachricht
 * - `Error` als Error-Objekt
 * - `Array` als fehlerhafte Formularfelder
 * @example error(res, 400, 'Fehler', new Error("Oops!"), ['username', ... ]);
 */
export const error = (
  res: NextApiResponse,
  ...params: (ErrorResponseParam | unknown)[]
) => {
  let status = 500;
  let message: string | undefined;
  let err: Error | undefined;
  let fields: string[] = [];

  for (const arg of params) {
    if (arg === null) continue;
    if (typeof arg === 'number') status = arg;
    if (typeof arg === 'string') message = arg;
    if (arg instanceof Error) err = arg;
    if (Array.isArray(arg)) fields = arg;
  }

  if (message === undefined) {
    message =
      err?.message ??
      (status === 401
        ? 'Authentifizierung erforderlich'
        : 'Unbekannter Fehler');
  }
  logger.error(message);

  const body: ErrorResponse = { message, fields };

  res.status(status).json(body);
};

/**
 * Antwort wenn eine Request-Methode nicht unterstützt wird
 * @example httpMethodError(res, method, ['GET', 'POST']);
 */
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
