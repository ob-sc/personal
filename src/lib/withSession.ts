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

  if (user === undefined) {
    return {
      redirect: {
        // kann nicht unterscheiden ob expired oder einfach nur nicht angemeldet
        destination: '/login?no_auth=true',
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
    const { session, url } = req;
    const { error } = response(res);
    // nicht authentifiziert
    if (session.user === undefined) {
      // wenn kein login-Versuch, ohne auth auf andere Seite wird von withIronSessionSsr redirect abgefangen
      // deshalb die Annahme, dass ein Versuch von anderen Seiten mit abgelaufener Session sein müsste
      // (user ist schon auf der Seite -> Cookie läuft ab -> Request wenn user zurück ist -> kommt obwohl abgelaufen weil kein wechsel)
      if (url !== '/api/session') {
        // 419 kein "offizieller" Fehlercode, kommt von Laravel und bedeutet: Page Expired (CSRF Token is missing or expired)
        error('Session abgelaufen', 419);
        return;
      }
      // bei /api/session: 401
      error('Authentifizierung erforderlich', 401);
      return;
    }
    // wenn authentifiziert, Session erneuern
    session.save();
    // weiter wie next()
    handler(req, res);
  };

  return withIronSessionApiRoute(noAuth ? handler : authHandler, sessionConfig);
};
