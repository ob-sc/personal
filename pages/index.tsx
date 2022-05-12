import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from 'lib/withSession';
import NoStation from 'client/components/home/NoStation';
import Layout from 'client/components/layout/Layout';

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

// todo anderer komponent wtf ist nostation
