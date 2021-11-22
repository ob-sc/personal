const { JACANDO, LDAP_URL, LDAP_USER, LDAP_PASSWORD, SESSION_NAME, SESSION_PASSWORD } = process.env;

// nur für ts, damit undefined raus ist
const createDefault = {
  string: (env: string | undefined) => env ?? '',
  number: (env: string | undefined) => (env !== undefined ? Number(env) : 0),
};

const jacando = createDefault.string(JACANDO);

const ldap_url = createDefault.string(LDAP_URL);
const ldap_user = createDefault.string(LDAP_USER);
const ldap_password = createDefault.string(LDAP_PASSWORD);

const session_name = createDefault.string(SESSION_NAME);
const session_password = createDefault.string(SESSION_PASSWORD);

const ldap = {
  url: ldap_url,
  user: ldap_user,
  password: ldap_password,
};

const session = {
  cookieName: session_name,
  password: session_password,
};

const cfg = { ldap, session, jacando };

export default cfg;
