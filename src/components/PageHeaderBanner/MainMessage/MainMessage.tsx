import React from 'react';
import styles from './MainMessage.module.scss';
import { capitalize } from '../../../../utils/capitalize';
import { GdpProjectModel } from '../../../../models/GestionDeProjets/GdpProjectModel';
import defaultImage from '../../../../public/default-affair-image.png';
import { ManageItemButton } from '@projex/ui';

export type MainMessageProps = {
  project: Partial<GdpProjectModel>;
  onManageThumbnailClick?: React.MouseEventHandler<HTMLButtonElement>;
  showImage?: boolean;
};

const MainMessage = ({ project, showImage = true, onManageThumbnailClick }: MainMessageProps) => {
  return (
    <div className={styles.mainMessage}>
      {showImage && onManageThumbnailClick ? (
        <div className={styles.stickerContainer}>
          {project ? (
            <div className={styles.imageContainer}>
              {/* // TODO Revoir image */}
              <img className={styles.image} src={defaultImage.src} alt="Image illustrant le projet" />
              <div className={styles.editImageButton}>
                <ManageItemButton
                  label="Modifier la vignette"
                  type="edit"
                  direction="vertical"
                  tiny
                  onClick={onManageThumbnailClick}
                />
              </div>
            </div>
          ) : (
            <ManageItemButton label="Définir une vignette" direction="vertical" tiny onClick={onManageThumbnailClick} />
          )}
        </div>
      ) : null}
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
