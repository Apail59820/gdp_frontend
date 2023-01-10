import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { PageHeaderBanner } from '@projex/ui';
import ProjectCard from '../src/components/ProjectCard/ProjectCard';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Edgar Cresson" />
      {/* <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '416px', height: '172px' }}>
          <ProjectCard
            project={{
              name: 'Nom du projet',
              client_company_name: 'Nom du client',
            }}
            projectManagerName="Edgar"
            affairsCount={3}
            company="projex"
          />
        </div>
      </div> */}
    </>
  );
}
