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

/*
{crent ? (
  <>
    <Typography variant="h2">C-Rent</Typography>
    <DataList
      data={[
        { key: 'Benutzer', value: crent.username },
        { key: 'Personalnummer', value: crent.personell_id },
        { key: 'Kassenkonto', value: crent.register_id },
      ]}
    />
  </>
) : null}
*/
