// import "../styles/globals.css";
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../lib/createEmotionCache';
import { EmotionCache } from '@emotion/cache';
import { isDev } from '../lib/util';

// todo rausnehmen, wenn er über stdout oder stderror in die logs kommt
if (isDev()) {
  // eslint-disable-next-line no-console
  console.log(
    `%cDEV`,
    'font-size: 64px; font-weight: 600; font-family: sans-serif; color: #ffb300;text-shadow: 1px 1px #000, 2px 2px #100, 3px 3px #200, 4px 4px #300, 5px 5px #400, 6px 6px #500, 7px 7px #600, 8px 8px #700, 9px 9px #800, 10px 10px #900, 11px 11px #a00, 12px 12px #b00, 13px 13px #c00, 14px 14px #d00, 15px 15px #e00, 16px 16px #f00'
  );
} else {
  // eslint-disable-next-line no-console
  console.log(
    '%c STARCAR',
    'font-size: 64px; font-weight: 600; font-family: sans-serif; color: #feed01; text-shadow: 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, -1px -1px #000, -2px -2px #000, -3px -3px #000, -4px -4px #000, -5px -5px #000, -6px -6px #000, -7px -7px #000, -8px -8px #000'
  );
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>STARCAR Rollengespräch</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
