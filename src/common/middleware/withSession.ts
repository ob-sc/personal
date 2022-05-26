import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ApiHandlerWithConn, ParsedUser } from 'src/common/types/server';
import { sessionConfig } from 'src/config';
import { redirectUrl } from 'src/common/utils/shared';
import { error } from 'src/common/utils/response';
import getDatabaseConnection from 'src/entities';
import ldapConnection from 'src/modules/ldap/ldap';
import { dbErrorText } from 'src/config/constants';

declare module 'iron-session' {
  interface IronSessionData {
    user?: ParsedUser;
  }
}

/** SSR handler mit redirect */
const sessionPropHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: ParsedUser }> = ({ req }) => {
  const { user } = req.session;

  if (user?.username === undefined) {
    const url = redirectUrl(req.url ?? '/');
    const encodedRedirect = `/login?redirect=${encodeURIComponent(url)}`;
    const destination = url === '/' ? '/login' : encodedRedirect;

    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

/**
 * Session als Prop, ohne Authentifizierung redirect.
 * Kompatibel mit `InferGetServerSidePropsType`
 */
export const withSessionSsr = () =>
  withIronSessionSsr(sessionPropHandler, sessionConfig);

/**
 * Middleware die Authentifizierung prüft.
 * Gibt `req` Session, DB ORM und ldapjs Client.
 * Bei Erfolg wird die Session erneuert.
 * Verbindungen werden in middleware aufgebaut und zerstört.
 */
export const withSessionApi = (
  handler: ApiHandlerWithConn,
  withLdap?: boolean,
  noSession?: boolean
) => {
  const authHandler: ApiHandlerWithConn = async (req, res) => {
    if (!noSession) {
      const { session } = req;
      // nicht authentifiziert
      if (session.user === undefined) {
        error(res, 'Authentifizierung erforderlich', 401);
        return;
      }

      // wenn authentifiziert, Session erneuern
      await session.save();
    }

    // TypeORM
    if (!req.db) {
      const db = await getDatabaseConnection();

      if (db === null || db === undefined) {
        error(res, dbErrorText, 500);
        return;
      }

      req.db = db;
    }

    // ldapjs
    if (withLdap) {
      const ldap = ldapConnection();
      req.ldap = ldap;
    }

    await handler(req, res);

    // wenn "Error: Can't add new command when connection is in closed state" kommt:
    // der handler läuft durch, aber eine DB Operation wird noch durchgeführt
    // vermutlich fehlt dann irgendwo ein await
    req.db.destroy();
    req.db = undefined;
    req.ldap?.destroy();
  };

  return withIronSessionApiRoute(authHandler, sessionConfig);
};
