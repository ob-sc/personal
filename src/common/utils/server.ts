import { hasOwnProperty, isDev, isEmpty } from 'src/common/utils/shared';

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

export const unresolved = {
  api: {
    externalResolver: true,
  },
};

export const NULL = {
  nullable: true,
  // default: null,
};

// automatisch not null
// export const NOT_NULL = { nullable: false };

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

export function requiredField(...args: (string | null | undefined)[]) {
  for (const arg of args) {
    if (isEmpty(arg)) {
      throw new ApiError('Ein Pflichtfeld fehlt', 400);
    }
  }
}

export function idFromQuery(id: string | string[]): number {
  const num = Number(Array.isArray(id) ? id[0] : id);
  if (Number.isNaN(num)) throw new ApiError('Keine gültige ID', 400);
  return num;
}

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
