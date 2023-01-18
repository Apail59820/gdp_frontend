import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageHeaderBanner from '../src/components/PageHeaderBanner/OLDPageHeaderBanner';
import AffairCard from '../src/components/AffairCard/AffairCard';
import { MouseEvent } from 'react';
import CollaboratorCard from '../src/components/CollaboratorCard/CollaboratorCard';
import FilesCard from '../src/components/FilesCard/FilesCard';
import ManagerCard from '../src/components/ManagerCard/ManagerCard';
import PhaseCard from '../src/components/PhaseCard/PhaseCard';
import { PhaseStatusEnum } from '../models/PhaseModel';
import ProgressStatusMessage from '../src/components/ProgressStatusMessage/ProgressStatusMessage';
import ProjectCard from '../src/components/ProjectCard/ProjectCard';

export default function Home() {
  return (
    <>
      <PageHeaderBanner title="Bonjour, Olivier Le Baron" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
        <div style={{ width: '416px', height: '172px' }}>
          <AffairCard
            affair={{
              id: undefined,
              user_created: undefined,
              date_created: undefined,
              user_updated: undefined,
              date_updated: undefined,
              name: undefined,
              client_company_name: undefined,
              client_info: undefined,
              internal_company: undefined,
              address: undefined,
              zip_code: undefined,
              city: undefined,
              country: undefined,
              image: undefined,
              pythagore_ids: undefined,
              status: undefined,
              user_access: undefined,
              affairs_satisfaction: undefined,
            }}
            onKebabMenuClick={() => console.log('Ok')}
          />
        </div>
        <div style={{ width: '416px', height: '134px' }}>
          <CollaboratorCard
            user={{
              id: undefined,
              user_created: undefined,
              date_created: undefined,
              user_updated: undefined,
              date_updated: undefined,
              first_name: 'Michel',
              last_name: 'Martin',
              email: 'contact@client.fr',
              password: undefined,
              avatar: undefined,
              location: undefined,
              title: undefined,
              description: undefined,
              preferences_divider: undefined,
              language: undefined,
              theme: undefined,
              tfa_secret: undefined,
              admin_divider: undefined,
              status: undefined,
              role: 'Ingénieur',
              token: undefined,
              last_page: undefined,
              last_access: undefined,
              company: 'diagobat',
              number: undefined,
              affairs: undefined,
              web_link: undefined,
              cgu: undefined,
              email_notifications: undefined,
              showDocumentation: undefined,
              directus_files_avatar_id: undefined,
            }}
            onKebabMenuClick={function (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
        <div style={{ width: '192px', height: '192px' }}>
          <FilesCard asset={{ title: 'Titre' }} />
        </div>
        <div style={{ width: '640px', height: '192px' }}>
          <ManagerCard
            user={{
              id: undefined,
              user_created: undefined,
              date_created: undefined,
              user_updated: undefined,
              date_updated: undefined,
              first_name: undefined,
              last_name: undefined,
              email: undefined,
              password: undefined,
              avatar: undefined,
              location: undefined,
              title: undefined,
              description: undefined,
              preferences_divider: undefined,
              language: undefined,
              theme: undefined,
              tfa_secret: undefined,
              admin_divider: undefined,
              status: undefined,
              role: undefined,
              token: undefined,
              last_page: undefined,
              last_access: undefined,
              company: undefined,
              number: undefined,
              affairs: undefined,
              web_link: undefined,
              cgu: undefined,
              email_notifications: undefined,
              showDocumentation: undefined,
              directus_files_avatar_id: undefined,
            }}
            onKebabMenuClick={function (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
        <div style={{ width: '416px', height: '134px' }}>
          <PhaseCard
            phase={{
              id: undefined,
              user_created: undefined,
              date_created: undefined,
              user_updated: undefined,
              date_updated: undefined,
              affairs_id: undefined,
              name: "Nom de l'étape",
              status: PhaseStatusEnum.COMPLETED,
              order: undefined,
              trigger_survey: undefined,
              description: "Mini description de l'étape",
            }}
            onKebabMenuClick={function (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
        <ProgressStatusMessage status={PhaseStatusEnum.COMPLETED} />
        <div style={{ width: '416px', height: '134px' }}>
          <ProjectCard
            project={{
              id: undefined,
              name: undefined,
              client_company_name: undefined,
              client_info: undefined,
              address: undefined,
              zip_code: undefined,
              city: undefined,
              country: undefined,
              image: undefined,
              status: undefined,
              project_type: undefined,
              company_entity: undefined,
              affairs: undefined,
            }}
            projectManagerName={''}
          />
        </div>
      </div>
    </>
  );
}
