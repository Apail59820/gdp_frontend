import React from 'react';
import styles from '../../../styles/Project.module.scss';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, QuickActionCard } from '@projex/ui';
import type { Activity } from '@projex/ui/dist/components/molecules/RecentActivities/RecentActivities';
import Grid from '../../../src/components/Grid/Grid';
import PageHeaderBanner from '../../../src/components/PageHeaderBanner/PageHeaderBanner';
import QuickAccessWidget from '../../../src/components/QuickAccessWidget/QuickAccessWidget';
import AffairsWidget from '../../../src/components/AffairsWidget/AffairsWidget';
import ClientTeamWidget from '../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import ActivitiesWidget from '../../../src/components/ActivitiesWidget/ActivitiesWidget';
import BillingWidget from '../../../src/components/BillingWidget/BillingWidget';
import FilesWidget from '../../../src/components/FilesWidget/FilesWidget';
import StatisticsWidget from '../../../src/components/StatisticsWidget/StatisticsWidget';
import type { Statistic } from '../../../src/components/StatisticsCard/StatisticsCard';

// TODO
const PROJECT_BY_ID: any = {
  id: '1',
  name: 'Nom du projet',
  client_company_name: 'Nom du client',
  client_info: undefined,
  address: undefined,
  zip_code: undefined,
  city: undefined,
  country: undefined,
  image: 'ok',
  status: undefined,
  project_type: undefined,
  company_entity: 'oui',
  affairs: undefined,
};

const PROJECT_PROGRESS_PERCENTAGE: number = 65;

const PROJECT_AFFAIRS: any[] = [];

const CLIENT_TEAM: any[] = [];
const PROJECT_TEAM: any[] = [];

const ACTIVITIES: Activity[] = [
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
];
const INVOICES: any[] = [];

const FILES: any[] = [];
const STATISTICS: Statistic[] = [
  { label: 'Label 1 ', percentage: 65 },
  { label: 'Label 2', percentage: 65 },
];

const Project = () => {
  return (
    <div className="page">
      <PageHeaderBanner data={PROJECT_BY_ID} />
      <div className={styles.projectPage}>
        <Breadcrumb dynamicRoutesLabel={[PROJECT_BY_ID.name!]} />
        <h1 className={styles.title}>Le projet</h1>
        <QuickAccessWidget>
          <Grid>
            <QuickActionCard
              title="Créez une nouvelle affaire"
              button={{
                label: 'Ajouter une affaire',
                icon: <PlusOutlined />,
                onClick: () => console.log('open modal ?'),
              }}
            >
              Vous pouvez désormais ajouter une affaire au projet afin d&apos;en suivre l&apos;évolution et la
              facturation
            </QuickActionCard>
            <QuickActionCard
              title="Facturation"
              button={{
                label: 'Configurer la facturation',
                icon: <EditOutlined />,
                onClick: () => console.log('open modal ?'),
              }}
            >
              Vous pouvez associer les numéros Pythagore aux affaires correspondantes
            </QuickActionCard>
            <QuickActionCard title="Complétez le projet" progress={PROJECT_PROGRESS_PERCENTAGE}>
              Remplissez votre profil pour profiter pleinement de toutes les fonctionnalités
            </QuickActionCard>
          </Grid>
        </QuickAccessWidget>
        <AffairsWidget affairs={PROJECT_AFFAIRS || []} onNewAffairClick={() => console.log('open modal ?')} />
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={CLIENT_TEAM || []}
              clientCompany={PROJECT_BY_ID}
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              users={PROJECT_TEAM || []}
              companyEntity={PROJECT_BY_ID.company_entity!}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <ActivitiesWidget activities={ACTIVITIES || []} />
            <BillingWidget invoices={INVOICES || []} onConfigureBillingClick={() => console.log('open modal ?')} />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <FilesWidget files={FILES || []} onNewFileClick={() => console.log('open modal ?')} />
            <StatisticsWidget statistics={STATISTICS || []} onNewStatisticClick={() => console.log('open modal ?')} />
          </Grid>
        </section>
      </div>
    </div>
  );
};

export default Project;
