import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from 'next';
import { sessionConfig } from '../../config';
import { accessConstants } from '../../config/constants';
import { ParsedUser, Route } from '../../types/server';
import getDatabaseConnection from '../server/database';
import { error } from '../server/response';
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
 * const routeHandler: NextApiHandler = async (req, res) => { const { session } = req; ... };
 * export default withSessionApi(routeHandler);
 */
export const withSessionApi = (handler: NextApiHandler, page: Route) => {
  const authHandler: NextApiHandler = async (req, res) => {
    if (page !== 'sessions') {
      const { session } = req;
      // nicht authentifiziert
      if (session.user === undefined) {
        error(res, 'Authentifizierung erforderlich', 401);
        return;
      }

      // wenn authentifiziert, Session erneuern
      await session.save();

      // Berechtigung prüfen
      const { hasAccess } = accessConstants(session.user.access, page);

      if (!hasAccess) return error(res, 'Keine Berechtigung', 403);
    }

    const db = await getDatabaseConnection();

    req.db = db;

    // fortfahren
    handler(req, res);

    req.db.destroy();
  };

  return withIronSessionApiRoute(authHandler, sessionConfig);
};
