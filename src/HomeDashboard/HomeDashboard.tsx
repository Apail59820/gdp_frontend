import React from 'react';
import styles from './HomeDashboard.module.scss';
import { PlusOutlined } from '@ant-design/icons';
import { GdpProjectModel } from '../../models/GestionDeProjets/GdpProjectModel';
import { ManageItemCard, QuickActionCard } from '@projex/ui';
import Grid from '../components/Grid/Grid';
import QuickAccessWidget from '../components/QuickAccessWidget/QuickAccessWidget';
import ProjectsWidget from '../components/ProjectsWidget/ProjectsWidget';

const PROFILE_PROGRESS_PERCENTAGE = 65; // TODO

// TODO
const CURRENT_USER_PROJECTS: Partial<GdpProjectModel>[] = [
  {
    id: '1',
    name: 'Nom du projet',
    client_company_name: 'Nom du client',
    client_info: undefined,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    // image: undefined,
    status: undefined,
    project_type: undefined,
    company_entity: 1,
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
    // image: undefined,
    status: undefined,
    project_type: undefined,
    company_entity: 1,
    affairs: undefined,
  },
];

const HomeDashboard = () => {
  return (
    <div className={styles.homeDashboard}>
      <QuickAccessWidget>
        <Grid>
          {/*{CURRENT_USER_PROJECTS.map((project: GdpProjectModel) => (*/}
          {/*  <Link href={`/projects/${project.id}`}>*/}
          {/*    <ProjectCard key={project.id} project={project} projectManagerName={'Chef de projet'} />*/}
          {/*  </Link>*/}
          {/*))}*/}
          {/* TODO Handle onClick */}
          <ManageItemCard label="Nouveau projet" onClick={() => console.log('open modal ?')} />
          <QuickActionCard
            title="Créez un nouveau projet"
            button={{ label: 'Ajouter un projet', onClick: () => console.log('open modal ?'), icon: <PlusOutlined /> }}
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
            }}
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
