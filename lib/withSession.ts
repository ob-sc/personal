import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { NextApiHandlerWithConnections, ParsedUser } from 'types/server';
import { sessionConfig } from 'config';
import { Route, accessConstants } from 'config/constants';
import { redirectUrl } from 'utils/shared';
import { error } from 'server/response';
import getDatabaseConnection from 'server/database';
import ldapConnection from 'server/ldap';

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
 * @example
 * export const getServerSideProps = withSessionSsr();
 * const Foo = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => { ... };
 * export default Foo;
 */
export const withSessionSsr = () =>
  withIronSessionSsr(sessionPropHandler, sessionConfig);

/**
 * Middleware die Authentifizierung und Berechtigung prüft.
 * Gibt `req` Session, DB ORM und ldapjs Client.
 * Bei Erfolg wird die Session erneuert.
 * Verbindungen werden in middleware aufgebaut und zerstört.
 * @example
 * const routeHandler: NextApiHandler = async (req, res) => { const { session, db } = req; ... };
 * export default withSessionApi(routeHandler);
 */
export const withSessionApi = (
  handler: NextApiHandlerWithConnections,
  page: Route,
  withLdap?: boolean
) => {
  const authHandler: NextApiHandlerWithConnections = async (req, res) => {
    if (page !== 'sessions') {
      const { session } = req;
      // nicht authentifiziert
      if (session.user === undefined) {
        return error(res, 'Authentifizierung erforderlich', 401);
      }

      // wenn authentifiziert, Session erneuern
      await session.save();

      // Berechtigung prüfen
      const { hasAccess } = accessConstants(session.user.access, page);

      if (!hasAccess) return error(res, 'Keine Berechtigung', 403);
    }

    if (!req.db) {
      const db = await getDatabaseConnection();

      if (db === null || db === undefined) {
        return error(res, 'Datenbank nicht verfügbar', 500);
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
