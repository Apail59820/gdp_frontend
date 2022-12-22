import '../../../styles/globals.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SideBar, TopBar } from '@projex/ui';
import { TeamOutlined } from '@ant-design/icons';

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
        <TopBar
          items={[
            { label: 'Gestion de projet', href: '/href', active: true },
            { label: 'Catalogue des solutions alternatives', href: '/href', active: false },
          ]}
        />
      </header>
      <main id="main">
        <aside id="aside">
          <nav id="nav">
            <SideBar
              items={{
                head: [
                  {
                    label: 'Tous les projets',
                    icon: undefined,
                    href: '/',
                  },
                ],
                body: [
                  {
                    label: 'Facturation',
                    icon: undefined,
                    href: '/',
                  },
                  {
                    label: 'Équipes',
                    icon: <TeamOutlined />,
                    href: '/teams',
                  },
                  {
                    label: 'Fichiers',
                    icon: undefined,
                    href: '/',
                  },
                  {
                    label: 'Activités',
                    icon: undefined,
                    href: '/',
                  },
                  {
                    label: 'Satisfaction client',
                    icon: undefined,
                    href: '/',
                  },
                ],
                foot: [
                  {
                    label: 'Paramètres',
                    icon: undefined,
                    href: '/',
                  },
                ],
              }}
            />
          </nav>
        </aside>
        <div id="content">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
}
