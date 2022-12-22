import '../../../styles/globals.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { TopBar } from '@projex/ui';
import ProjectsList from '../components/Projects/ProjectsList';
import { Provider } from 'react-redux';
import configureStore from '../store/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Provider store={configureStore}>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Maïa</title>
      </Head>
      <header id="header">
        <TopBar
          items={[
            { label: 'Gestion de projet', href: '/href', active: true },
            { label: 'Catalogue des solutions alternatives', href: '/href', active: false },
          ]}
        />
        <ProjectsList/>
      </header>
      <main>
        {/* <aside>SideBar</aside> */}
        <Component {...pageProps} />
      </main>
      </Provider>
    </>
  );
}
