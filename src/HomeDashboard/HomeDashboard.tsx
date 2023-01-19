import React, { useState } from 'react';
import styles from './HomeDashboard.module.scss';
import { NewItemCard, QuickActionCard } from '@projex/ui';
import { PlusOutlined } from '@ant-design/icons';
import Grid from '../components/Grid/Grid';
import Section from '../components/Section/Section';
import { ProjectModel } from '../../models/ProjectModel';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import { CompanyEnum } from '../../models/CompanyEnum';

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
  const [displayQuickAccessSection, setDisplayQuickAccessSection] = useState<boolean>(true);

  return (
    <div className={styles.homeDashboard}>
      <Section
        title="Accès rapide"
        button={{
          label: `${displayQuickAccessSection ? 'Masquer' : 'Afficher'} l'accès rapide`,
          onClick: () => setDisplayQuickAccessSection((prev) => !prev),
        }}
      >
        {displayQuickAccessSection ? (
          <Grid>
            <QuickActionCard
              title="Créez un nouveau projet"
              button={{ label: 'Ajouter un projet', href: '/', icon: <PlusOutlined /> }} // TODO Handle link href
            >
              Créer un nouveau projet dés maintenant
            </QuickActionCard>
            <QuickActionCard
              title="Complétez votre profil"
              progress={PROFILE_PROGRESS_PERCENTAGE}
              button={{ label: 'Ajouter des informations', href: '/', icon: <PlusOutlined /> }} // TODO Handle link href
            >
              Remplissez votre profil pour profiter pleinement de toutes les fonctionnalités
            </QuickActionCard>
          </Grid>
        ) : null}
      </Section>
      <Section title="Mes projets" link={{ label: 'Voir tous les projets', href: '/' }}>
        <Grid>
          {CURRENT_USER_PROJECTS.map((project: ProjectModel) => (
            <ProjectCard key={project.id} project={project} projectManagerName={'Chef de projet'} />
          ))}
          {/* TODO Handle onClick */}
          <NewItemCard label="Nouveau projet" onClick={() => console.log('open modal ?')} />
        </Grid>
      </Section>
    </div>
  );
};

export default HomeDashboard;
