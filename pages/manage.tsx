import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../src/lib/withSession';
import Layout from '../src/client/components/layout/Layout';
import useRequest from '../src/client/hooks/useRequest';
import CenteredSpinner from '../src/client/components/common/CenteredSpinner';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useRequest({ url: '/api/users' });

  console.log(data);
  return <Layout session={user}>{data ? 'geladen' : <CenteredSpinner />}</Layout>;
};

export default Manage;
