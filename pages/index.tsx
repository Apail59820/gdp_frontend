import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import UserCard from '../src/components/UserCard/UserCard';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '416px', height: '134px' }}>
          <UserCard
            user={{
              first_name: 'Michel',
              last_name: 'Martin',
              role: 'Ingénieur',
              company: 'Diagobat',
              email: 'contact@client.fr',
            }}
          />
        </div>
      </div>
    </>
  );
}
