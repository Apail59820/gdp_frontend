import React from 'react';
import styles from './HomeDashboard.module.scss';
import { PlusOutlined } from '@ant-design/icons';
import { GdpProjectsModel } from '../../models/GdPModels';
import { GdpProjectStatusEnum, GdpProjectTypesEnum } from '../../models/GestionDeProjets/GdpProjectsModel';
import { ManageItemCard, QuickActionCard } from '@projex/ui';
import Grid from '../components/Grid/Grid';
import QuickAccessWidget from '../components/QuickAccessWidget/QuickAccessWidget';
import ProjectsWidget from '../components/ProjectsWidget/ProjectsWidget';

const PROFILE_PROGRESS_PERCENTAGE = 65; // TODO

// TODO
const CURRENT_USER_PROJECTS: Partial<GdpProjectsModel>[] = [
  {
    id: '1',
    name: 'Nom du projet',
    client_company_name: 'Nom du client',
    client_info: 'frefer',
    address: 'hrthert',
    zip_code: 'gtrgtr',
    city: 'hyhytyt',
    country: 'gtgrtgtr',
    // image: undefined,
    status: GdpProjectStatusEnum.ACTIVE,
    project_type: GdpProjectTypesEnum.CO_TRAITANCE,
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
        projects={CURRENT_USER_PROJECTS as any}
        handleNewProjectClick={() => console.log('open modal ?')}
      />
    </div>
  );
};

export default HomeDashboard;
