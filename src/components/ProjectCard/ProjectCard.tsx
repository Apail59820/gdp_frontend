import React from 'react';
import styles from './ProjectCard.module.scss';
import { ShadowCard } from '@projex/ui';

type Props = {
  project: {
    name: string;
    client_company_name: string;
    client_info: string;
    address: string;
    zip_code: string;
    city: string;
    country: string;
  };
};

const ProjectCard = ({ project }: Props) => {
  return (
    <ShadowCard>
      <div className={styles.projectCard}>ProjectCard</div>
    </ShadowCard>
  );
};

export default ProjectCard;
