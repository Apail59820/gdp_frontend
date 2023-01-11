import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import ManagerCard from '../src/components/ManagerCard/ManagerCard';
import CollaboratorCard from '../src/components/CollaboratorCard/CollaboratorCard';

export default function Home() {
  const USER = {
    first_name: 'Edgar',
    last_name: 'Cresson',
    role: 'Développeur',
    company: 'Diagobat',
    email: 'e.c@g-p.fr',
  };

  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '640px', height: '192px', marginBottom: '50px' }}>
          <ManagerCard user={USER} />
        </div>
        <div style={{ width: '416px', height: '134px', marginBottom: '50px' }}>
          <CollaboratorCard user={USER} />
        </div>
      </div>
    </>
  );
}
