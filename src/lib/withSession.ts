import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { sessionConfig } from '../../config';
import { accessConstants } from '../../config/constants';
import { ParsedUser, Route } from '../../types/server';
import getDatabaseConnection from '../server/database';
import ldapClient from '../server/ldap';
import { error } from '../server/response';
import { NextApiHandlerWithDB } from '../utils/server';
import { redirectUrl } from '../utils/shared';

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
 * const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => { ... };
 * export default Manage;
 */
export const withSessionSsr = () =>
  withIronSessionSsr(sessionPropHandler, sessionConfig);

/**
 * Middleware die Authentifizierung und Berechtigung prüft.
 * Gibt `req` Session und ORM.
 * Bei Erfolg wird die Session erneuert.
 * @example
 * const routeHandler: NextApiHandler = async (req, res) => { const { session, db } = req; ... };
 * export default withSessionApi(routeHandler);
 */
export const withSessionApi = (handler: NextApiHandlerWithDB, page: Route) => {
  const authHandler: NextApiHandlerWithDB = async (req, res) => {
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

    const db = await getDatabaseConnection();

    if (db === null || db === undefined) {
      return error(res, 'Datenbank nicht verfügbar', 500);
    }

    const ldap = ldapClient;

    console.log(ldap);

    req.db = db;

    // fortfahren
    console.log(1);
    await handler(req, res);
    // todo req.db?.destroy();
    console.log('stop');
  };

  return withIronSessionApiRoute(authHandler, sessionConfig);
};
