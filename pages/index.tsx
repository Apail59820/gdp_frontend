import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import UserCard from '../src/components/UserCard/UserCard';
import ClientCard from '../src/components/ClientCard/ClientCard';

export default function Home() {
  const client = {clientName: 'eee', addressLine1: 'eeee', addressLine2: 'hieorze',postalCode: 59000, city: 'LILLE',country: 'France'  };
  const contact = [{contactName: 'hohih', phoneNumber1: 232432, phoneNumber2: 567567576, mail: 'fiozefio@gmail.com'}, 
  {contactName: 'DZEDEZ', phoneNumber1: 2342, phoneNumber2: 8888, mail: 'EEEE@gmail.com'},
  {contactName: 'EZZA', phoneNumber1: 2332321, phoneNumber2: 99999, mail: 'Efezfezez@gmail.com'},
];

  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '416px', height: '134px' }}>
          {/* <UserCard
            user={{
              first_name: 'Michel',
              last_name: 'Martin',
              role: 'Ingénieur',
              company: 'Diagobat',
              email: 'contact@client.fr',
            }}
          /> */}
          <ClientCard client={client} contacts={contact}></ClientCard>
        </div>
      </div>
    </>
  );
}
