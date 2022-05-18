import { IronSessionOptions } from 'iron-session';
import { ClientOptions as LdapOptions } from 'ldapjs';
import { DataSourceOptions } from 'typeorm';
import logger from 'src/common/utils/log';

const validateEnv = (
  envName: string,
  fallback?: string | number,
  number?: boolean
) => {
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
  toString: (envName: string, fallback?: string) =>
    validateEnv(envName, fallback) as string,
  toNumber: (envName: string, fallback?: number) =>
    validateEnv(envName, fallback, true) as number,
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

type Databases = {
  development: DataSourceOptions;
  test: DataSourceOptions;
  production: DataSourceOptions;
};

const baseDbConfig: DataSourceOptions = {
  type: 'mysql',
  username: env.db_user,
  password: env.db_password,
  host: 'localhost',
  synchronize: false,
  logging: ['error'],
};

export const dbConfig: Databases = {
  development: {
    ...baseDbConfig,
    database: 'development',
    synchronize: true,
    logging: ['schema', 'error', 'warn', 'info', 'log', 'migration'],
  },

  test: {
    ...baseDbConfig,
    database: 'test',
    logging: ['error'],
  },

  production: {
    ...baseDbConfig,
    database: 'production',
    logging: ['error'],
  },
};

// LDAP

const baseDN = 'DC=starcar,DC=local';

export const ldapConfig: {
  bindDN: string;
  bindPW: string;
  baseDN: string;
  options: LdapOptions;
} = {
  bindDN: `CN=${env.ldap_user},CN=Users,${baseDN}`,
  bindPW: env.ldap_password,
  baseDN,
  options: {
    url: env.ldap_url,
    log: logger,
  },
};

// SESSION

export const sessionConfig: IronSessionOptions = {
  cookieName: env.session_name,
  password: env.session_password,
  ttl: env.session_ttl, // in sekunden
  cookieOptions: { maxAge: env.session_ttl - 30 },
};
