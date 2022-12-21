import '../../../styles/globals.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
// import { TopBar } from '@projex/ui';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Maïa</title>
      </Head>
      <header id="header">
        {/* <TopBar
          items={[
            { label: 'Gestion de projet', href: '/href', active: true },
            { label: 'Catalogue des solutions alternatives', href: '/href', active: false },
          ]}
        /> */}
      </header>
      <main>
        {/* <aside>SideBar</aside> */}
        <Component {...pageProps} />
      </main>
    </>
  );
}
