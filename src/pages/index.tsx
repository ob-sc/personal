import { InferGetServerSidePropsType as IPT } from 'next';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
function Home({ user }: IPT<typeof getServerSideProps>) {
  // const noHome = user.stations[0] === 0 && user.access < 1;
  return <Layout session={user}></Layout>;
}

export default Home;
