import type { NextPage } from 'next';
import { Box, Button, Container, Typography } from '@mui/material';
import Link from '../components/common/Link';
// import styles from "../styles/Home.module.css";

const Home: NextPage = () => (
  <Container maxWidth="md">
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        hi
      </Typography>
      <Button component={Link} href="/about">
        Link
      </Button>
    </Box>
  </Container>
);

export default Home;
