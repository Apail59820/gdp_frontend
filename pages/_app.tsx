import '../../../styles/globals.css';
import type { AppProps } from 'next/app';
import { TopBar } from '@projex/ui';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Maïa</title>
      </Head>
      <header>
        <TopBar />
      </header>
      <main>
        <nav>Navigation</nav>
        <Component {...pageProps} />
      </main>
    </>
  );
}
