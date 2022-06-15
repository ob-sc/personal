import { ApiHandlerWithConn } from 'src/common/types/server';
import { readUser, writeUser } from 'src/common/utils/user';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';
import { adErrorText, dbErrorText } from 'src/config/constants';

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
  const ldapUser = await ldap.authenticate(username, password);

  const dbUser = await writeUser(db, ldapUser, username);

  // für Session parsen
  const parsed = readUser(dbUser);
  session.user = parsed;
  await session.save();

  success(res, 'Login erfolgreich');
};

export const logout: ApiHandlerWithConn = async (req, res) => {
  req.session.destroy();
  success(res, 'Session entfernt');
};
