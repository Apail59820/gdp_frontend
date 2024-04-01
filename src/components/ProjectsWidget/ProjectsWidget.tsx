import React from 'react';
import styles from './ProjectsWidget.module.scss';
import Link from 'next/link';
import { ManageItemCard } from 'projex-ui';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import Grid from '../Grid/Grid';
import ProjectCard from '../ProjectCard/ProjectCard';
import { Section } from 'projex-ui';
import { LoadingOutlined } from '@ant-design/icons';
import {useRouter} from "next/router";

type Props = {
  projects: Partial<GdpProjectsModel>[];
  isLoading?: boolean;
  handleNewProjectClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ProjectsWidget = ({ projects, isLoading = false, handleNewProjectClick }: Props) => {

  const router = useRouter();
  const onShowMyProjectsClick = () => {
    router.push('/projects?manualGlobalFilters=myProjects')
  }
  return (
    <Section title="Mes projets" button={{label: 'Voir tous les projets', onClick:onShowMyProjectsClick}}>
      <Grid>
        {isLoading ? (
          <LoadingOutlined  />
        ) : (
          projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <ProjectCard project={project} projectManagerName={'Chef de projet'} />
            </Link>
          ))
        )}
        <div className={styles.manageItemCardContainer}>
          <ManageItemCard label="Nouveau projet" onClick={handleNewProjectClick} />
        </div>
      </Grid>
    </Section>
  );
};

export default ProjectsWidget;
