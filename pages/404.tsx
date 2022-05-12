import { Container } from '@mui/material';
import Layout from 'client/components/layout/Layout';

function Custom404() {
  return (
    <Layout>
      <Container
        sx={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: "'Cedarville Cursive', cursive",
            fontSize: '10rem',
          }}
        >
          404
        </div>
      </Container>
    </Layout>
  );
}

export default Custom404;
