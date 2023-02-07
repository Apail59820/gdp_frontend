import React from 'react';
import styles from './ProjectsWidget.module.scss';
import Link from 'next/link';
import { ManageItemCard } from '@projex/ui';
import { ProjectModel } from '../../../models/ProjectModel';
import Grid from '../Grid/Grid';
import ProjectCard from '../ProjectCard/ProjectCard';
import { Section } from '@projex/ui';

type Props = {
  projects: ProjectModel[];
  handleNewProjectClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ProjectsWidget = ({ projects, handleNewProjectClick }: Props) => {
  return (
    <Section title="Mes projets" link={{ label: 'Voir tous les projets', href: '/projects' }}>
      <Grid>
        {projects.map((project: ProjectModel) => (
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
