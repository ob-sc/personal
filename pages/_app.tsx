// import "../styles/globals.css";
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { EmotionCache } from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from 'config/theme';
import { MobileContextProvider } from 'client/context/MobileContext';
import { createEmotionCache } from 'utils/client';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>STARCAR SCP</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <MobileContextProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </MobileContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
