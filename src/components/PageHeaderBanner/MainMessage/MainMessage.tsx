import React from 'react';
import styles from './MainMessage.module.scss';
import { capitalize } from '../../../../utils/capitalize';
import { ProjectModel } from '../../../../models/ProjectModel';
import defaultImage from '../../../../public/default-affair-image.png';
import { ManageItemButton } from '@projex/ui';

type Props = {
  project: Partial<ProjectModel>;
};

const MainMessage = ({ project }: Props) => {
  return (
    <div className={styles.mainMessage}>
      <div className={styles.stickerContainer}>
        {project.image ? (
          <div className={styles.imageContainer}>
            {/* // TODO Revoir image */}
            <img className={styles.image} src={defaultImage.src} alt="Image illustrant le projet" />
            <div className={styles.editImageButton}>
              <ManageItemButton
                label="Modifier la vignette"
                type="edit"
                direction="vertical"
                tiny
                onClick={() => console.log('')}
              />
            </div>
          </div>
        ) : (
          <ManageItemButton label="Définir une vignette" direction="vertical" tiny onClick={() => console.log('')} />
        )}
      </div>
      <section className={styles.content}>
        <h2 className={`page-header-banner-title ${styles.title}`}>
          {project.name ? capitalize(project.name) : 'Projet'}
        </h2>
        {project.client_company_name ? (
          <h3 className={styles.subtitle}>{capitalize(project.client_company_name)}</h3>
        ) : null}
      </section>
    </div>
  );
};

export default MainMessage;
