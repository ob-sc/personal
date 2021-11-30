import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../lib/withSession';
import Layout from '../components/layout/Layout';
import useRequest from '../hooks/useRequest';
import CenteredSpinner from '../components/common/CenteredSpinner';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useRequest({ url: '/api/directory' });
  console.log(data);
  return <Layout session={user}>{data ? 'geladen' : <CenteredSpinner />}</Layout>;
};

export default Manage;
