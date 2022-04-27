import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../src/lib/withSession';
import Layout from '../src/client/components/layout/Layout';
import NoStation from '../src/client/components/home/NoStation';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Home = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Layout session={user}>
    <NoStation />
  </Layout>
);

export default Home;
