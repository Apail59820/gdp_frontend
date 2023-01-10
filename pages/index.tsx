import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import ProjectCard from '../src/components/ProjectCard/ProjectCard';
import { CompanyEntity } from '../models/ProjectModel';
import AffairCard from '../src/components/AffairCard/AffairCard';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      {/* <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '416px', minHeight: '172px' }}>
          <AffairCard affair={{ name: "Nom de l'affaire", internal_company: 'diagobat' }} />
        </div>
      </div> */}
    </>
  );
}
