import React from 'react';
import styles from './ProjectsWidget.module.scss';
import Link from 'next/link';
import { ManageItemCard } from '@projex/ui';
import Grid from '../Grid/Grid';
import ProjectCard from '../ProjectCard/ProjectCard';
import { Section } from '@projex/ui';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';

type Props = {
  projects: GdpProjectsModel[];
  handleNewProjectClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ProjectsWidget = ({ projects, handleNewProjectClick }: Props) => {
  return (
    <Section title="Mes projets" link={{ label: 'Voir tous les projets', href: '/projects' }}>
      <Grid>
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <ProjectCard project={project} projectManagerName={'Chef de projet'} />
          </Link>
        ))}
        <div className={styles.manageItemCardContainer}>
          <ManageItemCard label="Nouveau projet" onClick={handleNewProjectClick} />
        </div>
      </Grid>
    </Section>
  );
};

export default ProjectsWidget;
