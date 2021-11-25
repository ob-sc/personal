import { Dialect, Options as SequelizeOptions } from 'sequelize';
import { ClientOptions } from 'ldapjs';
import { IronSessionOptions } from 'iron-session';

const {
  PORT,
  DB_USER,
  DB_SECRET,
  JACANDO,
  LDAP_USER,
  LDAP_PASSWORD,
  LDAP_URL,
  SESSION_NAME,
  SESSION_PASSWORD,
} = process.env;

interface Config {
  port: number;
  db: {
    development: SequelizeOptions;
    test: SequelizeOptions;
    production: SequelizeOptions;
  };
  ldap: {
    user: string;
    password: string;
    options: ClientOptions;
  };
  session: IronSessionOptions;
  jacando: string;
}

// ohne undefined
const createDefault = {
  string: (env: string | undefined, def?: string) => (env === undefined ? def ?? '' : env),
  number: (env: string | undefined, def?: number) => (env === undefined ? def ?? 0 : Number(env)),
};

const port = createDefault.number(PORT, 3000);

const db_user = createDefault.string(DB_USER);
const db_secret = createDefault.string(DB_SECRET);

const jacando = createDefault.string(JACANDO);

const ldap_user = createDefault.string(LDAP_USER);
const ldap_password = createDefault.string(LDAP_PASSWORD);
const ldap_url = createDefault.string(LDAP_URL);

const session_name = createDefault.string(SESSION_NAME);
const session_password = createDefault.string(SESSION_PASSWORD);

// DB

const database = {
  development: 'prod',
  test: 'test',
  production: 'production',
};
const host = '127.0.0.1';
const dialect = 'mysql' as Dialect;

const db = {
  development: {
    username: db_user,
    password: db_secret,
    database: database.development,
    host,
    dialect,
  },

  test: {
    username: db_user,
    password: db_secret,
    database: database.test,
    host,
    dialect,
    logging: false,
  },

  production: {
    username: db_user,
    password: db_secret,
    database: database.production,
    host,
    dialect,
  },
};

// LDAP

const ldap = {
  user: ldap_user,
  password: ldap_password,
  options: { url: ldap_url },
};

// SESSION

const session = {
  cookieName: session_name,
  password: session_password,
};

const cfg: Config = { port, db, ldap, session, jacando };

export default cfg;
