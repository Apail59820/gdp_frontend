import React from 'react';
import styles from './MainMessage.module.scss';
import { capitalize } from '../../../../utils/capitalize';
import { ProjectModel } from '../../../../models/ProjectModel';
import defaultImage from '../../../../public/default-affair-image.png';

type Props = {
  project: Partial<ProjectModel>;
};

const MainMessage = ({ project }: Props) => {
  return (
    <div className={styles.mainMessage}>
      {project.image ? (
        <div className={styles.imageContainer}>
          {/* TODO Revoir image */}
          <img src={defaultImage.src} alt="" />
        </div>
      ) : null}
      <section className={styles.content}>
        <h2 className={`page-header-banner-title ${styles.title}`}>
          {project.name ? capitalize(project.name) : 'Projet'}
        </h2>
        {project.client_info ? <h2 className={styles.subtitle}>{capitalize(project.client_info)}</h2> : null}
      </section>
    </div>
  );
};

export default MainMessage;
