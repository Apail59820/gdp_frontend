import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './MainMessage.module.scss';
import { capitalize } from '../../../../utils/capitalize';
import { GdpProjectsModel } from '../../../../models/GestionDeProjets/GdpProjectsModel';
import defaultImage from '../../../../public/default-affair-image.png';
import { ManageItemButton } from '@projex/ui';
import { Tooltip } from 'antd';

export type MainMessageProps = {
  project: Partial<GdpProjectsModel>;
  onManageThumbnailClick?: React.MouseEventHandler<HTMLButtonElement>;
  showImage?: boolean;
  resizeTitleProps?: { entityLogoWidth: number };
};

const resizeTitleCalculator = (
  titleLength: number,
  titleClientWidth: number,
  containerInnerWidth: number,
  mainMessageImageContainerLength: number,
  logoWidth: number
): number => {
  return (
    (titleLength / titleClientWidth) *
    (containerInnerWidth - mainMessageImageContainerLength - logoWidth - (82 + 64 + 64))
  );
};

const MainMessage = ({ project, showImage = true, onManageThumbnailClick, resizeTitleProps }: MainMessageProps) => {
  const mainMessageTitleRef = useRef<HTMLDivElement>(null);
  const mainMessageImageRef = useRef<HTMLDivElement>(null);
  const { entityLogoWidth } = resizeTitleProps || {};
  const [resizeTitle, setResizeTitle] = useState<number>(0);
  const [projectsNameLength, setProjectsNameLength] = useState<number>(0);
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(0);
  const [isNameTooLong, setIsNameTooLong] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [textAreaLength, setTextAreaLength] = useState<number>(0);

  useEffect(() => {
    setProjectsNameLength(project.name?.length as number);
    setWindowInnerWidth(window.innerWidth);
    setTextAreaLength((mainMessageTitleRef.current?.clientWidth as number) + 64);
  }, [project.name]);

  useEffect(() => {
    const handleResize = () => setWindowInnerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowInnerWidth]);

  useEffect(() => {
    setResizeTitle(
      resizeTitleCalculator(
        projectsNameLength,
        textAreaLength,
        windowInnerWidth,
        mainMessageImageRef.current?.clientWidth as number,
        entityLogoWidth as number
      )
    );
    if (resizeTitle < projectsNameLength) {
      setIsNameTooLong(true);
      setProjectName(`${project.name?.slice(0, Math.round(resizeTitle))?.trim()}…`);
    } else setIsNameTooLong(false);
  }, [entityLogoWidth, projectsNameLength, resizeTitle, textAreaLength, windowInnerWidth]);

  return (
    <div className={styles.mainMessage}>
      {showImage && onManageThumbnailClick ? (
        <div className={styles.stickerContainer}>
          {project ? (
            <div className={styles.imageContainer} ref={mainMessageImageRef}>
              {/* // TODO Revoir image */}
              <img
                className={styles.image}
                data-main-message-image-container-length={mainMessageImageRef.current?.clientWidth}
                src={defaultImage.src ? defaultImage.src : ''}
                alt="Image illustrant le projet"
              />
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
        <h2
          ref={mainMessageTitleRef}
          className={`page-header-banner-title ${styles.title}`}
          data-title-length={project.name?.length}
          data-title-client-width={textAreaLength}
        >
          {isNameTooLong ? (
            <span className={styles.longName}>
              <Tooltip title={project.name}>{project.name ? projectName : 'Projet'}</Tooltip>
            </span>
          ) : (
            <span>{project.name ? capitalize(project.name) : 'Projet'}</span>
          )}
        </h2>
        {project.client_company_name ? (
          <h3 className={styles.subtitle}>{capitalize(project.client_company_name)}</h3>
        ) : null}
      </section>
    </div>
  );
};
export default MainMessage;
