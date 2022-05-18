import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import parseUser from 'src/common/utils/parseUser';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';
import { access, adErrorText, dbErrorText } from 'src/config/constants';

export const login: ApiHandlerWithConn = async (req, res) => {
  const {
    body: { username, password },
    session,
    db,
    ldap,
  } = req;
  if (!ldap) throw new ApiError(adErrorText);
  if (!db) throw new ApiError(dbErrorText);

  if (!username) {
    throw new ApiError('Benutzername muss angegeben werden', 400, ['username']);
  }

  if (!password) {
    throw new ApiError('Passwort muss angegeben werden', 400, ['password']);
  }

  // authentifiziere user gegen AD
  const [ldapUser] = await ldap.authenticate(username, password);

  const repo = db.getRepository(User);

  // suche username aus request in der db
  let dbUser = await repo.findOne({
    where: { username },
    relations: ['region', 'allowed_stations'],
  });

  // wenn kein user: Modell erstellen
  if (dbUser === null) {
    dbUser = new User();
    dbUser.username = username;
    dbUser.access = access.empty;
  }

  // in jedem Fall Modell updaten
  dbUser.first_name = ldapUser.givenName;
  dbUser.last_name = ldapUser.sn;
  dbUser.email = ldapUser.mail;

  // aus DN die Station / Abteilung ermitteln
  // das ist sehr statisch, wenn der tree im AD also geändert wird knallts
  const dn = ldapUser.distinguishedName;
  const dnParts = dn.split('=');
  const location = dnParts[2].substring(0, 3);
  dbUser.location = location;

  // und am Ende speichern
  dbUser = await repo.save(dbUser);

  // für Session parsen
  const parsed = parseUser(dbUser);
  session.user = parsed;
  await session.save();

  success(res, 'Login erfolgreich');
};

export const logout: ApiHandlerWithConn = async (req, res) => {
  req.session.destroy();
  success(res, 'Session entfernt');
};
