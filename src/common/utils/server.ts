import { ValidationError } from 'class-validator';
import { hasOwnProperty, isDev, isEmpty } from 'src/common/utils/shared';

/** Genereller Fehler wenn in der API was schieft läuft */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly fields: string[];

  constructor(message: string, statusCode = 500, fields: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.fields = fields;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Next config auf api pages */
export const unresolved = {
  api: {
    externalResolver: true,
  },
};

// helper für TypeORM
export const NULL = { nullable: true };
export const UNIQUE = { unique: true };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseLdapError(err: any): ApiError {
  let message = '';
  let field = null;
  let statusCode = 400;

  if (!isDev) message = 'Fehler bei LDAP Authentifizierung';
  else message = String(err);

  if (err.code === 'ENETUNREACH') {
    message = 'Keine Verbindung zum LDAP Server';
    statusCode = 500;
  }

  if (err.message.includes('data 52e')) {
    message = 'Passwort ist falsch';
    field = 'password';
  }

  const fields = field ? [field] : [];

  return new ApiError(message, statusCode, fields);
}

/** Wirft Exception mit `fields` */
export function handleValidationErrors(errors: ValidationError[]): never {
  throw new ApiError(
    'Ungültige Eingabe',
    400,
    errors.map((e) => e.property)
  );
}

/** Wirft Exception wenn ein Pflichtfeld fehlt */
export function requiredField(...args: (string | null | undefined)[]) {
  for (const arg of args) {
    if (isEmpty(arg)) {
      throw new ApiError('Ein Pflichtfeld fehlt', 400);
    }
  }
}

/** Gibt ID aus `string` / erstem Element von `string[]`. Wirft Exception wenn ID keine `number` ist. */
export function idFromQuery(id: string | string[]): number {
  const num = Number(Array.isArray(id) ? id[0] : id);
  if (Number.isNaN(num)) throw new ApiError('Keine gültige ID', 400);
  return num;
}

/** Zb um relations auf eine Property (default `name`) runterzubrechen */
export function flattenObjectToProperty(
  obj: { [key: string]: unknown; name?: string },
  prop = 'name'
) {
  const result: { [key: string]: unknown } = {};
  for (const [key, val] of Object.entries(obj)) {
    const isObjWithProp =
      typeof val === 'object' && val !== null && hasOwnProperty(val, prop);
    if (isObjWithProp) result[key] = val.name;
    else result[key] = val;
  }
  return result;
}
