import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
import { sessionConfig } from '../../config';
import { ParsedUser } from '../../types/user';

declare module 'iron-session' {
  interface IronSessionData {
    user?: ParsedUser;
  }
}

// default handler mit redirect
const sessionPropHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: ParsedUser }> = ({ req }) => {
  const { user } = req.session;

  if (user === undefined) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

/**
 * Session wird vor Handler geprüft.
 * Gibt `req` auch das Session-Objekt.
 * Bei Erfolg wird session erneuert.
 * @example
 * const userHandler: NextApiHandler = async (req, res) => { const { session } = req; ... };
 * export default withSessionApi(userHandler);
 */
export const withSessionApi = (handler: NextApiHandler, noAuth?: boolean) => {
  const authHandler: NextApiHandler = (req, res) => {
    const { session } = req;
    if (session.user?.id === undefined) {
      res.status(401).json({ message: 'Nicht eingeloggt' });
      return;
    }
    session.save();
    handler(req, res);
  };

  return withIronSessionApiRoute(noAuth ? handler : authHandler, sessionConfig);
};

/**
 * Redirect ohne Session, sonst Session als Prop.
 * Kompatibel mit `InferGetServerSidePropsType`
 * @example
 * export const getServerSideProps = withSessionSsr();
 * const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => { ... };
 * export default Manage;
 */
export const withSessionSsr = () => withIronSessionSsr(sessionPropHandler, sessionConfig);
