import { InferGetServerSidePropsType as IPT } from 'next';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import { postLdapUser } from 'src/modules/ldap/api';
import Button from 'src/common/components/Button';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
function Home({ user }: IPT<typeof getServerSideProps>) {
  // const noHome = user.stations[0] === 0 && user.access < 1;
  return (
    <Layout session={user}>
      <Button
        onClick={async () => {
          const result = await postLdapUser({});
          console.log(result);
        }}
      />
    </Layout>
  );
}

export default Home;
