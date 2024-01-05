import React, { useEffect, useRef, useState } from 'react';
import styles from './MainMessage.module.scss';
import { capitalize } from '../../../../utils/capitalize';
import { GdpProjectsModel } from '../../../../models/GestionDeProjets/GdpProjectsModel';
import defaultImage from '../../../../public/default-affair-image.png';
import { ManageItemButton } from 'projex-ui';
import { message, Tooltip } from 'antd';
import {
  GdpAssetDocumentEnum,
  GdpFilesStatusEnum,
  GdpFileUsageEnum,
} from '../../../../models/GestionDeProjets/GdpFilesModel';
import { downloadGdPFile, uploadGdpFile } from '../../../../services/gestionDeProjets/GdpFiles';
import { isRequestSuccessful } from '../../../../utils/isRequestSuccessful';
import { updateGdpProject } from '../../../../services/gestionDeProjets/GdpProjects';
import {selectProjects, setProjects} from "../../../../store/reducers/projectsReducer";
import {useDispatch, useSelector} from "react-redux";
import {sliceModelItem} from "../../../../utils/array";

export type MainMessageProps = {
  project: Partial<GdpProjectsModel>;
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

const MainMessage = ({ project, showImage = true, resizeTitleProps }: MainMessageProps) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const mainMessageTitleRef = useRef<HTMLDivElement>(null);
  const mainMessageImageRef = useRef<HTMLDivElement>(null);
  const { entityLogoWidth } = resizeTitleProps || {};
  const [resizeTitle, setResizeTitle] = useState<number>(0);
  const [projectsNameLength, setProjectsNameLength] = useState<number>(0);
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(0);
  const [isNameTooLong, setIsNameTooLong] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [textAreaLength, setTextAreaLength] = useState<number>(0);
  const [projectImage, setProjectImage] = useState<string>(defaultImage.src);

  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (project.image) {
      downloadGdPFile(project.image).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) setProjectImage(res.data);
        else setProjectImage(defaultImage.src);
      });
    } else {
      setProjectImage(defaultImage.src);
    }
  }, [project.image]);

  const handleManageItemButtonClick = () => {
    if (!inputRef?.current) return;
    inputRef.current.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && project.id) {
      const proprerties = {
        title: e.target.files[0].name,
        filesize: e.target.files[0].size,
        filename_download: e.target.files[0].name,
        status: GdpFilesStatusEnum.VISIBLE,
        usage: GdpFileUsageEnum.PROJECTS_IMAGE,
        projects_id: project.id,
        affair_id: null,
        phase_id: null,
        is_cover: true,
        document_type: GdpAssetDocumentEnum.UNKNOWN,
      };
      uploadGdpFile(proprerties, e.target.files[0]).then((res) => {
        const uploadedFileId = res.data.id;
        if (isRequestSuccessful(res.status) && res.data && res.data.id && project.id) {
          message.success("L'image a été importée avec succès");
          updateGdpProject(project.id, { image: res.data.id }).then((res) => {
            if (isRequestSuccessful(res.status) && res.data) {
              message.success("L'image a été associée au projet");
              dispatch(
               setProjects(
                 sliceModelItem<GdpProjectsModel>(projects, project.id, { 'image': uploadedFileId })
              ));
            } else {
              message.error("Une erreur est survenue lors de l'association de l'image au projet");
            }
          });
        } else {
          message.error("Une erreur est survenue lors de l'import du fichier");
        }
      });
    }
  };

  return (
    <div className={styles.mainMessage}>
      {showImage ? (
        <div className={styles.stickerContainer}>
          {project ? (
            <div className={styles.imageContainer} ref={mainMessageImageRef}>
              <img
                className={styles.image}
                data-main-message-image-container-length={mainMessageImageRef.current?.clientWidth}
                src={projectImage}
                alt="Image illustrant le projet"
              />
              <div className={styles.editImageButton}>
                <input
                  type="file"
                  multiple={false}
                  ref={inputRef}
                  name={'fileInput'}
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <ManageItemButton
                  label="Modifier la vignette"
                  type="edit"
                  direction="vertical"
                  tiny
                  onClick={handleManageItemButtonClick}
                />
              </div>
            </div>
          ) : null}
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
