import { Dialect, Options as SequelizeOptions } from 'sequelize';
import { IronSessionOptions } from 'iron-session';
import logger from '../src/lib/log';
import { Options as LdapOptions } from 'ldapauth-fork';

const validateEnv = (envName: string, fallback?: string | number, number?: boolean) => {
  const env = process.env[envName];
  const message = `env ${envName}: nicht vorhanden`;

  if (env === undefined) {
    // wenn kein fallback: env ist required -> kill process
    if (fallback === undefined) {
      logger.error(new Error(message));
      process.exit(1);
      // sonst nicht required -> warnung & return default
    } else {
      logger.warn(message);
      return number ? Number(fallback) : String(fallback);
    }
  }

  return env;
};

const parseEnv = {
  toString: (envName: string, fallback?: string) => validateEnv(envName, fallback) as string,
  toNumber: (envName: string, fallback?: number) => validateEnv(envName, fallback, true) as number,
};

const env = {
  db_user: parseEnv.toString('DB_USER'),
  db_password: parseEnv.toString('DB_PASSSWORD'),
  ldap_user: parseEnv.toString('LDAP_USER'),
  ldap_password: parseEnv.toString('LDAP_PASSWORD'),
  ldap_url: parseEnv.toString('LDAP_URL'),
  session_name: parseEnv.toString('SESSION_NAME', 'scps'),
  session_password: parseEnv.toString('SESSION_PASSWORD'),
  session_ttl: parseEnv.toNumber('SESSION_TTL', 20 * 60),
};

// DB

const db = {
  development: 'development',
  test: 'test',
  production: 'production',
};
const host = '127.0.0.1';
const dialect = 'mysql' as Dialect;

export const dbConfig: {
  development: SequelizeOptions;
  test: SequelizeOptions;
  production: SequelizeOptions;
} = {
  development: {
    username: env.db_user,
    password: env.db_password,
    database: db.development,
    host,
    dialect,
    logging: (msg: unknown) => logger.debug(msg),
  },

  test: {
    username: env.db_user,
    password: env.db_password,
    database: db.test,
    host,
    dialect,
    logging: false,
  },

  production: {
    username: env.db_user,
    password: env.db_password,
    database: db.production,
    host,
    dialect,
    logging: false,
  },
};

// LDAP

const baseDN = 'DC=starcar,DC=local';

export const ldapConfig: LdapOptions = {
  url: env.ldap_url,
  bindDN: `CN=${env.ldap_user},CN=Users,${baseDN}`,
  bindCredentials: env.ldap_password,
  searchBase: `OU=User,OU=STARCAR,${baseDN}`,
  searchFilter: '(sAMAccountName={{username}})',
  searchAttributes: [
    'cn',
    'sn',
    'l',
    'postalCode',
    'telephoneNumber',
    'givenName',
    'distinguishedName',
    'displayName',
    'streetAddress',
    'sAMAccountName',
    'userPrincipalName',
    'userAccountControl',
    'mail',
  ],
};

// SESSION

export const sessionConfig: IronSessionOptions = {
  cookieName: env.session_name,
  password: env.session_password,
  ttl: env.session_ttl, // in sekunden
};
