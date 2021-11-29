import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../lib/withSession';
import Layout from '../components/layout/Layout';
// import styles from "../styles/Home.module.css";

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Layout session={user}>Lirum larum löffelstiel</Layout>;
};

export default Manage;
