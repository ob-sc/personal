import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
import { sessionConfig } from '../../config';
import { ParsedUser } from '../../types/user';
import response from '../server/response';

declare module 'iron-session' {
  interface IronSessionData {
    user?: ParsedUser;
  }
}

// ssr handler mit redirect
const sessionPropHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: ParsedUser }> = ({ req }) => {
  const { user } = req.session;

  console.log(req.url);

  if (user === undefined) {
    const destination =
      req.url && req.url !== '/' ? `/login?redirect=${encodeURIComponent(req.url)}` : '/login';

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
export const withSessionSsr = () => withIronSessionSsr(sessionPropHandler, sessionConfig);

/**
 * Middleware die auf login prüft (session existiert).
 * Gibt `req` auch das Session-Objekt.
 * Bei Erfolg wird session erneuert.
 * @example
 * const routeHandler: NextApiHandler = async (req, res) => { const { session } = req; ... };
 * export default withSessionApi(routeHandler);
 */
export const withSessionApi = (handler: NextApiHandler, noAuth?: boolean) => {
  const authHandler: NextApiHandler = (req, res) => {
    const { session } = req;
    const { error } = response(res);
    // nicht authentifiziert
    if (session.user === undefined) {
      error('Authentifizierung erforderlich', 403);
      return;
    }
    // wenn authentifiziert, Session erneuern
    session.save();
    // weiter wie next()
    handler(req, res);
  };

  return withIronSessionApiRoute(noAuth ? handler : authHandler, sessionConfig);
};
