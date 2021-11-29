import Head from 'next/head';
import { Container } from '@mui/material';

export default function Custom404() {
  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontFamily: "'Cedarville Cursive', cursive", fontSize: '10rem' }}>404</div>
      </Container>
    </>
  );
}
