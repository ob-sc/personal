import { InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import { Box, Button, Container, Typography } from '@mui/material';
import { withSessionSsr } from '../lib/withSession';
import { Session } from '../types/jacando';
// import styles from "../styles/Home.module.css";

// Home: NextPage
const Home = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Container maxWidth="md">
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        Hi {user.firstName}
      </Typography>
      <Button
        onClick={() => {
          axios.get('/api/session/logout').then(() => {
            window.location.href = '/';
          });
        }}
      >
        Logout
      </Button>
    </Box>
  </Container>
);

export const getServerSideProps = withSessionSsr<{ user: Session }>(async ({ req }) => {
  const { user } = req.session;

  if (user === undefined) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }

  return {
    props: { user },
  };
});

export default Home;
