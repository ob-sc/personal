import Head from 'next/head';
import { Container } from '@mui/material';
import Layout from 'src/client/components/layout/Layout';

// Cedarville soll nur hier für 404 geladen werden

function Custom404() {
  return (
    <Layout>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cedarville+Cursive"
          rel="stylesheet"
        />
      </Head>
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
