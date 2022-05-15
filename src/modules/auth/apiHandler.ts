import { NextApiHandlerWithConnections } from 'src/common/types/server';
import { User } from 'src/entities/User';
import parseUser from 'src/common/utils/parseUser';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';

export const login: NextApiHandlerWithConnections = async (req, res) => {
  const {
    body: { username, password },
    session,
    db,
    ldap,
  } = req;
  if (!ldap) throw new ApiError('AD nicht verfügbar');
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  if (!username) {
    throw new ApiError('Benutzername muss angegeben werden', 401, ['username']);
  }

  if (!password) {
    throw new ApiError('Passwort muss angegeben werden', 401, ['password']);
  }

  // authentifiziere user gegen AD
  const [ldapUser] = await ldap.authenticate(username, password);

  const repo = db.getRepository(User);

  // suche username aus request in db
  let dbUser = await repo.findOne({
    where: { username },
    relations: { region: true, allowedStations: true },
  });

  // wenn kein user: Modell erstellen
  if (dbUser === null) {
    dbUser = new User();
    dbUser.username = username;
  }

  // in jedem Fall Modell updaten
  dbUser.first_name = ldapUser.givenName;
  dbUser.last_name = ldapUser.sn;
  dbUser.email = ldapUser.mail;
  dbUser.dn = ldapUser.distinguishedName;

  // und am Ende speichern
  dbUser = await repo.save(dbUser);

  const parsed = parseUser(dbUser);

  session.user = parsed;
  await session.save();

  success(res, 'Login erfolgreich');
};

export const logout: NextApiHandlerWithConnections = async (req, res) => {
  req.session.destroy();
  success(res, 'Session entfernt');
};
