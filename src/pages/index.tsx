import { InferGetServerSidePropsType as IPT } from 'next';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';

export const getServerSideProps = withSessionSsr();

// todo startseite ist für disponenten die eintragen-seite, verwaltung ohne berechtigungen einfach nur der eigene benutzer ohne menü, für verwaltung mit berechtigungen mal schauen

// Home: NextPage
function Home({ user }: IPT<typeof getServerSideProps>) {
  // const noHome = user.stations[0] === 0 && user.access < 1;
  return <Layout session={user}></Layout>;
}

export default Home;
