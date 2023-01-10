import React from 'react';
import styles from './ProjectCard.module.scss';
import { ShadowCard } from '@projex/ui';
import type { ProjectModel } from '../../../models/ProjectModel';
import img from '../../../public/project-image.png';
import logoGroupeProjex from '../../../public/logo-groupe-projex.svg';
import logoAmexia from '../../../public/logo-amexia.svg';
import logoDiagobat from '../../../public/logo-diagobat.svg';
import logoImperium from '../../../public/logo-imperium.svg';
import logoProbim from '../../../public/logo-probim.svg';
import logoProjex from '../../../public/logo-projex.svg';

type Props = {
  project: ProjectModel;
  affairsCount: number;
  projectManagerName: string;
  company?: 'amexia' | 'diagobat' | 'imperium' | 'probim' | 'projex';
};

const ProjectCard = ({ project, projectManagerName, affairsCount, company }: Props) => {
  const getImageSrc = () => {
    switch (company) {
      case 'amexia':
        return logoAmexia.src;
      case 'diagobat':
        return logoDiagobat.src;
      case 'imperium':
        return logoImperium.src;
      case 'probim':
        return logoProbim.src;
      case 'projex':
        return logoProjex.src;
      default:
        return logoGroupeProjex.src;
    }
  };

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
          <span>{projectManagerName}</span>
          <span>{affairsCount} affaires</span>
          <div className={styles.logoContainer}>
            <img className={styles.logo} src={getImageSrc()} alt="Logo" />
          </div>
        </section>
      </div>
    </ShadowCard>
  );
};

export default ProjectCard;
