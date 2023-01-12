import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import InformationsSection from '../src/components/InformationsSection';
import { CompanyEnum } from '../models/CompanyEnum';

export default function Home() {
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
        <InformationsSection
          informations={{
            image: undefined,
            clientName: '',
            projetManager: '',
            numberOfAffairs: undefined,
            company: CompanyEnum.GROUPE_PROJEX,
          }}
        />
      </div>
    </>
  );
}
