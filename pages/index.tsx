import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Button, Container, Typography } from '@mui/material';
import { withSessionSsr } from '../lib/withSession';
import { Session } from '../types/api';
// import styles from "../styles/Home.module.css";

// Home: NextPage
const Home = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  console.log(user);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          onClick={() => {
            // wichtig: muss post sein, sonst löscht sich der cookie nicht
            axios.post('/api/session/logout').then(() => {
              router.push('/login');
            });
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

/*
onClick={() => {
          axios.get('/api/session/logout').then(() => {
            window.location.reload();
          });
        }}
*/

export const getServerSideProps = withSessionSsr<{ user: Session }>(async ({ req }) => {
  const { user } = req.session;

  if (user === undefined) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});

export default Home;
