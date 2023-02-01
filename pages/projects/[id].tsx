import React from 'react';
import styles from '../../styles/Project.module.scss';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { CompanyEnum } from '../../models/CompanyEnum';
import { ProjectModel } from '../../models/ProjectModel';
import { AffairModel } from '../../models/AffairModel';
import { UserModel } from '../../models/UserModels';
import { PythagoreFactureModel } from '../../models/PythagoreFactureModel';
import { AssetModel } from '../../models/AssetModel';
import { Breadcrumb, QuickActionCard } from '@projex/ui';
import type { Activity } from '@projex/ui/dist/components/molecules/RecentActivities/RecentActivities';
import Grid from '../../src/components/Grid/Grid';
import PageHeaderBanner from '../../src/components/PageHeaderBanner/PageHeaderBanner';
import QuickAccessWidget from '../../src/components/QuickAccessWidget/QuickAccessWidget';
import AffairsWidget from '../../src/components/AffairsWidget/AffairsWidget';
import ClientTeamWidget from '../../src/components/ClientTeamWidget/ClientTeamWidget';
import ProjectTeamWidget from '../../src/components/ProjectTeamWidget/ProjectTeamWidget';
import ActivitiesWidget from '../../src/components/ActivitiesWidget/ActivitiesWidget';
import BillingWidget from '../../src/components/BillingWidget/BillingWidget';
import FilesWidget from '../../src/components/FilesWidget/FilesWidget';
import StatisticsWidget from '../../src/components/StatisticsWidget/StatisticsWidget';
import type { Statistic } from '../../src/components/StatisticsCard/StatisticsCard';

// TODO
const PROJECT_BY_ID: ProjectModel = {
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
  company_entity: CompanyEnum.DIAGOBAT,
  affairs: undefined,
};

const PROJECT_PROGRESS_PERCENTAGE: number = 65;

const PROJECT_AFFAIRS: AffairModel[] = [
  {
    id: '1',
    user_created: undefined,
    date_created: undefined,
    user_updated: undefined,
    date_updated: undefined,
    name: "Nom de l'affaire",
    client_company_name: undefined,
    client_info: undefined,
    internal_company: CompanyEnum.DIAGOBAT,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    pythagore_ids: undefined,
    status: undefined,
    user_access: undefined,
    affairs_satisfaction: undefined,
  },
  {
    id: '2',
    user_created: undefined,
    date_created: undefined,
    user_updated: undefined,
    date_updated: undefined,
    name: "Nom de l'affaire",
    client_company_name: undefined,
    client_info: undefined,
    internal_company: CompanyEnum.DIAGOBAT,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    pythagore_ids: undefined,
    status: undefined,
    user_access: undefined,
    affairs_satisfaction: undefined,
  },
];

const CLIENT_TEAM: UserModel[] = [
  {
    id: '1',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '1',
    email: 'email',
    role: 'Développeur',
    company: CompanyEnum.AMEXIA,
  },
  {
    id: '2',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '2',
    email: 'email',
  },
  {
    id: '3',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '3',
    email: 'email',
  },
  {
    id: '4',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '4',
    email: 'email',
  },
  {
    id: '5',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '5',
    email: 'email',
  },
  {
    id: '6',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '6',
    email: 'email',
  },
];
const PROJECT_TEAM: UserModel[] = [
  {
    id: '1',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '1',
    email: 'email',
    role: 'Développeur',
    company: CompanyEnum.AMEXIA,
  },
  {
    id: '2',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '2',
    email: 'email',
  },
  {
    id: '3',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '3',
    email: 'email',
  },
  {
    id: '4',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '4',
    email: 'email',
  },
  {
    id: '5',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '5',
    email: 'email',
  },
  {
    id: '6',
    first_name: 'first_name',
    last_name: 'last_name',
    number: '6',
    email: 'email',
  },
];

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
const INVOICES: PythagoreFactureModel[] = [
  {
    num_facture: '2021-11-011',
    etatreglt_facture: 'Reglee',
    statut_facture: 'Echue',
    date_echeance_facture: '2023-01-29',
  },
  {
    num_facture: '2021-11-012',
    etatreglt_facture: 'NonReglee',
    statut_facture: 'NonEchue',
    date_echeance_facture: new Date().toDateString(),
  },
  {
    num_facture: '2021-11-013',
    etatreglt_facture: 'NonReglee',
    statut_facture: 'Echue',
    date_echeance_facture: '2023-01-29',
  },
];

const FILES: AssetModel[] = [
  {
    id: '1',
    title: 'Titre 1',
    type: 'png',
    uploaded_on: '2023-01-31',
  },
  {
    id: '1',
    title: 'Titre 2',
    type: 'pdf',
    uploaded_on: '2022-02-28',
  },
  {
    id: '1',
    title: 'Titre 3',
    type: 'jpg',
    uploaded_on: '2022-07-21',
  },
  {
    id: '1',
    title: 'Titre 1',
    type: 'png',
    uploaded_on: '2023-01-31',
  },
  {
    id: '1',
    title: 'Titre 2',
    type: 'pdf',
    uploaded_on: '2022-02-28',
  },
  {
    id: '1',
    title: 'Titre 3',
    type: 'jpg',
    uploaded_on: '2022-07-21',
  },
];
const STATISTICS: Statistic[] = [
  { label: 'Label 1 ', percentage: 65 },
  { label: 'Label 2', percentage: 65 },
];

const Project = () => {
  return (
    <>
      <PageHeaderBanner project={PROJECT_BY_ID} onManageThumbnailClick={() => console.log('open modal ?')} />
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
            <ProjectTeamWidget
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
    </>
  );
};

export default Project;
