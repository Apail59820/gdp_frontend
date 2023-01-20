import React from 'react';
import styles from './ProjectCard.module.scss';
import { ShadowCard } from '@projex/ui';
import type { ProjectModel } from '../../../Models/ProjectModel';
import { capitalize } from '../../../utils/capitalize';
import defaultImage from '../../../public/default-affair-image.png';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';

type Props = {
  project: ProjectModel;
  projectManagerName: string;
};

const ProjectCard = ({ project, projectManagerName }: Props) => {
  const { name, client_company_name, affairs, company_entity } = project;

  return (
    <ShadowCard>
      <div className={styles.projectCard}>
        <img
          className={styles.image}
          src={project.image || defaultImage.src}
          alt={`Image illustrant le projet ${project.name}`}
        />
        <section className={styles.content}>
          <h4 className={styles.title}>{name ? capitalize(name) : '/'}</h4>
          <span>{client_company_name ? capitalize(client_company_name) : client_company_name}</span>
          <span>{projectManagerName ? capitalize(projectManagerName) : '/'}</span>
          {affairs?.length ? (
            <span>
              {affairs?.length} affaire{affairs.length > 1 ? 's' : ''}
            </span>
          ) : null}
          <div className={styles.logoContainer}>
            <img className={styles.logo} src={getImagesByCompany(company_entity).logo} alt="Logo" />
          </div>
        </section>
      </div>
    </ShadowCard>
  );
};

export default ProjectCard;
