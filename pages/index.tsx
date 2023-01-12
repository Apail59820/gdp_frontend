import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      {/* <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '416px', height: '172px', marginBottom: '50px' }}>
          <PhaseCard
            phase={{
              name: 'Nom de l’étape',
              description: "Mini description de l'étape",
              status: PhaseStatusEnum.Completed,
            }}
            onKebabMenuClick={() => console.log('click 2')}
          />
        </div>
      </div> */}
    </>
  );
}
