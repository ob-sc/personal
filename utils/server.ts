import { isDev, isEmpty } from 'utils/shared';

export class ApiError extends Error {
  constructor(message: string, public fields: string[] = []) {
    super(message);
  }
}

// iwie gibt es keinen LDAP Error mit nem type der passt, Error hat code mit text bei keiner Verbindung
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseLdapError(err: any): ApiError {
  let message = '';
  let field = null;

  if (!isDev) message = 'Fehler bei LDAP Authentifizierung';
  else message = String(err);

  if (err.code === 'ENETUNREACH') {
    message = 'Keine Verbindung zum LDAP Server';
  }

  if (err.message.includes('data 52e')) {
    message = 'Passwort ist falsch';
    field = 'password';
  }

  const fields = field ? [field] : [];

  return new ApiError(message, fields);
}

export const unresolved = {
  api: {
    externalResolver: true,
  },
};

export function requiredField(...args: (string | null | undefined)[]) {
  for (const arg of args) {
    if (isEmpty(arg)) {
      throw new Error(`Argument ${arg} fehlt`);
    }
  }
}

export const NULL = {
  nullable: true,
  // default: null,
};

// automatisch not null
// export const NOT_NULL = { nullable: false };

export const UNIQUE = { unique: true };

export function numFromParam(id: string | string[]): number {
  return Number(Array.isArray(id) ? id[0] : id);
}
