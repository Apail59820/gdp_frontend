import React from 'react';
import styles from './ProjectCard.module.scss';
import { ShadowCard } from '@projex/ui';
import type { ProjectModel } from '../../../models/ProjectModel';
import img from '../../../public/project-image.png';
import logoProjex from '../../../public/logo-projex.svg';

type Props = {
  project: ProjectModel;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <ShadowCard>
      <div className={styles.projectCard}>
        <img
          className={styles.image}
          src={project.image || img.src}
          alt={`Image illustrant le projet ${project.name}`}
        />
        <section className={styles.content}>
          <h4 className={styles.title}>{project.name}</h4>
          <span>{project.client_company_name}</span>
          <span>Chef de projet</span>
          <span>Nombre d'affaires</span>
          <div className={styles.logoContainer}>
            <img className={styles.logo} src={logoProjex.src} alt="Logo" />
          </div>
        </section>
      </div>
    </ShadowCard>
  );
};

export default ProjectCard;
