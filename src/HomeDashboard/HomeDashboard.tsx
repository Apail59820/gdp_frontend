import React from 'react';
import Link from 'next/link';
import styles from './HomeDashboard.module.scss';
import { PlusOutlined } from '@ant-design/icons';
import { ProjectModel } from '../../models/ProjectModel';
import { CompanyEnum } from '../../models/CompanyEnum';
import { ManageItemCard, QuickActionCard } from '@projex/ui';
import Section from '../components/Section/Section';
import Grid from '../components/Grid/Grid';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import QuickAccessWidget from '../components/QuickAccessWidget/QuickAccessWidget';
import ProjectsWidget from '../components/ProjectsWidget/ProjectsWidget';

const PROFILE_PROGRESS_PERCENTAGE = 65; // TODO

// TODO
const CURRENT_USER_PROJECTS: ProjectModel[] = [
  {
    id: '1',
    name: 'Nom du projet',
    client_company_name: 'Nom du client',
    client_info: undefined,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    status: undefined,
    project_type: undefined,
    company_entity: CompanyEnum.PROJEX,
    affairs: undefined,
  },
  {
    id: '2',
    name: 'Nom du projet',
    client_company_name: 'Nom du client',
    client_info: undefined,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    status: undefined,
    project_type: undefined,
    company_entity: CompanyEnum.PROJEX,
    affairs: undefined,
  },
];

const HomeDashboard = () => {
  return (
    <div className={styles.homeDashboard}>
      <QuickAccessWidget>
        <Grid>
          <QuickActionCard
            title="Créez un nouveau projet"
            button={{ label: 'Ajouter un projet', onClick: () => console.log('open modal ?'), icon: <PlusOutlined /> }} // TODO Handle link href
          >
            Créer un nouveau projet dés maintenant
          </QuickActionCard>
          <QuickActionCard
            title="Complétez votre profil"
            progress={PROFILE_PROGRESS_PERCENTAGE}
            button={{
              label: 'Ajouter des informations',
              onClick: () => console.log('open modal ?'),
              icon: <PlusOutlined />,
            }} // TODO Handle link href
          >
            Remplissez votre profil pour profiter pleinement de toutes les fonctionnalités
          </QuickActionCard>
        </Grid>
      </QuickAccessWidget>
      <ProjectsWidget
        projects={CURRENT_USER_PROJECTS || []}
        handleNewProjectClick={() => console.log('open modal ?')}
      />
    </div>
  );
};

export default HomeDashboard;
