import { ApiHandlerWithConn } from 'src/common/types/server';
import { User } from 'src/entities/User';
import parseUser from 'src/common/utils/parseUser';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';
import { access } from 'src/config/constants';

export const login: ApiHandlerWithConn = async (req, res) => {
  const {
    body: { username, password },
    session,
    db,
    ldap,
  } = req;
  if (!ldap) throw new ApiError('AD nicht verfügbar');
  if (!db) throw new ApiError('Datenbank nicht verfügbar');

  if (!username) {
    throw new ApiError('Benutzername muss angegeben werden', 400, ['username']);
  }

  if (!password) {
    throw new ApiError('Passwort muss angegeben werden', 400, ['password']);
  }

  // authentifiziere user gegen AD
  const [ldapUser] = await ldap.authenticate(username, password);

  const repo = db.getRepository(User);

  // suche username aus request in db
  let dbUser = await repo.findOne({
    where: { username },
    relations: { region: true, allowed_stations: true },
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
  const station = dnParts[2].substring(0, 3);
  dbUser.location = station; // todo auch verwaltung da rein, test number der station und wenn nicht hole

  // und am Ende speichern
  dbUser = await repo.save(dbUser);

  const parsed = parseUser(dbUser);

  session.user = parsed;
  await session.save();

  success(res, 'Login erfolgreich');
};

export const logout: ApiHandlerWithConn = async (req, res) => {
  req.session.destroy();
  success(res, 'Session entfernt');
};
