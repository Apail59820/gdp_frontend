import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      {/* <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '192px', height: '192px' }}>
          <FilesCard affair={{ name: 'FichierFichierFichierFichierFichier' }} />
        </div>
      </div> */}
    </>
  );
}
