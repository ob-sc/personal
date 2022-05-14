import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { NextApiHandlerWithConnections, ParsedUser } from 'types/server';
import { sessionConfig } from 'config';
import { accessConstants, routes } from 'config/constants';
import { redirectUrl } from 'utils/shared';
import { error } from 'server/response';
import getDatabaseConnection from 'server/database';
import ldapConnection from 'server/ldap';

declare module 'iron-session' {
  interface IronSessionData {
    user: ParsedUser;
  }
}

/** SSR handler mit redirect */
const sessionPropHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: ParsedUser }> = ({ req }) => {
  const { user } = req.session;

  if (user?.username === undefined) {
    const url = redirectUrl(req.url ?? '/');
    const encodeRedirect = `/login?redirect=${encodeURIComponent(url)}`;
    const destination = url === '/' ? '/login' : encodeRedirect;

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
 * Middleware die Authentifizierung und Berechtigung prüft.
 * Gibt `req` Session, DB ORM und ldapjs Client.
 * Bei Erfolg wird die Session erneuert.
 * Verbindungen werden in middleware aufgebaut und zerstört.
 */
export const withSessionApi = (
  handler: NextApiHandlerWithConnections,
  page: keyof typeof routes,
  withLdap?: boolean
) => {
  const authHandler: NextApiHandlerWithConnections = async (req, res) => {
    if (page !== '/sessions') {
      const { session } = req;
      // nicht authentifiziert
      if (session.user === undefined) {
        error(res, 'Authentifizierung erforderlich', 401);
        return;
      }

      // wenn authentifiziert, Session erneuern
      await session.save();

      // Berechtigung prüfen
      const { permitted } = accessConstants(session.user.access);

      const hasAccess = permitted[page] === true;

      if (!hasAccess) {
        error(res, 'Keine Berechtigung', 403);
        return;
      }
    }

    if (!req.db) {
      const db = await getDatabaseConnection();

      if (db === null || db === undefined) {
        error(res, 'Datenbank nicht verfügbar', 500);
        return;
      }

      req.db = db;
    }

    if (withLdap) {
      const ldap = ldapConnection();
      req.ldap = ldap;
    }

    // fortfahren
    await handler(req, res);
    req.db.destroy();
    req.db = undefined;
    req.ldap?.destroy();
  };

  return withIronSessionApiRoute(authHandler, sessionConfig);
};
