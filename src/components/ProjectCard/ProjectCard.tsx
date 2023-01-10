import React from 'react';
import { ShadowCard } from '@projex/ui';
import styles from './ProjectCard.module.scss';

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
