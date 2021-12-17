import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../src/lib/withSession';
import Layout from '../src/client/components/layout/Layout';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Home = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const ka = 'Home';
  return <Layout session={user}>{ka}</Layout>;
};

export default Home;
