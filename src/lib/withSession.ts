import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
import { sessionConfig } from '../../config';
import { Session } from '../../types/api';

declare module 'iron-session' {
  interface IronSessionData {
    user?: Session;
  }
}

// default handler mit redirect
const sessionHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: Session }> = ({ req }) => {
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

// unter pages/api/
export const withSessionApi = (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, sessionConfig);

// unter pages/, kompatibel mit InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export const withSessionSsr = () => withIronSessionSsr(sessionHandler, sessionConfig);

/*
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, options);
}
*/
