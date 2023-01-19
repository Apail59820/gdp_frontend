import Image from 'next/image';
import styles from '../styles/Home.module.css';

import ClientCard from '../src/components/ClientCard/ClientCard';
import { UserModel } from '../models/UserModels';
import { ProjectModel } from '../models/ProjectModel';
import PageHeaderBanner from '../src/components/PageHeaderBanner/PageHeaderBanner';

export default function Home() {
  const client: ProjectModel = {
    client_company_name: 'eee',
    address: 'eeee',
    zip_code: '59000',
    city: 'LILLE',
    country: 'France',
  };
  const contact: UserModel[] = [
    { first_name: 'DZEDEZ', last_name: 'frzefze', number: '232432', email: 'fiozefio@gmail.com' },
    { first_name: 'DZEDEZ', last_name: 'frzefze', number: '2342', email: 'EEEE@gmail.com' },
    { first_name: 'EZZA', last_name: ' regert', number: '2332321', email: 'grgerg@gmail.com' },
    { first_name: 'EZAEAZ', last_name: 'jyuy', number: '576', email: 'gggg@gmail.com' },
    { first_name: 'fezfze', last_name: 'frzefze', number: '789', email: 'fiozefio@gmail.com' },
    { first_name: 'gggg', last_name: 'fzefze', number: '2342', email: 'EEEE@gmail.com' },
    { first_name: 'htyhty', last_name: 'jyujuy', number: '98709', email: 'Efezfezez@gmail.com' },
    { first_name: 'cccc', last_name: 'ezz', number: '476547', email: 'azzzz@gmail.com' },
    { first_name: 'zzzz', last_name: 'nfgdnbdgf', number: '999', email: 'fiozefio@gmail.com' },
    { first_name: 'loliolo', last_name: 'ltkrekop', number: '2342', email: 'EEEE@gmail.com' },
    { first_name: 'aaaa', last_name: 'frzefze', number: '2332321', email: 'Efezfezez@gmail.com' },
    { first_name: 'wwwww', last_name: 'moptore', number: '222', email: 'Efezfezez@gmail.com' },
  ];

  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '640px', height: '192px' }}>
          <ClientCard client={client} users={contact} maxIcon={2} clientPageHref="/clients" />
        </div>
      </div>
    </>
  );
}
