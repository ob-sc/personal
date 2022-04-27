import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../src/lib/withSession';
import Layout from '../src/client/components/layout/Layout';
import NoStation from '../src/client/components/home/NoStation';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const noHome = user.stations[0] === 0 && user.access < 1;
  return (
    <Layout session={user}>
      <NoStation />
    </Layout>
  );
}

export default Home;
